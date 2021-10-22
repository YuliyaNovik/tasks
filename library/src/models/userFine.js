const { connectionPromise } = require("../utils/db.js");
const { toTimeStamp } = require("../utils/dateTime");
const { SpecifiedError } = require("../utils/specifiedError");

const create = async (newUserFine) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `INSERT INTO user_fine (user_id, fine_id, start_date_time) VALUES ?`,
            [[[newUserFine.userId, newUserFine.fineId, toTimeStamp(newUserFine.startDateTime)]]]
        );
        const resource = { id: rows.insertId, ...newUserFine };
        console.log("Created active fine: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const deleteByUserIdAndFineId = async (userId, fineId) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `DELETE FROM user_fine WHERE user_id = ${userId} AND fine_id = ${fineId};`
        );
        console.log(`Deleted active fines with userId ${userId} and fineId ${fineId}`);
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const deleteById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`DELETE FROM user_fine WHERE id = ${id};`);
        console.log(`Deleted active fine with id ${id}`);
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const getByUserIdAndFineId = async (userId, fineId) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `SELECT * FROM user_fine WHERE user_id = ${userId} AND fine_id = ${fineId};`
        );
        const resource = rows;
        console.log("Found active fines: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "not_found" });
    }
};

// TODO: join
const getAllByUserId = async (userId) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`SELECT * FROM user_fine WHERE user_id = ${userId};`);
        console.log("Found fines: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "not_found" });
    }
};

// TODO: join
const getAllByFineId = async (fineId) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`SELECT * FROM user_fine WHERE fine_id = ${fineId};`);
        console.log("Found users: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "not_found" });
    }
};

const getById = async (id) => {
    const connection = await connectionPromise;
    const [rows, fields] = await connection.query(`SELECT * FROM user_fine WHERE id = ${id};`);
    const resource = rows[0];
    if (!resource) {
        console.log("Error: Resource is undefined");
        throw new SpecifiedError({ reason: "not_found" });
    }
    console.log("Found active fine: ", resource);
    return resource;
};

const getAll = async () => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`SELECT * FROM user_fine;`);
        console.log("Found active fines: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "not_found" });
    }
};

module.exports = {
    create,
    getByUserIdAndFineId,
    getAllByUserId,
    getAllByFineId,
    getAll,
    getById,
    deleteByUserIdAndFineId,
    deleteById,
};
