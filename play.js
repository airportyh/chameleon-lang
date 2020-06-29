const util = require("util");
const spawn = require("child_process").spawn;
const path = require("path");

async function main() {
    /*const process = spawn("./tests/ex23.bin");
    process.stdin.write("Toby\n");
    
    process.stdout.on("data", (data) => {
        console.log("stdout got:", data.toString());
    });*/
    try {
        const result = await execProgram("./tests/ex24.bin", "abc");
        console.log(result);
    } catch (e) {
        console.log(e.message);
    }
}



main().catch(err => console.log(err.stack));