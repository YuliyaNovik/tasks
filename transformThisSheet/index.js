const { pipeline } = require("stream/promises");
const { createReadStream, createWriteStream } = require("fs");
const { removeSymbolsTransform } = require("./modules/transform");

const INPUT_PATH = process.env.INPUT_PATH || "Karl_Marx-Das_Kapital.txt";
const OUTPUT_PATH = process.env.OUTPUT_PATH || "1.txt";

const main = async () => {
    await pipeline(
        createReadStream(INPUT_PATH),
        removeSymbolsTransform(),
        createWriteStream(OUTPUT_PATH)
    );
}

main();