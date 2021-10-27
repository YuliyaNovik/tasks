const bcrypt = require("bcrypt");

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
};

const encrypt = async (value) => {
    return createHash(value, await createSalt());
};

module.exports = { createSalt, createHash, compare, encrypt };
