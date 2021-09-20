const { pipeline } = require("stream/promises");
const { createReadStream, createWriteStream } = require("fs");
const zlib = require("zlib");
const path = require("path");

const createGzip = (inputPath, outputPath, file) => {
    const readStream = createReadStream(path.join(inputPath, file));
    const writeStream = createWriteStream(path.join(outputPath, file + ".tar.gz"));

    writeStream.on("finish", () =>  console.log(`Writing of ${file} has been finished`))

    return pipeline(
        readStream,
        zlib.createGzip(),
        writeStream
    );
}

const filesToGzip = async (inputPath, outputPath, files) => {
    await Promise.all(
        files.map((file) => createGzip(inputPath, outputPath, file))
    );
    console.log("Files have been zipped");
}

module.exports = { filesToGzip };