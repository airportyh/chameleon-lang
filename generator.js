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
    const baseDir = path.dirname(filename);
    const outputFilename = path.join(baseDir, path.basename(filename, ".ast") + ".ll");
    const funTable = new Map();
    funTable.set("putchar", {
        input: ["int"],
        output: "int"
    });
    funTable.set("getchar", {
        input: [],
        output: "int"
    });
    funTable.set("free", {
        input: ["pointer"],
        output: "void"
    });
    funTable.set("malloc", {
        input: ["int"],
        output: "pointer"
    });
    const dataTypeMap = new Map();
    dataTypeMap.set("bool", "i1");
    dataTypeMap.set("byte", "i8");
    dataTypeMap.set("short", "i16");
    dataTypeMap.set("int", "i32");
    dataTypeMap.set("long", "i64");
    dataTypeMap.set("float", "float");
    dataTypeMap.set("double", "double");
    dataTypeMap.set("void", "void");
    dataTypeMap.set("pointer", "i8*");
    const structTable = new Map();
    const context = {
        nextTemp: 1,
        funTable,
        dataTypeMap,
        structTable
    };
    const { topCode } = gen(ast, context, []);
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
function gen(node, context, scope) {
    if (node.type === "program") {
        return genProgram(node, context, scope);
    } else if (node.type === "var_assign") {
        return genVarAssign(node, context, scope);
    } else if (node.type === "identifier") {
        return genVarRef(node, context, scope);
    } else if (node.type === "bin_expr") {
        return genBinExpr(node, context, scope);
    } else if (node.type === "fun_call") {
        return genFunCall(node, context, scope);
    } else if (node.type === "number") {
        return genNumberConstant(node, context, scope);
    } else if (node.type === "fun_def") {
        return genFunDef(node, context, scope);
    } else if (node.type === "return") {
        return genReturn(node, context, scope);
    } else if (node.type === "if") {
        return genIf(node, context, scope);
    } else if (node.type === "while") {
        return genWhile(node, context, scope);
    } else if (node.type === "break_statement") {
        return genBreak(node, context, scope);
    } else if (node.type === "struct_literal") {
        return genStructLiteral(node, context, scope);
    } else if (node.type === "alloc") {
        return genAlloc(node, context, scope);
    } else if (node.type === "struct_def") {
        return genStructDef(node, context, scope);
    } else if (node.type === "free") {
        return genFree(node, context, scope);
    } else if (node.type === "not") {
        return genNot(node, context, scope);
    } else if (node.type === "null_literal") {
        return genNullLiteral();
    } else if (node.type === "bool_literal") {
        return genBoolLiteral(node);
    } else if (node.type === "char_literal") {
        return genCharLiteral(node);
    } else if (node.type === "comment") {
        return genComment();
    } else {
        throw new Error("Unsupported node type: " + node.type + ": " + JSON.stringify(node));
    }
}

function genComment() {
    return {
        topCode: [],
        valueCode: null,
        dataType: null
    }
}

function genNot(node, context, scope) {
    const operand = gen(node.operand, context, scope);
    const tempVar = newTempVar(context);
    return {
        topCode: [
            ...operand.topCode,
            `${tempVar} = icmp eq i1 ${operand.valueCode}, 0`
        ],
        valueCode: tempVar,
        dataType: "bool"
    };
}

function genNullLiteral() {
    return {
        topCode: [],
        valueCode: "null",
        dataType: "null"
    };
}

function genBoolLiteral(node) {
    const value = node.value;
    return {
        topCode: [],
        valueCode: value === "true" ? "1" : "0",
        dataType: "bool"
    };
}

function genCharLiteral(node) {
    return {
        topCode: [],
        valueCode: node.value,
        dataType: "int"
    };
}

function genFree(node, context, scope) {
    const value = gen(node.value, context, scope);
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
function genAlloc(node, context, scope) {
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
    const fieldInit = genFieldInitialization(structPtrVar, structNode, context, scope);
    topCode.push(...fieldInit.topCode);
    return {
        topCode,
        valueCode: structPtrVar,
        dataType: structName
    };
}

// Precondition: node.value is a struct_literal node
// varName is passed in as the variable name to assign the struct pointer to
function genStructLiteral(node, context, scope) {
    const topCode = [];
    const structName = node.structName.value;
    const structId = `%struct.${structName}`;
    const tempVarName = newTempVar(context);
    topCode.push(`${tempVarName} = alloca ${structId}`);
    const structDef = context.structTable.get(structName);
    if (!structDef) {
        throw new Error(`Undefined struct ${structName}`);
    }
    const fieldInit = genFieldInitialization(tempVarName, node, context, scope);
    topCode.push(...fieldInit.topCode);
    const retval = {
        topCode,
        valueCode: tempVarName,
        dataType: structName
    };
    return retval;
}

function genFieldInitialization(varName, structNode, context, scope) {
    const topCode = [];
    const structName = structNode.structName.value;
    const structId = `%struct.${structName}`;
    const structDef = context.structTable.get(structName);
    for (let i = 0; i < structNode.entries.length; i++) {
        const fieldDef = structDef.entries[i];
        const fieldType = fieldDef.field_type.value;
        const llFieldType = context.dataTypeMap.get(fieldType);
        const fieldValue = gen(structNode.entries[i].field_value, context, scope);
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

function genStructDef(node, context, scope) {
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

function genWhile(node, context, scope) {
    const cond = gen(node.cond, context, scope);
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
    
    const newScope = {
        type: "loop",
        exitLabel: loopExitLabel
    };
    
    const bodyTopCode = node.body.reduce((allTopCode, statement) => {
        const result = gen(statement, context, [newScope, ...scope]);
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

function genBreak(node, context, scope) {
    const whileScope = getCurrentLoop(scope);
    if (!whileScope) {
        throw new Error(`${locInfo(node)}: Break statement used outside of a loop`);
    }
    return {
        topCode: [`br label %${whileScope.exitLabel}`],
        valueCode: null,
        dataType: null
    };
}

function genIf(node, context, scope) {
    const topCode = [];
    let returns = false;
    const cond = gen(node.cond, context, scope);
    if (cond.dataType !== "bool") {
        throw new Error(`${locInfo(node)}: Expected if conditional to be a bool but here it is a ${cond.dataType}`);
    }
    topCode.push(...cond.topCode);
    const id = context.nextTemp++;
    const trueLabel = "if_true" + id;
    const falseLabel = "if_false" + id;
    const exitLabel = "if_exit" + id;
    if (!node.alternate) {
        topCode.push(`br i1 ${cond.valueCode}, label %${trueLabel}, label %${exitLabel}`);
        // gen 2 blocks: if_true and if_exit
        const consequentTopCode = node.consequent.reduce((allTopCode, statement) => {
            const result = gen(statement, context, scope);
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
        
        const consequentTopCode = [];
        let consequentReturns = false;
        for (let statement of node.consequent) {
            const result = gen(statement, context, scope);
            consequentTopCode.push(...result.topCode);
            if (statement.type === "return" ||
                (statement.type === "if" && result.returns)) {
                consequentReturns = true;
            }
        }
        
        const alternateTopCode = [];
        let alternateReturns = false;
        
        if (Array.isArray(node.alternate)) {
            for (let statement of node.alternate) {
                const result = gen(statement, context, scope);
                alternateTopCode.push(...result.topCode);
                if (statement.type === "return" ||
                    (statement.type === "if" && result.returns)) {
                    alternateReturns = true;
                }
            }
        } else if (node.alternate.type === "if") {
            const alternate = gen(node.alternate, context, scope);
            alternateTopCode.push(...alternate.topCode);
            alternateReturns = alternate.returns;
        } else {
            throw new Error(`Unexpected alternate type`);
        }
        
        returns = consequentReturns && alternateReturns;
        
        topCode.push("");
        topCode.push(`${trueLabel}:`);
        topCode.push(...consequentTopCode);
        if (!returns) {
            topCode.push(`br label %${exitLabel}`);
        }
        topCode.push("");
        topCode.push(`${falseLabel}:`);
        topCode.push(...alternateTopCode);
        if (!returns) {
            topCode.push(`br label %${exitLabel}`);
        }
        topCode.push("");
        if (!returns) {
            topCode.push(`${exitLabel}:`);
        }
    }
    return {
        topCode,
        valueCode: null,
        dataType: null,
        returns
    };
}

function genReturn(node, context, scope) {
    const value = gen(node.value, context, scope);
    const fun = getCurrentFun(scope);
    const funSig = context.funTable.get(fun.funName);
    const outputType = funSig.output;
    const typeCast = implicitTypeCast(value.dataType, outputType, value.valueCode, context, node);
    const llDataType = context.dataTypeMap.get(typeCast.dataType);
    const topCode = [
        ...value.topCode,
        ...typeCast.topCode,
        `ret ${llDataType} ${typeCast.valueCode}`
    ];
    return {
        topCode,
        valueCode: null,
        dataType: typeCast.dataType
    };
}

function genFunDef(node, context, scope) {
    const variables = new Map();
    const paramList = [];
    const allocaStoreInstructions = [];
    for (const param of node.parameters) {
        const paramName = param.name.value;
        const paramDataType = param.data_type && param.data_type.value || "void";
        variables.set(paramName, paramDataType);
        const llParamDataType = context.dataTypeMap.get(paramDataType);
        paramList.push(`${llParamDataType} %_${paramName}`);
        allocaStoreInstructions.push(
            `%${paramName} = alloca ${llParamDataType}`,
            `store ${llParamDataType} %_${paramName}, ${llParamDataType}* %${paramName}`
        );
    }
    const funName = node.fun_name.value;
    //context.funTable.set(funName, funSig);
    const funSig = context.funTable.get(funName);
    const outputType = funSig.output;
    const llOutputType = context.dataTypeMap.get(outputType);
    
    const newScope = {
        type: "fun",
        funName,
        variables
    };
    
    const body = 
        allocaStoreInstructions.concat(
        node.body.map(statement => {
            const { topCode } = gen(statement, context, [newScope, ...scope]);
            return topCode.join("\n");
        }));
    if (outputType === "void") {
        body.push("ret void");
    }
    
    const topCode = [
        `define ${llOutputType} @${funName}(${paramList.join(", ")}) {`,
        indent(body.join("\n"))
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

function genNumberConstant(node, context) {
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

function genFunCall(node, context, scope) {
    const funName = node.fun_name.value;
    if (context.dataTypeMap.has(funName)) {
        return explicitTypeCast(node, context, scope);
    }
    if (!context.funTable.has(funName)) {
        throw new Error(`${locInfo(node)}: Trying to call function ${funName} which is not defined`);
    }
    const topCode = [];
    const funSig = context.funTable.get(funName);
    const outputDataType = funSig.output;
    const llOutputDataType = context.dataTypeMap.get(outputDataType);
    if (funSig.input.length !== node.arguments.length) {
        throw new Error(`${locInfo(node)}: Function ${funName} accepts ${funSig.input.length} arguments, but was given ${node.arguments.length}`);
    }
    const argList = [];
    for (let i = 0; i < node.arguments.length; i++) {
        const arg = gen(node.arguments[i], context, scope);
        topCode.push(...arg.topCode);
        const argNode = node.arguments[i];
        const sigDataType = funSig.input[i];
        const typeCast = implicitTypeCast(
            arg.dataType, sigDataType, arg.valueCode, context, argNode);
        topCode.push(...typeCast.topCode);
        const llDataType = context.dataTypeMap.get(typeCast.dataType);
        argList.push(llDataType + " " + typeCast.valueCode);
    }
    if (outputDataType === "void") {
        topCode.push(`call ${llOutputDataType} @${funName} (${argList})`);
        return {
            topCode, 
            valueCode: null,
            dataType: outputDataType
        };
    } else {
        const tmpVarName = "%tmp" + context.nextTemp++;
        topCode.push(`${tmpVarName} = call ${llOutputDataType} @${funName} (${argList})`);
        return {
            topCode, 
            valueCode: tmpVarName,
            dataType: outputDataType
        };
    }
}

// An explicit type cast is issued by the programmer as a function call, i.e.: int(n)
// Assumes the node parameter is a funCall node
// Only handles numeric types at the moment
function explicitTypeCast(node, context, scope) {
    const topCode = [];
    const destDataType = node.fun_name.value;
    const llDestDataType = context.dataTypeMap.get(destDataType);
    if (node.arguments.length > 1) {
        throw new Error(`${locInfo(node.fun_name)}: A type cast expression can only handle one argument, ${node.arguments.length} was given.`);
    }
    const value = gen(node.arguments[0], context, scope);
    topCode.push(...value.topCode);
    const srcDataType = value.dataType;
    let typeCast;
    
    if (srcDataType === destDataType) {
        return value;
    } else if (isIntegerType(srcDataType) && isIntegerType(destDataType)) {
        const srcTypePriority = getIntTypePriority(srcDataType);
        const destTypePriority = getIntTypePriority(destDataType);
        const downcast = srcTypePriority > destTypePriority;
        typeCast = integerTypeCast(srcDataType, destDataType, value.valueCode, context, downcast);
    } else if (isFloatType(srcDataType) && isFloatType(destDataType)) {
        const downcast = srcDataType === "double";
        typeCast = floatTypeCast(srcDataType, destDataType, value.valueCode, context, downcast);
    } else if (isIntegerType(srcDataType) && isFloatType(destDataType)){
        typeCast = integerToFloatTypeCast(srcDataType, destDataType, value.valueCode, context);
    } else if (isFloatType(srcDataType) && isIntegerType(destDataType)){
        typeCast = floatToIntegerTypeCast(srcDataType, destDataType, value.valueCode, context);
    } else {
        throw new Error(`${locInfo(node)}: Cannot cast a ${srcDataType} to a ${destDataType}`);
    }
    
    topCode.push(...typeCast.topCode);
    return {
        topCode,
        valueCode: typeCast.valueCode,
        dataType: typeCast.dataType
    };
}

function genFieldAccessor(node, context, scope) {
    const topCode = [];
    const left = gen(node.left, context, scope);
    topCode.push(...left.topCode);
    
    const structType = left.dataType;
    
    if (node.right.type !== "identifier") {
        throw new Error(`${locInfo(node.right)}: Expected right hand side of the dot operator to be an identifier`);
    }
    const fieldName = node.right.value;
    
    const llStructPtrType = context.dataTypeMap.get(structType);
    if (!llStructPtrType.startsWith("%struct.")) {
        throw new Error(locInfo(node.left) + ": Expected left hand side of dot operator to be a struct, but was " + left.dataType);
    }
    
    // substring to remove the * from the end of the type: %struct.MyStruct*
    const llStructType = llStructPtrType.substring(0, llStructPtrType.length - 1);
    const structDef = context.structTable.get(structType);
    const index = indexWhere(structDef.entries, (entry) => entry.field_name.value === fieldName);
    if (index === -1) {
        throw new Error(`${locInfo(node.left)}: Cannot find field ${fieldName} on struct ${structType}`);
    }
    const fieldDef = structDef.entries[index];
    const fieldType = fieldDef.field_type.value;
    const llFieldType = context.dataTypeMap.get(fieldType);
    if (!llFieldType) {
        throw new Error(`${locInfo(node)}: Unable to resolve field type ${fieldType}`);
    }
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

function genBinExpr(node, context, scope) {
    const operator = node.operator.value;
    if (operator === ".") {
        return genFieldAccessor(node, context, scope);
    }
    const left = gen(node.left, context, scope);
    const right = gen(node.right, context, scope);
    
    const topCode = [
        ...left.topCode,
        ...right.topCode
    ];
    
    const twoWayTypeCast = implicit2WayTypeCast(
        left.dataType, right.dataType, left.valueCode, right.valueCode, 
        context, node);
    topCode.push(...twoWayTypeCast.topCode);
    
    const dataType = twoWayTypeCast.dataType;
    
    let operation;
    if (isFloatType(dataType)) {
        operation = genFloatOperation(
            operator, dataType, twoWayTypeCast.valueCode1, 
            twoWayTypeCast.valueCode2, context, node);
    } else if (isIntegerType(dataType)) {
        operation = genIntegerOperation(
            operator, dataType, twoWayTypeCast.valueCode1, 
            twoWayTypeCast.valueCode2, context, node);
    } else if (isStructTypeOrNull(dataType, context)) {
        operation = genPointerOperation(
            operator, dataType, twoWayTypeCast.valueCode1, 
            twoWayTypeCast.valueCode2, context, node);
    } else if (dataType === "bool") {
        operation = genBoolOperation(
            operator, twoWayTypeCast.valueCode1,
            twoWayTypeCast.valueCode2, context, node
        );
    } else {
        throw new Error(`${locInfo(node)}: Unable to find instruction for operator ${operator} for type ${dataType}`);
    }
    
    topCode.push(...operation.topCode);
    return {
        topCode,
        valueCode: operation.valueCode,
        dataType: operation.dataType
    };
}

function genFloatOperation(operator, dataType, valueCode1, valueCode2, context, node) {
    const tempVar = newTempVar(context);
    const instructionTable = {
        "+": "fadd",
        "-": "fsub",
        "*": "fmul",
        "/": "fdiv",
        ">": "fcmp ogt",
        "<": "fcmp olt",
        ">=": "fcmp oge",
        "<=": "fcmp ole",
        "==": "fcmp oeq",
        "!=": "fcmp one",
        "%": "frem"
    };
    const binaryOperations = new Set([
        ">",
        "<",
        ">=",
        "<=",
        "==",
        "!="
    ]);
    const ins = instructionTable[operator];
    if (!ins) {
        throw new Error(`${locInfo(node)}: Unable to find float instruction for operator ${operator}`);
    }
    const llDataType = context.dataTypeMap.get(dataType);
    const topCode = [
        `${tempVar} = ${ins} ${llDataType} ${valueCode1}, ${valueCode2}`
    ];
    if (binaryOperations.has(operator)) {
        dataType = "bool";
    }
    return {
        topCode,
        valueCode: tempVar,
        dataType: dataType
    };
}

function genIntegerOperation(operator, dataType, valueCode1, valueCode2, context, node) {
    const tempVar = newTempVar(context);
    const instructionTable = {
        "+": "add",
        "-": "sub",
        "*": "mul",
        "/": "sdiv",
        ">": "icmp sgt",
        "<": "icmp slt",
        ">=": "icmp sge",
        "<=": "icmp sle",
        "==": "icmp eq",
        "!=": "icmp ne",
        "%": "srem"
    };
    
    const binaryOperations = new Set([
        ">",
        "<",
        ">=",
        "<=",
        "==",
        "!="
    ]);
    const ins = instructionTable[operator];
    if (!ins) {
        throw new Error(`${locInfo(node)}: Unable to find integer instruction for operator ${operator}`);
    }
    const llDataType = context.dataTypeMap.get(dataType);
    const topCode = [
        `${tempVar} = ${ins} ${llDataType} ${valueCode1}, ${valueCode2}`
    ];
    if (binaryOperations.has(operator)) {
        dataType = "bool";
    }
    return {
        topCode,
        valueCode: tempVar,
        dataType: dataType
    };
}

function genPointerOperation(operator, dataType, valueCode1, valueCode2, context, node) {
    const tempVar = newTempVar(context);
    const instructionTable = {
        "==": "icmp eq",
        "!=": "icmp ne"
    };
    const ins = instructionTable[operator];
    if (!ins) {
        throw new Error(`${locInfo(node)}: Unable to find pointer instruction for operator ${operator}`);
    }
    const llDataType = context.dataTypeMap.get(dataType);
    const topCode = [
        `${tempVar} = ${ins} ${llDataType} ${valueCode1}, ${valueCode2}`
    ];
    return {
        topCode,
        valueCode: tempVar,
        dataType: "bool"
    };
}

function genBoolOperation(operator, valueCode1, valueCode2, context, node) {
    const instructionTable = {
        "and": "and",
        "or": "or"
    };
    const ins = instructionTable[operator];
    if (!ins) {
        throw new Error(`${locInfo(node)}: Unable to find bool instruction for operator ${operator}`);
    }
    const tempVar = newTempVar(context);
    const topCode = [
        `${tempVar} = ${ins} i1 ${valueCode1}, ${valueCode2}`
    ];
    return {
        topCode,
        valueCode: tempVar,
        dataType: "bool"
    };
}

function genVarRef(node, context, scope) {
    const varName = node.value;
    const dataType = getVariableType(varName, scope);
    if (!dataType) {
        throw new Error(`${locInfo(node)}: Reference to unknown variable ${varName}`);
    }
    const llDataType = context.dataTypeMap.get(dataType);
    const tempVarName = "%tmp" + context.nextTemp++;
    if (!llDataType) {
        throw new Error(`${locInfo(node)}: Unable to resolve type ${dataType}`);
    }
    const code = [
        `${tempVarName} = load ${llDataType}, ${llDataType}* %${varName}`
    ];
    return {
        topCode: code, 
        valueCode: tempVarName,
        dataType
    };
}

function genVarAssign(node, context, scope) {
    const topCode = [];
    const varName = node.var_name.value;
    const definedDataType = node.data_type && node.data_type.value;
    const prevDefinedDataType = getVariableType(varName, scope);
    if (definedDataType && prevDefinedDataType) {
        throw new Error(`${locInfo(node.var_name)}: Cannot re-define the data type of variable ${varName}.`);
    }

    const value = gen(node.value, context, scope);
    topCode.push(...value.topCode);
    
    let valueCode, dataType;
    if (definedDataType) {
        const typeCast = implicitTypeCast(value.dataType, definedDataType, value.valueCode, context, node);
        topCode.push(...typeCast.topCode);
        valueCode = typeCast.valueCode;
        dataType = typeCast.dataType;
    } else {
        valueCode = value.valueCode;
        dataType = value.dataType;
    }
    
    if (!dataType) {
        throw new Error(`${locInfo(node.var_name)}: Unable to infer data type for ${varName}`);
    }
    
    const llDataType = context.dataTypeMap.get(dataType);
    if (!getVariableType(varName, scope)) {
        const currentFun = getCurrentFun(scope);
        currentFun.variables.set(varName, dataType);
        topCode.push(`%${varName} = alloca ${llDataType}`);
    }
    topCode.push(
        `store ${llDataType} ${valueCode}, ${llDataType}* %${varName}`
    );
    return {
        topCode: topCode, 
        valueCode: "%" + varName,
        dataType
    };
}

function genProgram(node, context, scope) {
    const builtInFuns = [
        `declare i32 @putchar(i32)`,
        `declare i32 @getchar()`,
        `declare i8* @malloc(i32)`,
        `declare void @free(i8*)`,
        ""
    ];
    
    loadFunDefs(node.body, context);
    
    const topCode = builtInFuns.concat(
        node.body.map(statement => {
            const { topCode } = gen(statement, context, scope);
            return topCode.join("\n");
        }));
    return {
        topCode,
        valueCode: null,
        dataType: null
    };
}

function loadFunDefs(statements, context) {
    for (let node of statements) {
        if (node.type === "fun_def") {
            const funName = node.fun_name.value;
            const funSig = {
                input: [],
                output: null
            };
            for (const param of node.parameters) {
                const paramName = param.name.value;
                const paramDataType = param.data_type && param.data_type.value || "void";
                funSig.input.push(paramDataType);
                const llParamDataType = context.dataTypeMap.get(paramDataType);
            }
            const outputType = node.data_type && node.data_type.value || "void";
            funSig.output = outputType;
            context.funTable.set(funName, funSig);
        }
    }
}

function implicit2WayTypeCast(type1, type2, value1, value2, context, node) {
    if (type1 === type2) {
        return {
            topCode: [],
            valueCode1: value1,
            valueCode2: value2, 
            dataType: type1
        };
    }
    if (isIntegerType(type1) && isIntegerType(type2)) {
        const type1Priority = getIntTypePriority(type1);
        const type2Priority = getIntTypePriority(type2);
        if (type1Priority > type2Priority) {
            const typeCast = integerTypeCast(type2, type1, value2, context, false);
            return {
                topCode: typeCast.topCode,
                valueCode1: value1,
                valueCode2: typeCast.valueCode,
                dataType: type1
            };
        } else {
            const typeCast = integerTypeCast(type1, type2, value1, context, false);
            return {
                topCode: typeCast.topCode,
                valueCode1: typeCast.valueCode,
                valueCode2: value2,
                dataType: type2
            };
        }
    }
    if (isFloatType(type1) && isFloatType(type2)) {
        if (type1 === "double") {
            const typeCast = floatTypeCast(type2, type1, value2, context, false);
            return {
                topCode: typeCast.topCode,
                valueCode1: value1,
                valueCode2: typeCast.valueCode,
                dataType: type1
            };
        } else {
            const typeCast = floatTypeCast(type1, type2, value1, context, false);
            return {
                topCode: typeCast.topCode,
                valueCode1: typeCast.valueCode,
                valueCode2: value2,
                dataType: type2
            };
        }
    }
    if (isStructTypeOrNull(type1, context) && isStructTypeOrNull(type2, context)) {
        const dataType = isStructType(type1, context) ? type1 : type2;
        return {
            topCode: [],
            valueCode1: value1,
            valueCode2: value2,
            dataType
        };
    }
    throw new Error(`${locInfo(node)}: Cannot implicitly cast a ${type1} from/to a ${type2}`);
}

function getIntTypePriority(dataType) {
    switch (dataType) {
        case "byte":
            return 1;
        case "short":
            return 2;
        case "int":
            return 3;
        case "long":
            return 4;
        default:
            throw new Error("Cannot get int type priority for non-int type: " + dataType);
    }
}

function implicitTypeCast(type1, type2, valueCode, context, node) {
    if (type1 === type2) {
        return {
            topCode: [],
            valueCode, 
            dataType: type1
        };
    }
    if (isIntegerType(type1) && isIntegerType(type2)) {
        const type1Priority = getIntTypePriority(type1);
        const type2Priority = getIntTypePriority(type2);
        const downcast = type1Priority > type2Priority;
        return integerTypeCast(type1, type2, valueCode, context, downcast);
    }
    if (isFloatType(type1) && isFloatType(type2)) {
        const downcast = type1 === "double";
        return floatTypeCast(type1, type2, valueCode, context, downcast);
    }
    if (isStructTypeOrNull(type1, context) && isStructTypeOrNull(type2, context)) {
        if (isStructType(type1, context) && isStructType(type2, context)) {
            throw new Error(`${locInfo(node)}: Cannot cast a ${type1} to a ${type2}`);
        }
        const dataType = isStructType(type1, context) ? type1 : type2;
        return {
            topCode: [],
            valueCode,
            dataType
        };
    }
    throw new Error(`${locInfo(node)}: Cannot implicitly cast a ${type1} to a ${type2}`);
}

function integerTypeCast(type1, type2, valueCode, context, downcast) {
    const instruction = downcast ? "trunc" : "zext";
    return typeCast(instruction, type1, type2, valueCode, context);
}

function floatTypeCast(type1, type2, valueCode, context, downcast) {
    const instruction = downcast ? "fptrunc" : "fpext";
    return typeCast(instruction, type1, type2, valueCode, context);
}

function integerToFloatTypeCast(type1, type2, valueCode, context) {
    return typeCast("sitofp", type1, type2, valueCode, context);
}

function floatToIntegerTypeCast(type1, type2, valueCode, context) {
    return typeCast("fptosi", type1, type2, valueCode, context);
}

function typeCast(instruction, type1, type2, valueCode, context) {
    const tmpVarName = newTempVar(context);
    const llType1 = context.dataTypeMap.get(type1);
    const llType2 = context.dataTypeMap.get(type2);
    const topCode = [
        `${tmpVarName} = ${instruction} ${llType1} ${valueCode} to ${llType2}`
    ];
    return {
        topCode,
        valueCode: tmpVarName,
        dataType: type2
    };
}

function locInfo(node) {
    return `Line ${node.start.line} column ${node.start.col}`;
}

function newTempVar(context) {
    return "%tmp" + context.nextTemp++;
}

function indent(text) {
    return text.split("\n").map(line => "  " + line).join("\n");
}

function isIntegerType(type) {
    switch (type) {
        case "byte":
        case "short":
        case "int":
        case "long":
            return true;
        default:
            return false;
    }
}

function isFloatType(type) {
    return type === "float" || type === "double";
}

function isStructType(dataType, context) {
    const llDataType = context.dataTypeMap.get(dataType);
    return llDataType && llDataType.startsWith("%struct.");
}

function isStructTypeOrNull(dataType, context) {
    return dataType === "null" || isStructType(dataType, context);
}

function getVariableType(varName, scope) {
    for (let i = 0; i < scope.length; i++) {
        const current = scope[i];
        if (current.variables && current.variables.has(varName)) {            
            return current.variables.get(varName);
        }
    }
    return null;
}

function getCurrentFun(scope) {
    for (let i = 0; i < scope.length; i++) {
        const current = scope[i];
        if (current.type === "fun") {            
            return current;
        }
    }
    return null;
}

function getCurrentLoop(scope) {
    for (let i = 0; i < scope.length; i++) {
        const current = scope[i];
        if (current.type === "loop") {            
            return current;
        }
    }
    return null;
}


main().catch(err => {
    console.log(err.stack)
    process.exit(1);
});