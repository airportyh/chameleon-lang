const fs = require("mz/fs");
const nearley = require("nearley");
const grammar = require("./grammar.js");
const path = require("path");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a .chm source name.");
        return;
    }
    const content = (await fs.readFile(filename)).toString();
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    parser.feed(content);

    if (parser.results.length > 1) {
        console.log("Ambiguous grammar detected.");
        return;
    }
    
    if (parser.results.length === 0) {
        console.error("Parse failed.");
        return;
    }
    const outputFilename = path.basename(filename, ".chm") + ".ast";
    const ast = parser.results[0];
    await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
    console.log(`Wrote ${outputFilename}.`);
}

main().catch(err => console.log(err.stack));