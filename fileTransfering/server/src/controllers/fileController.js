const { extname, join, resolve } = require("path");
const { readDir } = require("../utils/dir");
const { createReadStream, existsSync } = require("fs");
const { createWriteStream } = require("../utils/writeStream");
const { getMimeTypeByExtension } = require("../utils/mimeType");
const { HttpStatusCode } = require("../utils/httpStatusCode");
// TODO: remove dependency
const storageDir = "storage";

const getFile = async (request, response) => {
    return new Promise((resolve, reject) => {
        const fileName = request.url.slice("/files/".length);
        const filePath = join(storageDir, fileName);
        const readStream = createReadStream(filePath);

        readStream.on("error", () => {
            response.statusCode = 400;
            const errorMessage = "File not found or you made an invalid request.";
            response.end(errorMessage);
            reject(errorMessage);
        });

        response.on("error", () => {
            response.statusCode = 400;
            const errorMessage = "File not found or you made an invalid request.";
            response.end(errorMessage);
            reject(errorMessage);
        });

        const mediaType = "multipart/byteranges";
        response.setHeader("Content-Type", mediaType);
        readStream.pipe(response);
        readStream.on("end", () => {
            response.end();
            resolve();
        });
    });
};

const getAllFiles = async (request, response) => {
    const fileNames = await readDir(storageDir);
    const files = fileNames.map((name) => {
        let extension = extname(name);
        if (extension.length > 0) {
            extension = extension.slice(1);
        }
        const mediaType = getMimeTypeByExtension(extension);
        return {
            id: name,
            name,
            mediaType,
        };
    });

    response.statusCode = HttpStatusCode.OK;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(files));
};

const saveFile = async (request, response) => {
    const fileName = await new Promise((resolve, reject) => {
        const contentType = request.headers["content-type"];

        const boundaries = contentType
            .split("; ")
            .filter((value) => value.startsWith("boundary"))
            .map((value) => "--" + value.split("boundary=").join(""));

        if (boundaries.length < 1) {
            throw new Error("Boundary is not defined");
        }
        const boundary = Buffer.from(boundaries[0]);

        let writeStream;
        const emptyLine = Buffer.from("\r\n\r\n");
        const shiftLine = Buffer.from("\r\n");
        let fileName;
        let mediaType;
        request.on("data", (data) => {
            if (data.indexOf(boundary) === 0) {
                const index = data.indexOf(emptyLine);

                const metaData = data.slice(0, index + emptyLine.length).toString();
                const metaDataLines = metaData.split("\r\n");

                fileName = metaDataLines[1]
                    .split("; ")
                    .filter((value) => value.startsWith("filename="))
                    .map((value) => value.slice("filename=".length + 1, value.length - 1))[0];

                mediaType = metaDataLines[2].split(" ")[1];

                const dataChunk = data.slice(index + emptyLine.length);
                const filePath = join(storageDir, fileName);

                if (existsSync(filePath)) {
                    response.statusCode = HttpStatusCode.UNPROCESSABLE_ENTITY;
                    const errorMessage = "Resource already exists";
                    response.end(errorMessage);
                    reject(errorMessage);
                } else {
                    writeStream = createWriteStream(filePath);
                    write(dataChunk, shiftLine + boundary, writeStream);
                }
            } else if (writeStream) {
                write(data, shiftLine + boundary, writeStream);
            }
        });

        const write = (data, endStr, writeStream) => {
            if (data.length >= 0) {
                const borderIndex = data.indexOf(endStr);
                const chunkToWrite = borderIndex === -1 ? data : data.slice(0, borderIndex);
                writeStream.write(chunkToWrite);
            }
        };

        request.on("end", () => {
            resolve(fileName);
        });

        request.on("error", () => {
            response.statusCode = 500;
            response.setHeader("Content-Type", "application/json");
            response.end();
            reject();
        });
    });

    response.statusCode = HttpStatusCode.CREATED;
    response.setHeader("Content-Type", "application/json");
    response.end(
        JSON.stringify({
            id: fileName,
            name: fileName,
            mediaType: mediaType,
        })
    );
};

module.exports = { getFile, getAllFiles, saveFile };
