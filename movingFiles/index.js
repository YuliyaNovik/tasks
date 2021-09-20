const path = require("path");
const { existsSync } = require("fs");
const { readDir, moveFiles } = require("./modules/dir");

const INPUT_PATH = process.env.INPUT_PATH || "input";
const OUTPUT_PATH = process.env.OUTPUT_PATH || "output";

const main = async (inputPath, outputPath) => {
    try {
        if (!existsSync(inputPath)) {
            console.log("Directory 'input' doesn't exist");
            return;
        }

        const files = await readDir(inputPath);

        if (files.length > 0) {
            console.log("Files: ", files.join(", "));
            await moveFiles(inputPath, outputPath, files);
        }
    } catch (error) {
        console.log(error);
    }
}

main(INPUT_PATH, OUTPUT_PATH);

