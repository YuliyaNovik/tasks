const { existsSync } = require("fs");
const { mkdir, readdir, unlink } = require("fs/promises");

const createDir = async (path) => {
    if (!existsSync(path)) {
        await mkdir(path);
        console.log(`"${path}" directory has been created`);
    } else {
        console.log(`"${path}" directory already exists`);
    }
}

const readDir = (path) => {
    return readdir(path);
}

const removeFiles = async (files) => {
    if (!Array.isArray(files)) {
        throw Error(`${typeof files} is not an array`);
    }
    await Promise.all(
        files.map((file) => unlink(file))
    );
    console.log("Files have been deleted");
}

module.exports = { createDir, readDir, removeFiles }