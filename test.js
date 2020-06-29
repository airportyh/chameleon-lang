const util = require("util");
const fs = require("mz/fs");
const exec = util.promisify(require("child_process").exec);
const spawn = require("child_process").spawn;

async function main() {
    await test("ex1.chm", ["ep", ""]);
    await test("ex2.chm", ["c"]);
    await test("ex3.chm", ["A"]);
    await test("ex4.chm", [""]);
    await test("ex5.chm", ["AAA"]);
    await test("ex6.chm", ["AB"]);
    await test("ex7.chm", ["A", ""]);
    await test("ex8.chm", ["D", ""]);
    await test("ex9.chm", [
        "A0A1A2A3A4A5A6A7A8A9",
        "B0B1B2B3B4B5B6B7B8B9",
        "C0C1C2C3C4C5C6C7C8C9",
        "D0D1D2D3D4D5D6D7D8D9",
        "E0E1E2E3E4E5E6E7E8E9",
        "F0F1F2F3F4F5F6F7F8F9",
        "G0G1G2G3G4G5G6G7G8G9",
        "H0H1H2H3H4H5H6H7H8H9",
        "I0I1I2I3I4I5I6I7I8I9",
        "J0J1J2J3J4J5J6J7J8J9",
        "K0K1K2K3K4K5K6K7K8K9",
        "L0L1L2L3L4L5L6L7L8L9",
        "M0M1M2M3M4M5M6M7M8M9",
        "N0N1N2N3N4N5N6N7N8N9",
        "O0O1O2O3O4O5O6O7O8O9",
        "P0P1P2P3P4P5P6P7P8P9",
        "Q0Q1Q2Q3Q4Q5Q6Q7Q8Q9",
        "R0R1R2R3R4R5R6R7R8R9",
        "S0S1S2S3S4S5S6S7S8S9",
        "T0T1T2T3T4T5T6T7T8T9",
        "U0U1U2U3U4U5U6U7U8U9",
        "V0V1V2V3V4V5V6V7V8V9",
        "W0W1W2W3W4W5W6W7W8W9",
        "X0X1X2X3X4X5X6X7X8X9",
        "Y0Y1Y2Y3Y4Y5Y6Y7Y8Y9",
        "Z0Z1Z2Z3Z4Z5Z6Z7Z8Z9",
        ""
    ]);
    await test("ex10.chm", [""]);
    await test("ex11.chm", [""]);
    await test("ex12.chm", ["TH", "MH", ""]);
    //await test("ex13.chm", ["MH", ""]);
    await test("ex14.chm", ["MH", ""]);
    await test("ex15.chm", ["ABC", ""]);
    await test("ex16.chm", ["ABCD", ""]);
    await test("ex17.chm", ["AB", ""]);
    await test("ex18.chm", ["2"]);
    await test("ex19.chm", ["1836284", ""]);
    await test("ex20.chm", ["1836284", ""]);
    await test("ex21.chm", ["Hello", ""]);
    await test("ex22.chm", ["1836284", ""]);
    await test("ex23.chm", ["Name: Hello, Marty!", ""], "Marty\n");
}

async function test(filepath, expected, optionalInput) {
    try {
        const astFilePath = `tests/${filepath.replace('.chm', '.ast')}`;
        const llFilePath = `tests/${filepath.replace('.chm', '.ll')}`;
        const asmFilePath = `tests/${filepath.replace('.chm', '.s')}`;
        const binFilePath = `tests/${filepath.replace('.chm', '.bin')}`;
        await removeFile(astFilePath);
        await removeFile(llFilePath);
        await removeFile(asmFilePath);
        await removeFile(binFilePath);
        
        const cmd = `./compile tests/${filepath}`;
        await exec(cmd);
        const output = await execProgram(binFilePath, optionalInput);
        const expectedString = expected.join("\n");
        if (output.stdout !== expectedString) {
            console.error(`Test ${filepath} failed:`);
            console.log(indent([
                `Expected:`,
                indent(expectedString),
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

async function execProgram(program, input) {
    return new Promise((accept, reject) => {
        let stdout = "";
        let stderr = "";
        const process = spawn(program);
    
        if (input) {
            process.stdin.write(input);
        }
        process.stdout.on("data", (data) => {
            stdout += data.toString();
        });
        process.stderr.on("data", (data) => {
            stderr += data.toString();
        });
        process.on("error", (e) => {
            if (e.code === "ENOENT") {
                const error = new Error("Program not found: " + e.message);
                error.code = e.code;
                reject(error);
            } else {
                reject(e);
            }
        });
        process.on("exit", (code) => {
            if (code === 0) {
                // success
                accept({
                    code,
                    stdout,
                    stderr
                });
            } else {
                const output = [stdout, stderr].filter(o => o);
                const error = new Error("Program exited with status " + code + " " + output.join("\n"));
                error.code = code;
                error.stdout = stdout;
                error.stderr = stderr;
                reject(error);
            }
        });
    });
}

main().catch(err => console.log(err.stack));