const fs = require("mz/fs");
const path = require("path");

/*

Data types:

bool: i1
byte: i8
short: i16
int: i32
long: i64
float: float
double: double

*/

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide an .ast file.");
        return;
    }
    const ast = JSON.parse((await fs.readFile(filename)).toString());
    const outputFilename = path.basename(filename, ".ast") + ".ll";
    const funTypes = new Map();
    funTypes.set("putchar", "int");
    const dataTypeMap = new Map();
    dataTypeMap.set("bool", "i1");
    dataTypeMap.set("byte", "i8");
    dataTypeMap.set("short", "i16");
    dataTypeMap.set("int", "i32");
    dataTypeMap.set("long", "i64");
    dataTypeMap.set("float", "float");
    dataTypeMap.set("double", "double");
    const dataTypePriority = new Map();
    dataTypePriority.set("bool", 1);
    dataTypePriority.set("byte", 2);
    dataTypePriority.set("short", 3);
    dataTypePriority.set("int", 4);
    dataTypePriority.set("long", 5);
    dataTypePriority.set("float", 6);
    dataTypePriority.set("double", 7);
    const context = {
        nextTemp: 1,
        funTypes,
        dataTypeMap,
        dataTypePriority
    };
    const { topCode } = generate(ast, context, null);
    await fs.writeFile(outputFilename, topCode.join("\n"));
    console.log(`Wrote ${outputFilename}.`);
}

/*

returns {
    topCode,
    valueCode,
    dataType
}

*/
function generate(node, context, variables) {
    if (node.type === "program") {
        return generateProgram(node, context, null);
    } else if (node.type === "var_assign") {
        return generateVarAssign(node, context, variables);
    } else if (node.type === "identifier") {
        return generateVarRef(node, context, variables);
    } else if (node.type === "bin_expr") {
        return generateBinExpr(node, context, variables);
    } else if (node.type === "fun_call") {
        return generateFunCall(node, context, variables);
    } else if (node.type === "number") {
        return generateNumberConstant(node, context, variables);
    } else if (node.type === "fun_def") {
        return generateFunDef(node, context, variables);
    } else if (node.type === "return") {
        return generateReturn(node, context, variables);
    } else {
        throw new Error("Unsupported node type: " + node.type);
    }
}

function generateReturn(node, context, variables) {
    const valueResult = generate(node.value, context, variables);
    const llDataType = context.dataTypeMap.get(valueResult.dataType);
    const topCode = [
        ...valueResult.topCode,
        `ret ${llDataType} ${valueResult.valueCode}`
    ];
    return {
        topCode,
        valueCode: null,
        dataType: valueResult.dataType
    };
}

function generateFunDef(node, context) {
    const variables = new Map();
    const paramList = [];
    const allocaStoreInstructions = [];
    for (const param of node.parameters) {
        const paramName = param.name.value;
        const paramDataType = param.data_type && param.data_type.value;
        variables.set(paramName, paramDataType);
        const llParamDataType = context.dataTypeMap.get(paramDataType);
        paramList.push(`${llParamDataType} %_${paramName}`);
        allocaStoreInstructions.push(
            `%${paramName} = alloca ${llParamDataType}`,
            `store ${llParamDataType} %_${paramName}, ${llParamDataType}* %${paramName}`
        );
    }
    const funName = node.fun_name.value;
    context.funTypes.set(funName, node.data_type && node.data_type.value);
    
    const body = 
    allocaStoreInstructions.concat(
    node.body.map(statement => {
        const { topCode } = generate(statement, context, variables);
        return topCode.join("\n");
    })).join("\n");
    
    const topCode = [
        `define i32 @${funName}(${paramList.join(", ")}) {`,
        indent(body),
        "}",
        ""
    ];
    return {
        topCode,
        valueCode: null,
        dataType: null
    };
}

function generateNumberConstant(node, context, variables) {
    let dataType;
    if (node.value.indexOf(".") === -1) {
        dataType = "int";
    } else {
        dataType = "double";
    }
    return {
        topCode: [], 
        valueCode: node.value,
        dataType
    };
}

function generateFunCall(node, context, variables) {
    const funName = node.fun_name.value;
    if (context.dataTypeMap.has(funName)) {
        return generateTypeCastFunCall(node, context, variables);
    }
    const argResults = node.arguments.map(arg => generate(arg, context, variables));
    const outputDataType = context.funTypes.get(node.fun_name.value);
    const llOutputDataType = context.dataTypeMap.get(outputDataType);
    const argList = argResults.map(argResult => {
        const llDataType = context.dataTypeMap.get(argResult.dataType);
        return llDataType + " " + argResult.valueCode;
    }).join(", ");
    const tmpVarName = "%tmp" + context.nextTemp++;
    
    const childCode = argResults.reduce((childCode, argResult) => {
        return childCode.concat(argResult.topCode);
    }, []);
    const code = [
        ...childCode,
        `${tmpVarName} = call ${llOutputDataType} @${funName} (${argList})`
    ];
    return {
        topCode: code, 
        valueCode: tmpVarName,
        dataType: outputDataType
    };
}

function generateTypeCastFunCall(node, context, variables) {
    const destDataType = node.fun_name.value;
    const llDestDataType = context.dataTypeMap.get(destDataType);
    if (node.arguments.length > 1) {
        throw new Error(`${locInfo(node.fun_name)}: A type cast expression can only handle one argument, ${node.arguments.length} was given.`);
    }
    const value = node.arguments[0];
    const valueResult = generate(value, context, variables);
    const tmpVarName = newTempVar(context);
    const llSourceDataType = context.dataTypeMap.get(valueResult.dataType);
    let instruction;
    const sourcePriority = context.dataTypePriority.get(valueResult.dataType);
    const destPriority = context.dataTypePriority.get(destDataType);
    const valueCode = valueResult.valueCode;
    
    const isSourceFloat = sourcePriority >= 6;
    const isDestFloat = destPriority >= 6;
    if (isSourceFloat && !isDestFloat) {
        instruction = `${tmpVarName} = fptosi ${llSourceDataType} ${valueCode} to ${llDestDataType}`;
    } else if (!isSourceFloat && isDestFloat) {
        instruction = `${tmpVarName} = sitofp ${llSourceDataType} ${valueCode} to ${llDestDataType}`;
    } else if (!isSourceFloat && !isDestFloat) {
        if (destPriority > sourcePriority) {
            instruction = `${tmpVarName} = zext ${llSourceDataType} ${valueCode} to ${llDestDataType}`;
        } else {
            instruction = `${tmpVarName} = trunc ${llSourceDataType} ${valueCode} to ${llDestDataType}`;
        }
    } else {
        if (destPriority > sourcePriority) {
            instruction = `${tmpVarName} = fpext ${llSourceDataType} ${valueCode} to ${llDestDataType}`;
        } else {
            instruction = `${tmpVarName} = fptrunc ${llSourceDataType} ${valueCode} to ${llDestDataType}`;
        }
    }
    
    const topCode = [
        ...valueResult.topCode,
        instruction
    ];
    return {
        topCode,
        valueCode: tmpVarName,
        dataType: destDataType
    }
}

function generateImplicitTypeCast(sourceDataType, destDataType, valueCode, context) {
    const llDestDataType = context.dataTypeMap.get(destDataType);
    const llSourceDataType = context.dataTypeMap.get(sourceDataType);
    const destPriority = context.dataTypePriority.get(destDataType);
    const sourcePriority = context.dataTypePriority.get(sourceDataType);
    const isDestFloat = isFloat(destDataType, context);
    const isSourceFloat = isFloat(sourceDataType, context);
    const tmpVarName = newTempVar(context);
    
    let instruction;
    
    if (isSourceFloat && !isDestFloat) {
        throw new Error(`Cannot implicitly cast a ${sourceDataType} to a ${destDataType}`);
    } else if (!isSourceFloat && isDestFloat) {
        throw new Error(`Cannot implicitly cast a ${sourceDataType} to a ${destDataType}`);
    } else if (!isSourceFloat && !isDestFloat) {
        if (destPriority > sourcePriority) {
            instruction = `${tmpVarName} = zext ${llSourceDataType} ${valueCode} to ${llDestDataType}`;
        } else {
            throw new Error(`Cannot implicitly cast a ${sourceDataType} to a ${destDataType}`);
        }
    } else {
        if (destPriority > sourcePriority) {
            instruction = `${tmpVarName} = fpext ${llSourceDataType} ${valueCode} to ${llDestDataType}`;
        } else {
            throw new Error(`Cannot implicitly cast a ${sourceDataType} to a ${destDataType}`);
        }
    }
    
    const topCode = [
        instruction
    ];
    return {
        topCode,
        valueCode: tmpVarName,
        dataType: destDataType
    }
}

function generateBinExpr(node, context, variables) {
    let { topCode: leftCode, valueCode: leftInlined, dataType: leftDataType } = 
        generate(node.left, context, variables);
    let { topCode: rightCode, valueCode: rightInlined, dataType: rightDataType } = 
        generate(node.right, context, variables);
    const operator = node.operator.value;
    let dataType;
    const topCode = [
        ...leftCode,
        ...rightCode
    ];
    
    if (leftDataType != rightDataType) {
        // perform a type cast
        const leftPriority = context.dataTypePriority.get(leftDataType);
        const rightPriority = context.dataTypePriority.get(rightDataType);
        if (leftPriority > rightPriority) {
            // cast right to the same type as left
            const typeCastResult = generateImplicitTypeCast(rightDataType, leftDataType, rightInlined, context);
            topCode.push(...typeCastResult.topCode);
            rightInlined = typeCastResult.valueCode;
            dataType = leftDataType;
        } else {
            // cast left to the same type as right
            const typeCastResult = generateImplicitTypeCast(leftDataType, rightDataType, leftInlined, context);
            topCode.push(...typeCastResult.topCode);
            leftInlined = typeCastResult.valueCode;
            dataType = rightDataType;
        }
    } else {
        dataType = leftDataType;
    }
    
    if (!dataType) {
        console.log("variables", variables);
        throw new Error(`${locInfo(node.left)}: cannot determine data type for binary operation.`);
    }
    const llDataType = context.dataTypeMap.get(dataType);
    const varName = "%tmp" + context.nextTemp++;
    let ins;
    if (operator === "+") {
        ins = isFloat(dataType, context) ? "fadd" : "add";
    } else if (operator === "-") {
        ins = isFloat(dataType, context) ? "fsub" : "sub";
    } else if (operator === "*") {
        ins = isFloat(dataType, context) ? "fmul" : "mul";
    } else if (operator === "+") {
        ins = isFloat(dataType, context) ? "fdiv" : "div";
    }
    
    const code = `${varName} = ${ins} ${llDataType} ${leftInlined}, ${rightInlined}`;
    //console.log("bin op instruction: " + code, dataType, isFloat(dataType, context));
    topCode.push(code);
    return {
        topCode: topCode, 
        valueCode: varName,
        dataType
    };
}

function generateVarRef(node, context, variables) {
    const varName = node.value;
    const dataType = variables.get(node.value);
    const tempVarName = "%tmp" + context.nextTemp++;
    const llDataType = context.dataTypeMap.get(dataType);
    const code = [
        `${tempVarName} = load ${llDataType}, ${llDataType}* %${varName}`
    ];
    return {
        topCode: code, 
        valueCode: tempVarName,
        dataType
    };
}

function generateVarAssign(node, context, variables) {
    const code = [];
    const varName = node.var_name.value;
    const explicitDataType = node.data_type && node.data_type.value;
    let dataType = variables.get(varName);
    if (dataType && explicitDataType) {
        throw new Error(`${locInfo(node.var_name)}: Redefining data type of variable ${varName}.`);
    }
    if (explicitDataType) {
        dataType = explicitDataType;
    }

    const valueResult = generate(node.value, context, variables);
    let valueCode = valueResult.valueCode;
    code.push(...valueResult.topCode);
    
    if (!dataType) {
        dataType = valueResult.dataType;
    } else if (dataType != valueResult.dataType) {
        const dataTypePriority = context.dataTypePriority.get(dataType);
        const valueDataTypePriority = context.dataTypePriority.get(valueResult.dataType);
        if (dataTypePriority > valueDataTypePriority) {
            const llValueType = context.dataTypeMap.get(valueResult.dataType);
            const llDataType = context.dataTypeMap.get(dataType);
            const tmpVarName = "%tmp" + context.nextTemp++;
            code.push(`${tmpVarName} = zext ${llValueType} ${valueResult.valueCode} to ${llDataType}`);
            valueCode = tmpVarName;
        } else {
            throw new Error(`Data types do not match: ${dataType} vs ${valueResult.dataType}`);
        }
    }
    
    if (!dataType) {
        throw new Error(`${locInfo(node.var_name)}: Unable to infer data type for ${varName}`);
    }
    
    if (!variables.has(varName)) {
        variables.set(varName, dataType);
    }
    const llDataType = context.dataTypeMap.get(dataType);
    code.push(
        `%${varName} = alloca ${llDataType}`,
        `store ${llDataType} ${valueCode}, ${llDataType}* %${varName}`
    );
    return {
        topCode: code, 
        valueCode: "%" + varName,
        dataType
    };
}

function generateProgram(node, context) {
    const topCode = node.body.map(statement => {
        const { topCode } = generate(statement, context, null);
        return topCode.join("\n");
    });
    return {
        topCode,
        valueCode: null,
        dataType: null
    };
}

function locInfo(token) {
    return `Line ${token.line} column ${token.col}`;
}

function isFloat(dataType, context) {
    return context.dataTypePriority.get(dataType) >= 6;
}

function newTempVar(context) {
    return "%tmp" + context.nextTemp++;
}

function indent(text) {
    return text.split("\n").map(line => "  " + line).join("\n");
}

main().catch(err => console.log(err.stack));