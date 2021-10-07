const http = require("http");
const { existsSync, statSync } = require("fs");
const { readFile } = require("fs/promises");
const url = require("url");
const path = require("path");

const getHtmlPage = async (request) => {
    const staticPath = "./static";

    const uri = url.parse(request.url).pathname;
    let fileName = path.join(process.cwd(), staticPath, uri);

    if (!existsSync(fileName)) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.write("404 Not Found\n");
        response.end();
        return;
    }

    if (statSync(fileName).isDirectory()) {
        fileName = path.join(fileName, "/index.html");
    }

    const htmlPage = await readFile(fileName);

    return htmlPage;
};

module.exports = { getHtmlPage };
