const http = require("http");
const { existsSync, statSync } = require("fs");
const { readFile } = require("fs/promises");
const url = require("url");
const path = require("path");

const getStaticResource = async (request) => {
    const staticPath = "./static";

    let fileName = path.join(process.cwd(), staticPath, request.url);

    if (!existsSync(fileName)) {
        response.writeHead(404, { "Content-Type": "text/plain" });
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
