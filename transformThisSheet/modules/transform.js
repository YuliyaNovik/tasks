const stream = require('stream');

class RemovingTransform extends stream.Transform {
    constructor(options = {}) {
        super(options);   
    }

    _transform(chunk, encoding, callback) {
        const isBuffer = Buffer.isBuffer(chunk);

        chunk = chunk.toString().split("").filter((elem) => elem != "р" && elem !=  "Р").join("");

        if (isBuffer) {
            chunk = Buffer.from(chunk);
        }

        if (chunk.length > 0) {
            this.push(chunk);
        }

        return callback;
    }
}

const removeSymbolsTransform = () => new RemovingTransform();

module.exports = { removeSymbolsTransform };