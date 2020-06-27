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
    
    funTypes.set("free", "void");
    const dataTypeMap = new Map();
    dataTypeMap.set("bool", "i1");
    dataTypeMap.set("byte", "i8");
    dataTypeMap.set("short", "i16");
    dataTypeMap.set("int", "i32");
    dataTypeMap.set("long", "i64");
    dataTypeMap.set("float", "float");
    dataTypeMap.set("double", "double");
    dataTypeMap.set("void", "void");
    const dataTypePriority = new Map();
    dataTypePriority.set("bool", 1);
    dataTypePriority.set("byte", 2);
    dataTypePriority.set("short", 3);
    dataTypePriority.set("int", 4);
    dataTypePriority.set("long", 5);
    dataTypePriority.set("float", 6);
    dataTypePriority.set("double", 7);
    const structTable = new Map();
    const context = {
        nextTemp: 1,
        funTypes,
        dataTypeMap,
        dataTypePriority,
        structTable
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
    } else if (node.type === "if") {
        return generateIf(node, context, variables);
    } else if (node.type === "while") {
        return generateWhile(node, context, variables);
    } else if (node.type === "struct_literal") {
        return generateStructLiteral(node, context, variables);
    } else if (node.type === "alloc") {
        return generateAlloc(node, context, variables);
    } else if (node.type === "struct_def") {
        return generateStructDef(node, context, variables);
    } else if (node.type === "free") {
        return generateFree(node, context, variables);
    } else if (node.type === "null_literal") {
        return generateNullLiteral();
    } else {
        throw new Error("Unsupported node type: " + node.type);
    }
}

function generateNullLiteral() {
    return {
        topCode: [],
        valueCode: "null",
        dataType: "null"
    };
}

function generateFree(node, context, variables) {
    const value = generate(node.value, context, variables);
    const llDataType = context.dataTypeMap.get(value.dataType);
    const topCode = [
        ...value.topCode
    ];
    const tempVar = newTempVar(context);
    topCode.push(`${tempVar} = bitcast ${llDataType} ${value.valueCode} to i8*`);
    topCode.push(`call void @free(i8* ${tempVar})`);
    return {
        topCode,
        valueCode: null,
        dataType: null
    };
}

function getStructSize(structDef, context) {
    let total = 0;
    for (let entry of structDef.entries) {
        const fieldType = entry.field_type.value;
        total += getSizeForType(fieldType, context);
    }
    return total;
}

function getSizeForType(dataType, context) {
    switch (dataType) {
        case "bool":
            return 1;
        case "byte":
            return 1;
        case "short":
            return 2;
        case "int":
            return 4;
        case "long":
            return 8;
        case "float":
            return 4;
        case "double":
            return 8;
        case "void":
            return 0;
        default:
            return 8;
    }
}

// varName is passed in as the variable name to assign the struct pointer to
function generateAlloc(node, context, variables) {
    const topCode = [];
    const tempVar = newTempVar(context);
    const structPtrVar = newTempVar(context);
    const structNode = node.struct;
    const structName = structNode.structName.value;
    const llType = context.dataTypeMap.get(structName);
    const structDef = context.structTable.get(structName);
    const size = getStructSize(structDef, context);
    topCode.push(`${tempVar} = call i8* @malloc(i32 ${size})`);
    topCode.push(`${structPtrVar} = bitcast i8* ${tempVar} to ${llType}`);
    const fieldInit = generateFieldInitialization(structPtrVar, structNode, context, variables);
    topCode.push(...fieldInit.topCode);
    return {
        topCode,
        valueCode: structPtrVar,
        dataType: structName
    };
}

// Precondition: node.value is a struct_literal node
// varName is passed in as the variable name to assign the struct pointer to
function generateStructLiteral(node, context, variables) {
    const topCode = [];
    const structName = node.structName.value;
    const structId = `%struct.${structName}`;
    const tempVarName = newTempVar(context);
    topCode.push(`${tempVarName} = alloca ${structId}`);
    const structDef = context.structTable.get(structName);
    if (!structDef) {
        throw new Error(`Undefined struct ${structName}`);
    }
    const fieldInit = generateFieldInitialization(tempVarName, node, context, variables);
    topCode.push(...fieldInit.topCode);
    const retval = {
        topCode,
        valueCode: tempVarName,
        dataType: structName
    };
    return retval;
}

function generateFieldInitialization(varName, structNode, context, variables) {
    const topCode = [];
    const structName = structNode.structName.value;
    const structId = `%struct.${structName}`;
    const structDef = context.structTable.get(structName);
    for (let i = 0; i < structNode.entries.length; i++) {
        const fieldDef = structDef.entries[i];
        const fieldType = fieldDef.field_type.value;
        const llFieldType = context.dataTypeMap.get(fieldType);
        const fieldValue = generate(structNode.entries[i].field_value, context, variables);
        const fieldValueTempVar = newTempVar(context);
        topCode.push(...fieldValue.topCode);
        topCode.push(`${fieldValueTempVar} = getelementptr inbounds ${structId}, ${structId}* ${varName}, i32 0, i32 ${i}`);
        topCode.push(`store ${llFieldType} ${fieldValue.valueCode}, ${llFieldType}* ${fieldValueTempVar}`);
    }
    return {
        topCode,
        valueCode: null,
        dataType: null
    };
}

function generateStructDef(node, context, variables) {
    const structName = node.name.value;
    const llStructType = "%struct." + structName;
    context.structTable.set(structName, node);
    context.dataTypeMap.set(structName, llStructType + "*");
    const llStructDef = llStructType + " = type { " +
        node.entries.map(entry => {
            const fieldType = entry.field_type.value;
            const llType = context.dataTypeMap.get(fieldType);
            return llType;
        }).join(", ") + " }";
    return {
        topCode: [llStructDef, ""],
        valueCode: null,
        dataType: null
    };
}

function generateWhile(node, context, variables) {
    const cond = generate(node.cond, context, variables);
    const id = context.nextTemp++;
    const loopTopLabel = "loop_top" + id;
    const loopBodyLabel = "loop_body" + id;
    const loopExitLabel = "loop_exit" + id;
    const topCode = [];
    topCode.push(`br label %${loopTopLabel}`);
    topCode.push("");
    topCode.push(`${loopTopLabel}:`);
    topCode.push(...cond.topCode);
    topCode.push(`br i1 ${cond.valueCode}, label %${loopBodyLabel}, label %${loopExitLabel}`);
    const bodyTopCode = node.body.reduce((allTopCode, statement) => {
        const result = generate(statement, context, variables);
        return allTopCode.concat(result.topCode);
    }, []);
    topCode.push("");
    topCode.push(`${loopBodyLabel}:`);
    topCode.push(...bodyTopCode);
    topCode.push(`br label %${loopTopLabel}`);
    topCode.push("");
    topCode.push(`${loopExitLabel}:`);
    return {
        topCode,
        valueCode: null,
        dataType: null
    }
}

function generateIf(node, context, variables) {
    const topCode = [];
    const cond = generate(node.cond, context, variables);
    topCode.push(...cond.topCode);
    const id = context.nextTemp++;
    const trueLabel = "if_true" + id;
    const falseLabel = "if_false" + id;
    const exitLabel = "if_exit" + id;
    if (!node.alternate) {
        topCode.push(`br i1 ${cond.valueCode}, label %${trueLabel}, label %${exitLabel}`);
        // generate 2 blocks: if_true and if_exit
        const consequentTopCode = node.consequent.reduce((allTopCode, statement) => {
            const result = generate(statement, context, variables);
            return allTopCode.concat(result.topCode);
        }, []);
        
        topCode.push("");
        topCode.push(`${trueLabel}:`);
        topCode.push(...consequentTopCode);
        topCode.push(`br label %${exitLabel}`);
        topCode.push("");
        topCode.push(`${exitLabel}:`);
    } else if (node.alternate) {
        topCode.push(`br i1 ${cond.valueCode}, label %${trueLabel}, label %${falseLabel}`);
        
        const consequentTopCode = node.consequent.reduce((allTopCode, statement) => {
            const result = generate(statement, context, variables);
            return allTopCode.concat(result.topCode);
        }, []);
        
        let alternateTopCode;
        
        if (Array.isArray(node.alternate)) {
            alternateTopCode = node.alternate.reduce((allTopCode, statement) => {
                const result = generate(statement, context, variables);
                return allTopCode.concat(result.topCode);
            }, []);
        } else if (node.alternate.type === "if") {
            const alternate = generate(node.alternate, context, variables);
            alternateTopCode = alternate.topCode;
        } else {
            throw new Error(`Unexpected alternate type`);
        }
        topCode.push("");
        topCode.push(`${trueLabel}:`);
        topCode.push(...consequentTopCode);
        topCode.push(`br label %${exitLabel}`);
        topCode.push("");
        topCode.push(`${falseLabel}:`);
        topCode.push(...alternateTopCode);
        topCode.push(`br label %${exitLabel}`);
        topCode.push("");
        topCode.push(`${exitLabel}:`);
    }
    return {
        topCode,
        valueCode: null,
        dataType: null
    };
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
    const outputType = node.data_type && node.data_type.value || "void";
    const llOutputType = context.dataTypeMap.get(outputType);
    context.funTypes.set(funName, outputType);
    
    const body = 
        allocaStoreInstructions.concat(
        node.body.map(statement => {
            const { topCode } = generate(statement, context, variables);
            return topCode.join("\n");
        })).join("\n");
    
    const topCode = [
        `define ${llOutputType} @${funName}(${paramList.join(", ")}) {`,
        indent(body)
    ];
    topCode.push(    
        "}",
        ""
    );
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
    if (!context.funTypes.has(funName)) {
        throw new Error(`${locInfo(node.fun_name)}: Trying to call function ${funName} which is not defined (yet)`);
    }
    const outputDataType = context.funTypes.get(funName);
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

function generateFieldAccessor(node, context, variables) {
    const topCode = [];
    const left = generate(node.left, context, variables);
    topCode.push(...left.topCode);
    
    if (node.right.type !== "identifier") {
        throw new Error(`${locInfo(node.right)}: Expected right hand side of the dot operator to be an identifier`);
    }
    const structType = left.dataType;
    const fieldName = node.right.value;
    const llStructPtrType = context.dataTypeMap.get(structType);
    if (!llStructPtrType.startsWith("%struct.")) {
        throw new Error(locInfo(node.left) + ": Expected left hand side of dot operator to be a struct, but was " + left.dataType);
    }
    const llStructType = llStructPtrType.substring(0, llStructPtrType.length - 1);
    const structDef = context.structTable.get(structType);
    const index = indexWhere(structDef.entries, (entry) => entry.field_name.value === fieldName);
    const fieldDef = structDef.entries[index];
    const fieldType = fieldDef.field_type.value;
    const llFieldType = context.dataTypeMap.get(fieldType);
    const ptrVarName = newTempVar(context);
    const valVarName = newTempVar(context);
    topCode.push(`${ptrVarName} = getelementptr inbounds ${llStructType}, ${llStructPtrType} ${left.valueCode}, i32 0, i32 ${index}`);
    topCode.push(`${valVarName} = load ${llFieldType}, ${llFieldType}* ${ptrVarName}`);
    return {
        topCode,
        valueCode: valVarName,
        dataType: fieldType
    };
}

function indexWhere(arr, pred) {
    for (let i = 0; i < arr.length; i++) {
        if (pred(arr[i])) {
            return i;
        }
    }
    return -1;
}

function generateBinExpr(node, context, variables) {
    const operator = node.operator.value;
    if (operator === ".") {
        return generateFieldAccessor(node, context, variables);
    }
    let { topCode: leftCode, valueCode: leftInlined, dataType: leftDataType } = 
        generate(node.left, context, variables);
    let { topCode: rightCode, valueCode: rightInlined, dataType: rightDataType } = 
        generate(node.right, context, variables);
    
    let dataType;
    const topCode = [
        ...leftCode,
        ...rightCode
    ];
    
    if (isStructType(leftDataType, context) || isStructType(rightDataType, context)) {
        if (leftDataType === rightDataType) {
            dataType = leftDataType;
        } else if (leftDataType === "null") {
            dataType = rightDataType;
        } else if (rightDataType === "null") {
            dataType = leftDataType;
        } else {
            throw new Error(`${locInfo(node.left)}: Cannot compare a ${leftDataType} vs a ${rightDataType}`);
        }
        
        let ins;
        if (operator === "==") {
            ins = "icmp eq";
        } else if (operator === "!=") {
            ins = "icmp ne";
        }
        const llDataType = context.dataTypeMap.get(dataType);
        const varName = newTempVar(context);
        const code = `${varName} = ${ins} ${llDataType} ${leftInlined}, ${rightInlined}`;
        topCode.push(code);
        return {
            topCode: topCode, 
            valueCode: varName,
            dataType: "bool"
        };
    }
    
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
        throw new Error(`${locInfo(node.left)}: cannot determine data type for binary operation.`);
    }
    const llDataType = context.dataTypeMap.get(dataType);
    const varName = newTempVar(context);
    let ins;
    if (operator === "+") {
        ins = isFloat(dataType, context) ? "fadd" : "add";
    } else if (operator === "-") {
        ins = isFloat(dataType, context) ? "fsub" : "sub";
    } else if (operator === "*") {
        ins = isFloat(dataType, context) ? "fmul" : "mul";
    } else if (operator === "+") {
        ins = isFloat(dataType, context) ? "fdiv" : "div";
    } else if (operator === ">") {
        ins = isFloat(dataType, context) ? "fcmp ogt" : "icmp sgt";
    } else if (operator === "<") {
        ins = isFloat(dataType, context) ? "fcmp olt" : "icmp slt";
    } else if (operator === ">=") {
        ins = isFloat(dataType, context) ? "fcmp oge" : "icmp sge";
    } else if (operator === "<=") {
        ins = isFloat(dataType, context) ? "fcmp ole" : "icmp sle";
    } else if (operator === "==") {
        ins = isFloat(dataType, context) ? "fcmp oeq" : "icmp eq";
    } else if (operator === "!=") {
        ins = isFloat(dataType, context) ? "fcmp one" : "icmp ne";
    }
    
    if (!ins) {
        throw new Error(`${locInfo(node.operator)}: Unable to find instruction for operator ${node.operator.value}`);
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
            throw new Error(`${locInfo(node.var_name)}: Data types do not match: ${dataType} vs ${valueResult.dataType}`);
        }
    }
    
    if (!dataType) {
        throw new Error(`${locInfo(node.var_name)}: Unable to infer data type for ${varName}`);
    }
    const llDataType = context.dataTypeMap.get(dataType);
    
    if (!variables.has(varName)) {
        variables.set(varName, dataType);
        code.push(`%${varName} = alloca ${llDataType}`);
    }
    code.push(
        `store ${llDataType} ${valueCode}, ${llDataType}* %${varName}`
    );
    return {
        topCode: code, 
        valueCode: "%" + varName,
        dataType
    };
}

function generateProgram(node, context) {
    const builtInFuns = [
        `declare i32 @putchar(i32)`,
        `declare i32 @getchar()`,
        `declare i8* @malloc(i32)`,
        `declare void @free(i8*)`
    ];
    const topCode = node.body.map(statement => {
        const { topCode } = generate(statement, context, null);
        return topCode.join("\n");
    }).concat(builtInFuns);
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

function isStructType(dataType, context) {
    const llDataType = context.dataTypeMap.get(dataType);
    return llDataType && llDataType.startsWith("%struct.");
}

main().catch(err => console.log(err.stack));