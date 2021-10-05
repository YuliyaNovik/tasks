const { extname, join} = require('path');
const { readDir } = require("../fileSystem/dir");
const { createReadStream, createWriteStream } = require("fs");
const { getMimeTypeByExtension } = require("../type/mimeType");

const getFile = async (request, response, storageDir) => {
    const fileName = request.url.slice("/files/".length);
    const filePath = join(storageDir, fileName);
    const readStream = createReadStream(filePath);

    readStream.on("error", () => {
        response.statusCode = 404
        response.end('File not found or you made an invalid request.')
    });

    if (request.headers["accept"] === "multipart/byteranges") {
        mediaType = "multipart/byteranges";
    } else {
        const extension = extname(filePath)
        if (extension.length > 0) {
            mediaType = getMimeTypeByExtension(extension.slice(1))
        }
    }

    response.setHeader('Content-Type', mediaType)
    readStream.pipe(response);
}

const getAllFiles = async (request, response, storageDir) => {
    const files = await readDir(storageDir);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(files));
}

const saveFile = async (request, response, storageDir) => {
    const contentType = request.headers["content-type"];

    const boundaries = contentType.split("; ")
        .filter((value) => value.startsWith("boundary"))
        .map((value) => "--" + value.split("boundary=").join(""));

    if (boundaries.length < 1) {
        throw new Error("Boundary is not defined");
    }
    const boundary = boundaries[0];

    let writeStream;
    const emptyLine = "\r\n\r\n";
    request.on('data', (data) => {
        if (data.toString().startsWith(boundary)) {
            const index = data.toString().indexOf(emptyLine);

            const metaData = data.toString().slice(0, index + emptyLine.length);
            console.log(metaData)
            const fileName = metaData.split("\r\n")
                .filter((value) => value.indexOf("filename=") !== -1)[0]
                .split("; ")
                .filter((value) => value.startsWith("filename="))
                .map((value) => value.slice("filename=".length + 1, value.length - 1))[0];

            const dataChunk = data.slice(index + emptyLine.length);
            const filePath = join(storageDir, fileName);
            writeStream = createWriteStream(filePath);
            write(dataChunk, emptyLine + boundary, writeStream);
        } else if (writeStream) {
            write(data, emptyLine + boundary, writeStream);
        }
    })

    const write = (data, endStr, writeStream) => {
        if (data.length >= 0) {
            const borderIndex = data.toString().indexOf(endStr);
            const chunkToWrite = (borderIndex === -1) ? data : data.slice(0, borderIndex);
            writeStream.write(chunkToWrite);
        }
    }

    request.on("end", (data) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end();
    });
}

module.exports = { getFile, getAllFiles, saveFile };
