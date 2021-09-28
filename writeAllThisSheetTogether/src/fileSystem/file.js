const path = require("path");

const getFilePath = (outputPath, fileName) => {
    return path.join(outputPath, fileName);
}

module.exports = { getFilePath }