const { connectionPromise } = require("../utils/db.js");
const { SpecifiedError } = require("../utils/specifiedError");

const create = async (newFine) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`INSERT INTO fine (period) VALUES ?`, [[[newFine.period]]]);
        const resource = { id: rows.insertId, ...newFine };
        console.log("Created fine: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const deleteById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`DELETE FROM fine WHERE id = ${id};`);
        console.log("Deleted fine: ", id);
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const getById = async (id) => {
    const connection = await connectionPromise;
    const [rows, fields] = await connection.query(`SELECT * FROM fine WHERE id = ${id};`);
    const resource = rows[0];
    if (!resource) {
        throw new SpecifiedError({ reason: "not_found" });
    }
    console.log("Found fine: ", resource);
    return resource;
};

const getAll = async () => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`SELECT * FROM fine;`);
        console.log("Found fines: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "not_found" });
    }
};

module.exports = { create, getById, getAll, deleteById };
