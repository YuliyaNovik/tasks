const { existsSync } = require("fs");
const { mkdir, readdir } = require("fs/promises");

const createDir = async (path) => {
    if (!existsSync(path)) {
        await mkdir(path);
        console.log(`"${path}" directory has been created`);
    } else {
        console.log(`"${path}" directory already exists`);
    }
};

const readDir = (path) => {
    return readdir(path);
};

module.exports = { createDir, readDir };
