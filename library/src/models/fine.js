const { connectionPromise } = require("../utils/db.js");

const create = async (newFine) => {
    try {
        const connection = await connectionPromise;
        // TODO: add query
        const [rows, fields] = await connection.query(`INSERT INTO fine () VALUES ?`, [[[]]]);
        const resource = { id: rows.insertId, ...newFine };
        console.log("Created fine: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "Error in sql query" });
    }
};

const deleteById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(``);
        console.log("Deleted fine: ", id);
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "Error in sql query" });
    }
};

const getById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(``);
        const resource = rows[0];
        console.log("Found fine: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "not_found" });
    }
};

const getAll = async () => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(``);
        console.log("Found fines: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "not_found" });
    }
};

module.exports = { create, getById, getAll, deleteById };
