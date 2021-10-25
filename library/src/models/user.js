const { connectionPromise } = require("../utils/db.js");
const { SpecifiedError } = require("../utils/specifiedError");

const create = async (newUser) => {
    try {
        const connection = await connectionPromise;

        await connection.beginTransaction();
        const [roleRows, _] = await connection.query(`SELECT * FROM role WHERE role.name = '${newUser.role}';`);

        const [rows, fields] = await connection.query(
            `INSERT INTO user (email, first_name, last_name, address, role_id, password_hash, password_salt) VALUES ?`,
            [
                [
                    [
                        newUser.email,
                        newUser.firstName,
                        newUser.lastName,
                        newUser.address,
                        roleRows[0].id,
                        newUser.password,
                        newUser.salt,
                    ],
                ],
            ]
        );
        await connection.commit();

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
        const [rows, fields] = await connection.query(`DELETE FROM user WHERE id = ${id};`);
        console.log("Deleted user: ", id);
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "Error in sql query" });
    }
};

const getById = async (id) => {
    const connection = await connectionPromise;
    const [rows, fields] = await connection.query(
        `SELECT u.id, u.email, u.first_name as firstName, u.last_name as lastName, u.address, u.password_hash as password, u.password_salt as salt, r.name as role FROM user u INNER JOIN role r on u.role_id = r.id WHERE u.id = ${id};`
    );
    const resource = rows[0];
    if (!resource) {
        throw new SpecifiedError({ reason: "not_found" });
    }
    console.log("Found user: ", resource);
    return resource;
};

const getByEmail = async (email) => {
    const connection = await connectionPromise;
    const [rows, fields] = await connection.query(
        `SELECT u.id, u.email, u.first_name as firstName, u.last_name as lastName, u.address, u.password_hash as password, u.password_salt as salt, r.name as role FROM user u INNER JOIN role r on u.role_id = r.id WHERE u.email = '${email}';`
    );
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
        const [rows, fields] = await connection.query(
            `SELECT u.id, u.email, u.first_name as firstName, u.last_name as lastName, u.address, u.password_hash as password, u.password_salt as salt, r.name as role FROM user u INNER JOIN role r on u.role_id = r.id ;`
        );
        console.log("Found users: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new SpecifiedError({ reason: "not_found" });
    }
};

module.exports = { create, getById, getAll, deleteById, getByEmail };
