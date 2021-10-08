const { existsSync, statSync } = require("fs");
const { readFile } = require("fs/promises");
const path = require("path");
const { HttpStatusCode } = require("./httpStatusCode");

const getStaticResource = async (request) => {
    const staticPath = "./static";

    let fileName = path.join(process.cwd(), staticPath, request.url);

    if (!existsSync(fileName)) {
        response.writeHead(HttpStatusCode.NOT_FOUND, { "Content-Type": "text/plain" });
        response.write("404 Not Found\n");
        response.end();
        return;
    }

    if (statSync(fileName).isDirectory()) {
        fileName = path.join(fileName, "/index.html");
    }

    return await readFile(fileName);
};

module.exports = { getStaticResource };
