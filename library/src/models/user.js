const { connectionPromise } = require("../utils/db.js");
const { SpecifiedError } = require("../utils/specifiedError");

const create = async (newUser) => {
    try {
        const connection = await connectionPromise;
        // TODO: add query
        const [rows, fields] = await connection.query(`INSERT INTO fine () VALUES ?`, [[[]]]);
        const resource = { id: rows.insertId, ...newUser };
        console.log("Created user: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const deleteById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(``);
        console.log("Deleted user: ", id);
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const getById = async (id) => {
    const connection = await connectionPromise;
    const [rows, fields] = await connection.query(``);
    const resource = rows[0];
    if (!resource) {
        throw new SpecifiedError({ reason: "not_found" });
    }
    console.log("Found user: ", resource);
    return resource;
};

const getAll = async () => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(``);
        console.log("Found users: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "not_found" });
    }
};

module.exports = { create, getById, getAll, deleteById };
