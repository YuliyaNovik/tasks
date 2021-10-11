const { extname, join } = require("path");
const { readDir } = require("../utils/dir");
const { createReadStream, existsSync, statSync } = require("fs");
const { createWriteStream } = require("../utils/writeStream");
const { getMimeTypeByExtension } = require("../utils/mimeType");
const { HttpStatusCode } = require("../utils/httpStatusCode");

class FileController {

    constructor(storageDir) {
        this._storageDir = storageDir;
    }


    async getFile(request, response) {
        try {
            const fileName = request.url.slice("/files/".length);
            const filePath = join(this._storageDir, fileName);
    
            if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
                response.statusCode = HttpStatusCode.NOT_FOUND;
                response.setHeader("Content-Type", "text/plain");
                const errorMessage = "Not Found: " + filePath;
                response.end(errorMessage);
                return;
            }
    
            const readStream = createReadStream(filePath);
    
            response.statusCode = HttpStatusCode.OK;
            const mediaType = "multipart/byteranges";
            response.setHeader("Content-Type", mediaType);
            readStream.pipe(response);
        } catch (error) {
            response.statusCode = HttpStatusCode.INTERNAL_SERVER;
            response.setHeader("Content-Type", "text/plain");
            const errorMessage = "Internal server error: " + error;
            response.end(errorMessage);
        }
    };
    
    async getAllFiles(request, response) {
        try {
            const fileNames = await readDir(this._storageDir);
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
        } catch (error) {
            response.statusCode = HttpStatusCode.INTERNAL_SERVER;
            response.setHeader("Content-Type", "text/plain");
            const errorMessage = "Internal server error: " + error;
            response.end(errorMessage);
        }
    };
    
    async saveFile(request, response) {
        try {
            const { fileName, mediaType } = await new Promise((resolve, reject) => {
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
                let fileName;
                let mediaType;
                const emptyLine = Buffer.from("\r\n\r\n");
                const shiftLine = Buffer.from("\r\n");
    
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
                        const filePath = join(this._storageDir, fileName);
    
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
                    return resolve({ fileName, mediaType});
                });
    
                request.on("error", () => {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "application/json");
                    response.end();
                    return reject();
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
        } catch (error) {
            response.statusCode = HttpStatusCode.INTERNAL_SERVER;
            response.setHeader("Content-Type", "text/plain");
            const errorMessage = "Internal server error: " + error;
            response.end(errorMessage);
        }
    };
}

module.exports = FileController;
