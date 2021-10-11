const { extname, join } = require("path");
const { readDir } = require("../utils/dir");
const { createReadStream, existsSync, statSync } = require("fs");
const { createWriteStream } = require("../utils/writeStream");
const { getMimeTypeByExtension } = require("../utils/mimeType");
const { getFileInfo, getBoundary } = require("../utils/formData");

class FileController {
    constructor(storageDir) {
        this._storageDir = storageDir;
    }

    async getFile(request, response) {
        try {
            const fileName = request.url.slice("/files/".length);
            const filePath = join(this._storageDir, fileName);

            if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
                response.notFound();
                return;
            }

            const readStream = createReadStream(filePath);
            response.byteStream(readStream);
        } catch (error) {
            response.internalServerError(error);
        }
    }

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

            response.ok(JSON.stringify(files));
        } catch (error) {
            response.internalServerError(error);
        }
    }

    async saveFile(request, response) {
        try {
            const { fileName, mediaType } = await new Promise((resolve, reject) => {
                const boundary = Buffer.from(getBoundary(request.headers));

                let writeStream;
                let fileInfo;
                const emptyLine = Buffer.from("\r\n\r\n");
                const lineBreak = Buffer.from("\r\n");

                request.on("data", (data) => {
                    if (data.indexOf(boundary) === 0) {
                        const index = data.indexOf(emptyLine);

                        const metaData = data.slice(0, index + emptyLine.length).toString();

                        fileInfo = getFileInfo(metaData);

                        const dataChunk = data.slice(index + emptyLine.length);
                        const filePath = join(this._storageDir, fileInfo.fileName);

                        if (existsSync(filePath)) {
                            response.unprocessableEntity(filePath);
                            reject();
                        } else {
                            writeStream = createWriteStream(filePath);
                            write(dataChunk, lineBreak + boundary, writeStream);
                        }
                    } else if (writeStream) {
                        write(data, lineBreak + boundary, writeStream);
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
                    return resolve(fileInfo);
                });

                request.on("error", () => {
                    response.internalServerError(error);
                    return reject();
                });
            });

            response.created(
                JSON.stringify({
                    id: fileName,
                    name: fileName,
                    mediaType: mediaType,
                })
            );
        } catch (error) {
            response.internalServerError(error);
        }
    }
}

module.exports = { FileController };
