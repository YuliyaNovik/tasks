const { connectionPromise } = require("../utils/db.js");
const { SpecifiedError } = require("../utils/specifiedError");

const create = async (newToken) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`INSERT INTO token (user_id, value) VALUES ?`, [
            [[newToken.userId, newToken.token]],
        ]);
        const resource = { id: rows.insertId, ...newToken };
        console.log("Created token: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const deleteByTokenValue = async (token) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`DELETE FROM token WHERE value = '${token}';`);
        console.log("Deleted token: ", token);
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const getByUserId = async (id) => {
    const connection = await connectionPromise;
    const [rows, fields] = await connection.query(`SELECT * FROM token WHERE user_id = ${id};`);
    const resource = rows[0];
    if (!resource) {
        throw new SpecifiedError({ reason: "not_found" });
    }
    console.log("Found token: ", resource);
    return resource;
};

module.exports = { create, getByUserId, deleteByTokenValue };
