const { existsSync, statSync } = require("fs");
const { readFile } = require("fs/promises");
const path = require("path");

const getStaticResource = async (request, response) => {
    const staticPath = "./static";

    let filePath = path.join(process.cwd(), staticPath, request.url);

    if (!existsSync(filePath)) {
        return;
    }

    if (statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "/index.html");
    }

    return await readFile(filePath);
};

module.exports = { getStaticResource };
