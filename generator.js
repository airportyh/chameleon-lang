const fs = require("mz/fs");
const path = require("path");
const colors = require("colors/safe");

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
        structTable,
        gc: true // on/off master switch for gc
    };
    try {
        const { topCode } = gen(ast, context, []);
        await fs.writeFile(outputFilename, topCode.join("\n"));
        console.log(`Wrote ${outputFilename}.`);
    } catch (e) {
        const node = e.node;
        if (node) {
            const startLine = node.start.line;
            const startCol = node.start.col;
            const endLine = node.end ? node.end.line : node.start.line;
            const endCol = node.end ? node.end.col : node.start.col;
            
            const sourceFile = path.join(baseDir, path.basename(filename, ".ast") + ".chm");
            try {
                const code = (await fs.readFile(sourceFile)).toString();
                const codeLines = code.split("\n");
                const rangeStartLine = Math.max(0, startLine - 4 - 1);
                const lineNoPadAmount = String(endLine + 1).length;
                const displayLines = codeLines.slice(rangeStartLine, endLine)
                    .map((line, idx) => {
                        const lineNo = String(idx + rangeStartLine + 1).padStart(lineNoPadAmount, " ");
                        return colors.cyan(lineNo) + "  " + line
                    });
                console.log();
                console.log(displayLines.join("\n"));
                console.log(Array(startCol + 4).join(" ") + colors.red("⬆︎"));
            } catch (e) {
                // unable to display source code snippet, we'll still display the message
                // and stack trace
            }
        } else {
            console.log(colors.red("Generate Error:"));
        }
        console.log(colors.red(e.message));
        console.log();
        console.log(colors.gray(e.stack.split("\n").slice(1).join("\n")));
        process.exit(1);
    }
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
    } else if (node.type === "field_assign") {
        return genFieldAssign(node, context, scope);
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
    } else if (node.type === "string_literal") {
        return genStringLiteral(node);
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

function genAlloc(node, context, scope) {
    const topCode = [];
    const tempVar = newTempVar(context);
    const structPtrVar = newTempVar(context);
    const structNode = node.struct;
    const structName = structNode.structName.value;
    const llType = context.dataTypeMap.get(structName);
    const structDef = context.structTable.get(structName);
    if (!structDef) {
        throw makeError(`Cannot alloc undefined struct ${structName}.`, structNode);
    }
    const size = getStructSize(structDef, context);
    topCode.push(`${tempVar} = call i8* @malloc(i32 ${size})`);
    topCode.push(`${structPtrVar} = bitcast i8* ${tempVar} to ${llType}`);
    const fieldInit = genFieldInitialization(structPtrVar, structNode, context, scope);
    topCode.push(...fieldInit.topCode);
    
    const fun = getCurrentFun(scope);
    if (fun.gc) {
        const mapKeyTempVar = newTempVar(context);
        const allocMapValueTempVar = newTempVar(context);
        const newTreeTempVar = newTempVar(context);
        topCode.push(
            `${mapKeyTempVar} = ptrtoint ${llType} ${structPtrVar} to i64`,
            `${allocMapValueTempVar} = load %struct.BTreeMap*, %struct.BTreeMap** @alloc_map`,
            `${newTreeTempVar} = call %struct.BTreeMap* @btmap_set(i64 ${mapKeyTempVar}, i64 1, %struct.BTreeMap* ${allocMapValueTempVar})`,
            `store %struct.BTreeMap* ${newTreeTempVar}, %struct.BTreeMap** @alloc_map`
        );
    }
    
    return {
        topCode,
        valueCode: structPtrVar,
        dataType: structName
    };
}

// Precondition: node.value is a struct_literal node
// varName is passed in as the variable name to assign the struct pointer to
function genStructLiteral(node, context, scope) {
    throw makeError(`Creating structs on the stack is temporarily disallowed.`, node);
    const topCode = [];
    const structName = node.structName.value;
    const structId = `%struct.${structName}`;
    const tempVarName = newTempVar(context);
    topCode.push(`${tempVarName} = alloca ${structId}`);
    const structDef = context.structTable.get(structName);
    if (!structDef) {
        throw makeError(`Cannot create undefined struct ${structName}.`, node);
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
    const fun = getCurrentFun(scope);
    for (let i = 0; i < structNode.entries.length; i++) {
        const fieldDef = structDef.entries[i];
        const fieldType = fieldDef.field_type.value;
        const llFieldType = context.dataTypeMap.get(fieldType);
        const fieldValue = gen(structNode.entries[i].field_value, context, scope);
        const fieldValueTempVar = newTempVar(context);
        topCode.push(...fieldValue.topCode);
        topCode.push(`${fieldValueTempVar} = getelementptr inbounds ${structId}, ${structId}* ${varName}, i32 0, i32 ${i}`);
        topCode.push(`store ${llFieldType} ${fieldValue.valueCode}, ${llFieldType}* ${fieldValueTempVar}`);
        
        if (fun.gc && isStructType(fieldType, context)) {
            const sourceTempVar = newTempVar(context);
            const destValueTempVar = newTempVar(context);
            const destTempVar = newTempVar(context);
            topCode.push(
                `${sourceTempVar} = ptrtoint ${structId}* ${varName} to i64`,
                `${destValueTempVar} = load ${llFieldType}, ${llFieldType}* ${fieldValueTempVar}`,
                `${destTempVar} = ptrtoint ${llFieldType} ${destValueTempVar} to i64`,
                `; field initialization`,
                `call void @gc_add_assoc(i64 ${sourceTempVar}, i64 ${destTempVar})`
            );
        }
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
        throw makeError("Break statement used outside of a loop.", node);
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
        throw makeError(`Expected if conditional to be a bool but here it is a ${cond.dataType}.`, node.cond);
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
            throw makeError(`Unexpected alternate type: ${node.alternate.type}`, node.alternate);
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
    let value;
    if (node.value) {
        value = gen(node.value, context, scope);
    } else {
        value = {
            topCode: [],
            valueCode: "",
            dataType: "void"
        };
    }
    const fun = getCurrentFun(scope);
    const funSig = context.funTable.get(fun.funName);
    const outputType = funSig.output;
    const typeCast = implicitTypeCast(value.dataType, outputType, value.valueCode, context, node);
    const llDataType = context.dataTypeMap.get(typeCast.dataType);
    const topCode = [
        ...value.topCode,
        ...typeCast.topCode
    ];
    
    for (let [varName, dataType] of fun.variables.entries()) {
        if (fun.gc && isStructType(dataType, context)) {
            const structDef = context.structTable.get(dataType);
            const sourceTempVar = newTempVar(context);
            const llDataType = context.dataTypeMap.get(dataType);
            topCode.push(
                `; variable cleanup for function`,
                `${sourceTempVar} = ptrtoint ${llDataType}* %${varName} to i64`,
                `call void @gc_remove_var_ref(i64 ${sourceTempVar})`
            );
        }
    }
    
    topCode.push(`ret ${llDataType} ${typeCast.valueCode}`);
    return {
        topCode,
        valueCode: null,
        dataType: typeCast.dataType
    };
}

function genFunDef(node, context, scope) {
    const variables = new Map();
    const paramList = [];
    const body = [];
    for (const param of node.parameters) {
        const paramName = param.name.value;
        const paramDataType = param.data_type && param.data_type.value || "void";
        variables.set(paramName, paramDataType);
        const llParamDataType = context.dataTypeMap.get(paramDataType);
        paramList.push(`${llParamDataType} %_${paramName}`);
        body.push(
            `%${paramName} = alloca ${llParamDataType}`,
            `store ${llParamDataType} %_${paramName}, ${llParamDataType}* %${paramName}`
        );
        if (context.gc && node.gc && isStructType(paramDataType, context)) {
            const sourceTempVar = newTempVar(context);
            const destTempVar = newTempVar(context);
            body.push(
                `${sourceTempVar} = ptrtoint ${llParamDataType}* %${paramName} to i64`,
                `${destTempVar} = ptrtoint ${llParamDataType} %_${paramName} to i64`,
                `; function parameter initialization`,
                `call void @gc_add_var_ref(i64 ${sourceTempVar}, i64 ${destTempVar})`
            );
        }
    }
    const funName = node.fun_name.value;
    //context.funTable.set(funName, funSig);
    const funSig = context.funTable.get(funName);
    const outputType = funSig.output;
    const llOutputType = context.dataTypeMap.get(outputType);
    
    const funScope = {
        type: "fun",
        funName,
        variables,
        gc: context.gc && node.gc
    };
    const childScope = [funScope, ...scope];
    
    let returns = false;
    for (let statement of node.body) {
        const result = gen(statement, context, childScope);
        body.push(...result.topCode);
        if (statement.type === "return" || 
            (statement.type === "if" && result.returns)) {
            returns = true;
        }
    }
    
    if (!returns) {
        if (outputType === "void") {
            const aReturn = genReturn({ type: "return" }, context, childScope);
            body.push(...aReturn.topCode);
        } else {
            throw makeError(`Function ${funName} must return a ${outputType} but it does not always return.`, node.fun_name);
        }
    }
    
    const topCode = [];
    
    if (!node.gc) {
        topCode.push(`; gc:off`);
    }
    
    topCode.push(    
        `define ${llOutputType} @${funName}(${paramList.join(", ")}) {`,
        indent(body.join("\n"))
    );
    
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
        throw makeError(`Trying to call function ${funName} which is not defined.`, node);
    }
    const topCode = [];
    const funSig = context.funTable.get(funName);
    const outputDataType = funSig.output;
    const llOutputDataType = context.dataTypeMap.get(outputDataType);
    if (funSig.input.length !== node.arguments.length) {
        throw makeError(`Function ${funName} accepts ${funSig.input.length} arguments but was given ${node.arguments.length}.`, node);
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
        throw makeError(`A type cast can only handle one argument but ${node.arguments.length} was given.`, node);
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
    } else if (isStructType(srcDataType, context) && destDataType === "long") {
        typeCast = structTypeToLongCast(srcDataType, value.valueCode, context);
    } else if (srcDataType === "long" && isStructType(destDataType, context)) {
        typeCast = longToStructTypeCast(destDataType, value.valueCode, context);
    } else {
        throw makeError(`Cannot cast a ${srcDataType} to a ${destDataType}.`, node);
    }
    
    topCode.push(...typeCast.topCode);
    return {
        topCode,
        valueCode: typeCast.valueCode,
        dataType: typeCast.dataType
    };
}

function genFieldAccessor(node, context, scope) {
    const pointer = getElementPointer(node, context, scope);
    const llFieldType = context.dataTypeMap.get(pointer.dataType);
    const topCode = [];
    const valVarName = newTempVar(context);
    topCode.push(...pointer.topCode);
    topCode.push(`${valVarName} = load ${llFieldType}, ${llFieldType}* ${pointer.valueCode}`);
    return {
        topCode,
        valueCode: valVarName,
        dataType: pointer.dataType
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
        throw makeError(`Cannot to find instruction for operator ${operator} for type ${dataType}`, node.operator);
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
        throw makeError(`Unable to find float instruction for operator ${operator}.`, node.operator);
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
        throw makeError(`Unable to find int instruction for operator ${operator}.`, node.operator);
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
        throw makeError(`Unable to find pointer instruction for operator ${operator}.`, node.operator);
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
        throw makeError(`Unable to find bool instruction for operator ${operator}.`, node.operator);
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
    let dataType, llDataType, llVarName;
    if (varName[0] === "@") {
        if (varName === "@var_ref_map" || 
            varName === "@alloc_map" ||
            varName === "@assoc_map"
        ) {
            dataType = "BTreeMap";
            llDataType = "%struct.BTreeMap*";
            llVarName = varName;
        } else {
            throw makeError(`Unknown global variable ${varName}.`, node);
        }
    } else {
        llVarName = "%" + varName;
        dataType = getVariableType(varName, scope);
        if (!dataType) {
            throw makeError(`Reference to unknown variable ${varName}.`, node);
        }
        llDataType = context.dataTypeMap.get(dataType);
    }
    if (!llDataType) {
        throw makeError(`Unable to resolve type ${dataType} for variable ${varName}.`, node);
    }
    const tempVarName = "%tmp" + context.nextTemp++;
    const code = [
        `${tempVarName} = load ${llDataType}, ${llDataType}* ${llVarName}`
    ];
    return {
        topCode: code, 
        valueCode: tempVarName,
        dataType
    };
}

function genVarAssign(node, context, scope) {
    const varName = node.var_name.value;
    if (varName[0] === "@") {
        return genGlobalVarAssign(node, context, scope);
    }

    const topCode = [];
    const definedDataType = node.data_type && node.data_type.value;
    const prevDefinedDataType = getVariableType(varName, scope);
    if (definedDataType && prevDefinedDataType) {
        throw makeError(`Cannot re-define the type of variable ${varName} to ${definedDataType}, previously defined as ${prevDefinedDataType}.`, node.data_type);
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
    
    const llDataType = context.dataTypeMap.get(dataType);
    if (!getVariableType(varName, scope)) {
        const currentFun = getCurrentFun(scope);
        currentFun.variables.set(varName, dataType);
        topCode.push(`%${varName} = alloca ${llDataType}`);
    }
    topCode.push(
        `store ${llDataType} ${valueCode}, ${llDataType}* %${varName}`
    );
    
    const fun = getCurrentFun(scope);
    if (fun.gc && isStructType(value.dataType, context)) {
        const sourceTempVar = newTempVar(context);
        const destTempVar = newTempVar(context);
        const refMapValueTempVar = newTempVar(context);
        const newTreeTempVar = newTempVar(context);
        topCode.push(
            `${sourceTempVar} = ptrtoint ${llDataType}* %${varName} to i64`,
            `${destTempVar} = ptrtoint ${llDataType} ${valueCode} to i64`,
            `; var assign`,
            `call void @gc_add_var_ref(i64 ${sourceTempVar}, i64 ${destTempVar})`
        );
    }
    
    return {
        topCode: topCode, 
        valueCode: "%" + varName,
        dataType
    };
}

function getElementPointer(node, context, scope) {
    const topCode = [];
    const left = gen(node.left, context, scope);
    topCode.push(...left.topCode);
    
    const structType = left.dataType;
    
    if (node.right.type !== "identifier") {
        throw makeError(`Right hand side of the dot operator must be an identifier but here is a ${node.right.type}.`, node.right);
    }
    const fieldName = node.right.value;
    
    const llStructPtrType = context.dataTypeMap.get(structType);
    if (!llStructPtrType.startsWith("%struct.")) {
        throw makeError(`Left hand side of dot operator must be a struct but here is a ${left.dataType}.`, node.left);
    }
    
    // substring to remove the * from the end of the type: %struct.MyStruct*
    const llStructType = llStructPtrType.substring(0, llStructPtrType.length - 1);
    const structDef = context.structTable.get(structType);
    const index = indexWhere(structDef.entries, (entry) => entry.field_name.value === fieldName);
    if (index === -1) {
        throw makeError(`Cannot find field ${fieldName} on struct ${structType}.`, node.right);
    }
    const fieldDef = structDef.entries[index];
    const fieldType = fieldDef.field_type.value;
    const llFieldType = context.dataTypeMap.get(fieldType);
    if (!llFieldType) {
        throw makeError(`Encountered undefined type ${fieldType} for field ${fieldName} of struct ${structType}.`, node.right);
    }
    const ptrVarName = newTempVar(context);
    const valVarName = newTempVar(context);
    topCode.push(`${ptrVarName} = getelementptr inbounds ${llStructType}, ${llStructPtrType} ${left.valueCode}, i32 0, i32 ${index}`);
    return {
        topCode,
        valueCode: ptrVarName,
        dataType: fieldType,
        structValueCode: left.valueCode,
        structDataType: left.dataType
    };
}

function genFieldAssign(node, context, scope) {
    if (!(node.left.type === "bin_expr" && node.left.operator.value === ".")) {
        throw makeError(`Cannot perform field assignment to a non-dot expression.`, node.left.operator);
    }
    const topCode = [
        `; field assign`
    ];
    const left = getElementPointer(node.left, context, scope);
    topCode.push(...left.topCode);
    const right = gen(node.right, context, scope);
    topCode.push(...right.topCode);
    const typeCast = implicitTypeCast(right.dataType, left.dataType, right.valueCode, context, node);
    topCode.push(...typeCast.topCode);
    const llDataType = context.dataTypeMap.get(typeCast.dataType);
    const fun = getCurrentFun(scope);
    
    if (fun.gc && isStructType(typeCast.dataType, context)) {
        const llStructType = context.dataTypeMap.get(left.structDataType);
        const sourceTempVar = newTempVar(context);
        const oldDestValueTempVar = newTempVar(context);
        const oldDestTempVar = newTempVar(context);
        
        //topCode.push(`${valVarName} = load ${llFieldType}, ${llFieldType}* ${pointer.valueCode}`);
        
        topCode.push(
            `${sourceTempVar} = ptrtoint ${llStructType} ${left.structValueCode} to i64`,
            `${oldDestValueTempVar} = load ${llDataType}, ${llDataType}* ${left.valueCode}`,
            `${oldDestTempVar} = ptrtoint ${llDataType} ${oldDestValueTempVar} to i64`,
            `call void @gc_remove_assoc(i64 ${sourceTempVar}, i64 ${oldDestTempVar})`
        );
    }
    
    topCode.push(
        `store ${llDataType} ${typeCast.valueCode}, ${llDataType}* ${left.valueCode}`
    );
    
    if (fun.gc && isStructType(typeCast.dataType, context)) {
        const llStructType = context.dataTypeMap.get(left.structDataType);
        const sourceTempVar = newTempVar(context);
        const destTempVar = newTempVar(context);
        
        //topCode.push(`${valVarName} = load ${llFieldType}, ${llFieldType}* ${pointer.valueCode}`);
        
        topCode.push(
            `${sourceTempVar} = ptrtoint ${llStructType} ${left.structValueCode} to i64`,
            `${destTempVar} = ptrtoint ${llDataType} ${typeCast.valueCode} to i64`,
            `call void @gc_add_assoc(i64 ${sourceTempVar}, i64 ${destTempVar})`
        );
    }
    
    return {
        topCode,
        valueCode: null,
        dataType: null
    }
}

function genGlobalVarAssign(node, context, scope) {
    const varName = node.var_name.value;
    const llDataType = "%struct.BTreeMap*";
    const value = gen(node.value, context, scope);
    const topCode = [
        ...value.topCode,
        `store ${llDataType} ${value.valueCode}, ${llDataType}* ${varName}`
    ];
    return {
        topCode,
        valueCode: null,
        dataType: null
    }
}

function genProgram(node, context, scope) {
    const builtInFuns = [
        `declare i32 @putchar(i32)`,
        `declare i32 @getchar()`,
        `declare i8* @malloc(i32)`,
        `declare void @free(i8*)`
    ];
    
    if (context.gc) {
        builtInFuns.push(
            `@var_ref_map = global %struct.BTreeMap* null`,
            `@assoc_map = global %struct.BTreeMap* null`,
            `@alloc_map = global %struct.BTreeMap* null`
        );
    }
    
    builtInFuns.push("");
    
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
    throw makeError(`Cannot implicitly cast a ${type1} from/to a ${type2}.`, node);
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
            throw makeError(`Cannot implicitly cast a ${type1} to a ${type2}.`, node);
        }
        const dataType = isStructType(type1, context) ? type1 : type2;
        return {
            topCode: [],
            valueCode,
            dataType
        };
    }
    throw makeError(`Cannot implicitly cast a ${type1} to a ${type2}.`, node);
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

function structTypeToLongCast(structType, valueCode, context) {
    return typeCast("ptrtoint", structType, "long", valueCode, context);
}

function longToStructTypeCast(structType, valueCode, context) {
    return typeCast("inttoptr", "long", structType, valueCode, context);
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

function makeError(message, node) {
    const error = new Error(message);
    error.node = node;
    return error;
}

main().catch(err => {
    console.log(err.stack);
    process.exit(1);
});