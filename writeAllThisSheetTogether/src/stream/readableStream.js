const { Readable} = require('stream')

const createReadableStream = (arr) => {
    const readableStream = Readable.from(arr);
    
    readableStream.on("error", (error) => {
        console.log(error);
        readableStream.close();
    })

    return readableStream;
}

module.exports = { createReadableStream }
