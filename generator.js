const fs = require("mz/fs");
const path = require("path");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide an .ast file.");
        return;
    }
    const ast = JSON.parse((await fs.readFile(filename)).toString());
    const outputFilename = path.basename(filename, ".ast") + ".ll";
    const [llir, _] = generate(ast, { nextTemp: 1 });
    await fs.writeFile(outputFilename, llir.join("\n"));
    console.log(`Wrote ${outputFilename}.`);
}

// returns a tuple [appendedCode, inlinedCode]
function generate(node, context) {
    if (node.type === "program") {
        const body = node.body.map(statement => {
            const [code, _] = generate(statement, context);
            return code.join("\n");
        }).join("\n");
        const code = [
            "define i32 @main() {",
            indent(body),
            indent("ret i32 0"),
            "}",
            "",
            "declare i32 @putchar(i32)"
        ];
        return [code, null];
    } else if (node.type === "var_assign") {
        const varName = node.var_name.value;
        const [appendedCode, inlinedCode] = generate(node.value, context);
        const code = [
            ...appendedCode,
            `%${varName} = alloca i32`,
            `store i32 ${inlinedCode}, i32* %${varName}`
        ];
        return [code, "%" + varName];
    } else if (node.type === "identifier") {
        const varName = node.value;
        const tempVarName = "%tmp" + context.nextTemp++;
        const code = [
            `${tempVarName} = load i32, i32* %${varName}`
        ];
        return [code, tempVarName];
    } else if (node.type === "bin_expr") {
        const [leftCode, leftInlined] = generate(node.left, context);
        const [rightCode, rightInlined] = generate(node.right, context);
        const operator = node.operator.value;
        if (operator === "+") {
            const varName = "%tmp" + context.nextTemp++;
            const code = [
                ...leftCode,
                ...rightCode,
                `${varName} = add i32 ${leftInlined}, ${rightInlined}`
            ];
            return [code, varName];
        } else if (operator === "-") {
            const varName = "%1";
            const code = [
                ...leftCode,
                ...rightCode,
                `${varName} = sub i32 ${leftInlined}, ${rightInlined}`
            ];
            return [code, varName];
        } else if (operator === "*") {
            const varName = "%1";
            const code = [
                ...leftCode,
                ...rightCode,
                `${varName} = mul i32 ${leftInlined}, ${rightInlined}`
            ];
            return [code, varName];
        } else if (operator === "+") {
            const varName = "%1";
            const code = [
                ...leftCode,
                ...rightCode,
                `${varName} = div i32 ${leftInlined}, ${rightInlined}`
            ];
            return [code, varName];
        }
    } else if (node.type === "fun_call") {
        const argResults = node.arguments.map(arg => generate(arg, context));
        
        const argList = argResults.map(argResult => {
            return "i32 " + argResult[1]
        }).join(", ");
        const tmpVarName = "%tmp" + context.nextTemp++;
        const funName = node.fun_name.value;
        const childCode = argResults.reduce((childCode, argResult) => {
            return childCode.concat(argResult[0]);
        }, []);
        const code = [
            ...childCode,
            `${tmpVarName} = call i32 @${funName} (${argList})`
        ];
        return [code, tmpVarName];
    } else if (node.type === "number") {
        return [[], node.value];
    } else {
        throw new Error("Unsupported node type: " + node.type);
    }
}

function indent(text) {
    return text.split("\n").map(line => "  " + line).join("\n");
}

main().catch(err => console.log(err.stack));