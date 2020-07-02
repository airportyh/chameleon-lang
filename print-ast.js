const fs = require("mz/fs");
const path = require("path");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide an .ast file.");
        return;
    }
    const ast = JSON.parse((await fs.readFile(filename)).toString());
    console.log(print(ast, 0));
}

/*
function print(node, level) {
    const indent = Array(level + 1).join("    ");
    switch (node.type) {
        case "program":
            console.log(`${indent}program`);
            node.body
                .forEach(statement => print(statement, level + 1));
            break;
        case "fun_call":
            console.log(`${indent}${node.fun_name.value}(`);
            node.arguments
                .forEach(arg => print(arg, level + 1));
            console.log(`${indent})`);
            break;
        case "bin_expr":
            console.log(`${indent}${node.operator.value}`);
            print(node.left, level + 1);
            print(node.right, level + 1);
            break;
        default:
            if (node.value) {
                console.log(`${indent}${node.value}`);
            } else {
                throw new Error(`Unsupported: ${node.type}`);
            }
    }
}
*/

function print(node) {
    switch (node.type) {
        case "program":
            return node.body
                .map(statement => 
                    print(statement)).join("\n");
            break;
        case "fun_call":
            return `${node.fun_name.value}(` +
                node.arguments
                    .map(arg => print(arg)).join(", ") +
                ")";
            break;
        case "bin_expr":
            return `(${print(node.left)}${node.operator.value}${print(node.right)})`;
            break;
        default:
            if (node.value) {
                return node.value;
            } else {
                throw new Error(`Unsupported: ${node.type}`);
            }
    }
}

main().catch(err => console.log(err.stack));