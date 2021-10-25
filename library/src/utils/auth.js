const { JWT } = require("node-jsonwebtoken");
const bcrypt = require("bcrypt");

const jwt = new JWT(process.env.TOKEN_KEY);

const createSalt = (saltRounds) => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.genSalt(saltRounds || 10, function (err, salt) {
                resolve(salt);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const createHash = (password, salt) => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.hash(password, salt, function (err, hash) {
                resolve(hash);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const compare = async (value, hash) => {
    return await bcrypt.compare(value, hash);
}

module.exports = { jwt, createSalt, createHash, compare };
