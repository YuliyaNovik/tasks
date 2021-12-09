const { encrypt, compare} = require("../utils/crypt");
const Token = require("../models/token");

const getActiveToken = async (userId) => {
    try {
        return await Token.getByUserId(userId);
    } catch (error) {
        if (error.reason === "not_found") {
            const value = "reset token";
            console.log("Token: " + value);
            return await createToken(userId, value);
        } else {
            throw error;
        }
    }
};

const createToken = async (userId, value) => {
    const token = await encrypt(value);
    return await Token.create({ userId, token });
};

const deleteByTokenValue = async (value) => {
    return await Token.deleteByTokenValue(value);
};

const isValidToken = async (userId, token) => {
    try {
        let passwordResetToken = await Token.getByUserId(userId);
        return await compare(token, passwordResetToken.value)
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = { getActiveToken, deleteByTokenValue, isValidToken };
