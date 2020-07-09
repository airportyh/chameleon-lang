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
    const baseDir = path.dirname(filename);
    
    if (parser.results.length > 1) {
        console.log("Ambiguous grammar detected.");
        for (let i = 0; i < parser.results.length; i++) {
            const outputFilename = path.join(baseDir, path.basename(filename, ".chm") + "-" + (i + 1) + ".ast");
            const ast = parser.results[i];
            await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
            console.log(`Wrote ${outputFilename}.`);
        }
        return;
    }
    
    if (parser.results.length === 0) {
        console.error("Parse failed.");
        return;
    }
    const outputFilename = path.join(baseDir, path.basename(filename, ".chm") + ".ast");
    const ast = parser.results[0];
    
    await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
    console.log(`Wrote ${outputFilename}.`);
}

main().catch(err => console.log(err.stack));