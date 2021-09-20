const { resolve } = require("path");
const { existsSync } = require("fs");
const { createDir, readDir, removeFiles } = require("./dir");
const { filesToGzip } = require("./gzip");

const moveFiles = async (inputPath, outputPath, files) => {
    await createDir(outputPath);
    await filesToGzip(inputPath, outputPath, files);
    const absoluteFileNames = files.map(file => resolve(inputPath, file));
    await removeFiles(absoluteFileNames);
}

const move = async (inputPath, outputPath) => {
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

module.exports = { move };