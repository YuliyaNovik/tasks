const { connectionPromise } = require("../utils/db.js");

const create = async (newUserFine) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `INSERT INTO user_fine (user_id, fine_id, start_date_time) VALUES ?`,
            [[[newUserFine.userId, newUserFine.fineId, newUserFine.startDateTime]]]
        );
        const resource = { id: rows.insertId, ...newAuthor };
        console.log("Created user fine: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "Error in sql query" });
    }
};

const deleteByUserIdAndFineId = async (userId, fineId) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `DELETE FROM author WHERE user_id = ${userId} AND fine_id = ${fineId};`
        );
        console.log(`Deleted user fine with userId ${userId} and fineId ${fineId}`);
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "Error in sql query" });
    }
};

const getByUserIdAndFineId = async (userId, fineId) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `SELECT * FROM user_fine WHERE user_id = ${userId} AND fine_id = ${fineId};`
        );
        const resource = rows[0];
        console.log("Found user: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "not_found" });
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
        throw new Error({ reason: "not_found" });
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
        throw new Error({ reason: "not_found" });
    }
};

module.exports = { create, getByUserIdAndFineId, getAllByUserId, getAllByFineId, deleteByUserIdAndFineId };
