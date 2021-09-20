const { resolve } = require("path");
const { existsSync } = require("fs");
const { mkdir, readdir, unlink } = require("fs/promises");
const { filesToGzip } = require("./gzip");

const createDir = async (path) => {
    if (!existsSync(path)) {
        await mkdir(path);
        console.log("Output directory has been created");
    }
}

const readDir = (path) => {
    return readdir(path);
}

const removeFiles = async (files) => {
    await Promise.all(
        files.map((file) => unlink(file))
    );
    console.log("Files have been deleted");
}

const moveFiles = async (inputPath, outputPath, files) => {
    await createDir(outputPath);
    await filesToGzip(inputPath, outputPath, files);
    const absoluteFileNames = files.map(file => resolve(inputPath, file));
    await removeFiles(absoluteFileNames);
}

module.exports = {createDir, readDir, removeFiles, moveFiles}