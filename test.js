const util = require("util");
const fs = require("mz/fs");
const exec = util.promisify(require("child_process").exec);

async function main() {
    await test("ex12.chm", ["TH", "MH", ""]);
    //await test("ex13.chm", ["MH", ""]);
    await test("ex14.chm", ["MH", ""]);
    await test("ex15.chm", ["ABC", ""]);
    await test("ex16.chm", ["ABCD", ""]);
}

async function test(filepath, expected) {
    try {
        const astFilePath = `test-examples/${filepath.replace('.chm', '.ast')}`;
        const llFilePath = `test-examples/${filepath.replace('.chm', '.ll')}`;
        const asmFilePath = `test-examples/${filepath.replace('.chm', '.s')}`;
        const binFilePath = `test-examples/${filepath.replace('.chm', '.bin')}`;
        await removeFile(astFilePath);
        await removeFile(llFilePath);
        await removeFile(asmFilePath);
        await removeFile(binFilePath);
        
        const cmd = `./run test-examples/${filepath}`;
        const output = await exec(cmd);
        const allExpected = [
            `Wrote ${astFilePath}.`,
            `Wrote ${llFilePath}.`,
            ...expected
        ].join("\n");
        if (output.stdout !== allExpected) {
            console.error(`Test ${filepath} failed:`);
            console.log(indent([
                `Expected:`,
                indent(allExpected),
                `Actual:`,
                indent(output.stdout)
            ].join("\n")))
        } else {
            console.error(`Test ${filepath} OK`);
        }
    } catch (e) {
        console.error(e.message);
    }
}

async function removeFile(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (e) {
        if (!e.message.match(/no such file or directory/)) {
            console.warn(e.message);
        }
    }
}

function indent(text) {
    return text.split("\n").map(line => "  " + line).join("\n");
}

main().catch(err => console.log(err.stack));