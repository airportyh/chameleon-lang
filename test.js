const util = require("util");
const fs = require("mz/fs");
const spawn = require("child_process").spawn;
const colors = require("colors/safe");

async function main() {
    await testSuite();
}

async function testSuite() {
    await test("ex1.chm", ["57"]);
    await test("ex2.chm", ["J"]);
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
    await testExpectFail("ex11.chm", "Creating structs on the stack is temporarily disallowed.");
    await testExpectFail("ex12.chm", "Creating structs on the stack is temporarily disallowed.");
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
    await test("ex25.chm", ["0123456789:"]);
    await test("ex26.chm", ["C"]);
    await test("ex27.chm", ["Name: Hello, Linus!", ""], "Linus\n");
    await test("ex28.chm", ["A"], "134\n");
    await test("ex28.chm", ["B"], "13\n");
    await test("ex30.chm", 
        [
            "> > Key:Val:> Key:Val:> 10:Marty",
            "    7:Linus",
            "> Key:Val:> 10:Marty",
            "    7:Linus",
            "    12:Emma",
            "> "
        ],
        [
            "p",
            "i",
            "10",
            "Marty",
            "i",
            "7",
            "Linus",
            "p",
            "i",
            "12",
            "Emma",
            "p",
            "q",
            ""
        ].join("\n")
    );
    await test("ex31.chm", ["\ta", ""]);
    await test("ex32.chm", ["BC"]);
    await test("ex33.chm", ["bd"]);
    await test("ex34.chm", ["14", "10", ""]);
    await test("ex35.chm", 
        [
          "> > Key: Val: > Key: Val: > 10:Marty",
          "    7:Linus",
          "> Key: Val: > Key: Val: > 10:Martin",
          "    7:Linus",
          "    12:Emma",
          "> Key: > 12:Emma",
          "    7:Linus",
          "> "
        ],
        [
            "p",
            "s",
            "10",
            "Marty",
            "s",
            "7",
            "Linus",
            "p",
            "s",
            "12",
            "Emma",
            "s",
            "10",
            "Martin",
            "p",
            "d",
            "10",
            "p",
            "q",
            ""
        ].join("\n")
    );
    await test("ex36.chm", ["Yes", ""]);
    await test("ex39.chm", ["a"]);
    await testExpectFail("ex40.chm", "Function main must return a int but it does not always return.");
    await testExpectFail("ex41.chm", "Cannot alloc undefined struct User.");
    // await testExpectFail("ex42.chm", "Cannot create undefined struct User.");
    await testExpectFail("ex43.chm", "Break statement used outside of a loop.");
    await testExpectFail("ex44.chm", "Expected if conditional to be a bool but here it is a int.");
    await testExpectFail("ex45.chm", "Trying to call function blah which is not defined.");
    await testExpectFail("ex46.chm", "Function putchar accepts 1 arguments but was given 3.");
    await testExpectFail("ex47.chm", "A type cast can only handle one argument but 2 was given.");
    await testExpectFail("ex48.chm", "Cannot cast a int to a bool.");
    await testExpectFail("ex49.chm", "Right hand side of the dot operator must be an identifier but here is a number.");
    await testExpectFail("ex50.chm", "Left hand side of dot operator must be a struct but here is a int.");
    await testExpectFail("ex51.chm", "Cannot find field li on struct User.");
    await testExpectFail("ex52.chm", "Encountered undefined type Baby for field baby of struct User.");
    await testExpectFail("ex53.chm", "Unable to find bool instruction for operator +.");
    await testExpectFail("ex54.chm", "Unable to find float instruction for operator and.");
    await testExpectFail("ex55.chm", "Unable to find int instruction for operator or.");
    await testExpectFail("ex56.chm", "Unable to find pointer instruction for operator +.");
    await testExpectFail("ex57.chm", "Reference to unknown variable y.");
    await testExpectFail("ex58.chm", "Unable to resolve type Baby for variable baby.");
    await testExpectFail("ex59.chm", "Cannot re-define the type of variable a to long, previously defined as int.");
    await testExpectFail("ex60.chm", "Cannot implicitly cast a double from/to a int.");
    await testExpectFail("ex61.chm", "Cannot implicitly cast a Apple to a Orange.");
    await testExpectFail("ex62.chm", "Cannot implicitly cast a Apple to a int.");
    await test("ex63.chm", ["Hello, world!", "Whatsup?", ""]);
    await test("ex66.chm", [
        "To",
        "be",
        "or",
        "not",
        "to",
        "be",
        "that",
        "is",
        "the",
        "question",
        "Yes starts with To",
        "not to be that is the question",
        ""
    ]);
    await test("ex68.chm", ["B"]);
    await test("ex69.chm", [
        "0",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "<GC>freed 0/0</GC>",
        "1",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>1</ALLOC>",
        "<GC>freed 0/1</GC>",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>1</ALLOC>",
        "<GC>freed 1/1</GC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "2",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>1</ALLOC>",
        "<GC>freed 1/1</GC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "<GC>freed 0/0</GC>",
        "3",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>1</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>2</ALLOC>",
        "<GC>freed 0/2</GC>",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>1</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>2</ALLOC>",
        "<GC>freed 2/2</GC>",
        "4",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>2</ALLOC>",
        "<GC>freed 1/2</GC>",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>1</ALLOC>",
        "<GC>freed 1/1</GC>",
        "5",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>1</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>2</ALLOC>",
        "<GC>freed 2/2</GC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "<GC>freed 0/0</GC>",
        "6",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>1</ASSOC>",
        "<MAXASSOC>2</MAXASSOC>",
        "<ALLOC>3</ALLOC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>1</ASSOC>",
        "<MAXASSOC>2</MAXASSOC>",
        "<ALLOC>3</ALLOC>",
        "<GC>freed 3/3</GC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "<GC>freed 0/0</GC>",
        "7",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>4</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>5</ALLOC>",
        "<GC>freed 0/5</GC>",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>4</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>5</ALLOC>",
        "<GC>freed 5/5</GC>",
        "8",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>4</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>5</ALLOC>",
        "<GC>freed 5/5</GC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "<GC>freed 0/0</GC>",
        "9",
        "Hello",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>4</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>5</ALLOC>",
        "<GC>freed 5/5</GC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "<GC>freed 0/0</GC>",
        "10",
        "HelloWorld",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>17</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>20</ALLOC>",
        "<GC>freed 20/20</GC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "<GC>freed 0/0</GC>",
        "11",
        "Hello, George!",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>36</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>41</ALLOC>",
        "<GC>freed 41/41</GC>",
        "<VARREFS>0</VARREFS>",
        "<ASSOC>0</ASSOC>",
        "<MAXASSOC>0</MAXASSOC>",
        "<ALLOC>0</ALLOC>",
        "<GC>freed 0/0</GC>",
        "12",
        "Hello, Jessica!",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>39</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>44</ALLOC>",
        "<GC>freed 29/44</GC>",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>14</ASSOC>",
        "<MAXASSOC>1</MAXASSOC>",
        "<ALLOC>15</ALLOC>",
        "<GC>freed 15/15</GC>",
        "13",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>52</ASSOC>",
        "<MAXASSOC>2</MAXASSOC>",
        "<ALLOC>55</ALLOC>",
        "<GC>freed 36/55</GC>",
        "<VARREFS>1</VARREFS>",
        "<ASSOC>17</ASSOC>",
        "<MAXASSOC>2</MAXASSOC>",
        "<ALLOC>19</ALLOC>",
        "<GC>freed 19/19</GC>",
        ""
    ]);
}

async function run(filepath, optionalInput) {
    const binFilePath = `tests/${filepath.replace('.chm', '.bin')}`;
    await execProgram("./compile", [`tests/${filepath}`]);
    return await execProgram(binFilePath, [], optionalInput);
}

async function test(filepath, expected, optionalInput) {
    const output = await run(filepath, optionalInput);
    const expectedString = expected.join("\n");
    if (output.stdout !== expectedString) {
        console.error(`Test ${filepath} failed:`);
        console.log(indent([
            `Expected:`,
            indent(expectedString),
            `Actual:`,
            indent(output.stdout)
        ].join("\n")));
        console.log(indent(JSON.stringify(output.stdout.split("\n"), null, "    ")));
    } else {
        console.log(`Test ${filepath} OK`);
    }
}

async function testExpectFail(filepath, failPattern, optionalInput) {
    try {
        const output = await run(filepath, optionalInput);
        console.error(`Test ${filepath} failed:`);
        console.log(indent([
            `Expected to fail with "${failPattern}" but output was:`,
            indent(output.stdout)
        ].join("\n")));
    } catch (e) {
        const idx = e.message.indexOf(failPattern);
        if (idx !== -1) {
            console.log(`Test ${filepath} OK`);
        } else {
            console.error(`Test ${filepath} failed:`);
            
            console.log(indent([
                `Expected to fail with "${failPattern}" but output was:`,
                indent(colors.yellow(e.message))
            ].join("\n")));
        }
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

async function execProgram(cmd, args, input) {
    return new Promise((accept, reject) => {
        let stdout = "";
        let stderr = "";
        const process = spawn(cmd, args, { cwd: __dirname });
    
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