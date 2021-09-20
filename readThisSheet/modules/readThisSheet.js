const { createReadStream } = require("fs");

const readThisSheet = async (file, messageLength) => {
    const readStream = createReadStream(file);

    let i = 1;
    readStream.on("data", (data) => {
        console.log(`Chunk ${i++}, ${data.toString().slice(0, messageLength)}`);
    })

    readStream.on("error", (error) => {
        console.log(error);
        readStream.close();
    })
}

module.exports = { readThisSheet }