const { pipeline } = require("stream/promises");
const { createReadStream, createWriteStream } = require("fs");
const zlib = require("zlib");
const path = require("path");

const createGzip = (inputPath, outputPath, file) => {
    return pipeline(
        createReadStream(path.resolve(inputPath, file)),
        zlib.createGzip(),
        createWriteStream(path.resolve(outputPath, file + ".tar.gz"))
    );
}

module.exports = createGzip;