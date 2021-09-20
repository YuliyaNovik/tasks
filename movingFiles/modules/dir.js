const { existsSync } = require("fs");
const { mkdir, readdir, unlink } = require("fs/promises");

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

module.exports = { createDir, readDir, removeFiles }