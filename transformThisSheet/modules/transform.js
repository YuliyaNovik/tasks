const stream = require('stream');

class RemovingTransform extends stream.Transform {
    constructor(options = {}) {
        super(options);   
    }

    _transform(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }
        
        chunk = chunk.split("").filter((elem) => elem != "р" && elem !=  "Р").join("");
        
        if (chunk.length > 0) {
            this.push(chunk);
        }

        return callback;
    }
}

const removeSymbolsTransform = () => new RemovingTransform();

module.exports = { removeSymbolsTransform };