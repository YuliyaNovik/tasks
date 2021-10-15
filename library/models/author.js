const { connectionPromise } = require("../utils/db.js");

const Author = (author) => {
    this.id = author.id;
    this.name = author.name;
    this.country = author.country;
    this.languageId = author.languageId;
};

const createTransaction = async (newAuthor) => {
    const connection = await connectionPromise;

    await connection.beginTransaction();
    const [rows, fields] = await connection.query(`INSERT INTO author (language_id, country) VALUES ?`, [
        [[newAuthor.languageId, newAuthor.country]],
    ]);

    await connection.query(`INSERT INTO author_name (language_id, author_id, name) VALUES ?`, [
        [[newAuthor.languageId, rows.insertId, newAuthor.name]],
    ]);
    await connection.commit();

    return rows.insertId;
};

const create = async (newAuthor) => {
    try {
        const insertId = await createTransaction(newAuthor);
        const resource = { id: insertId, ...newAuthor };
        console.log("Created author: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "Error in sql query" });
    }
};

const deleteById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`DELETE FROM author WHERE id = ${id};`);
        console.log("Deleted author: ", id);
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "Error in sql query" });
    }
};

const getById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `SELECT selected_author.id, selected_author.country, selected_author.language_id as languageId, an.name FROM (SELECT * FROM author WHERE author.id = ${id}) as selected_author INNER JOIN author_name an on selected_author.id = an.author_id AND selected_author.language_id = an.language_id;`
        );
        const resource = rows[0];
        console.log("Found author: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "not_found" });
    }
};

const getAll = async () => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `SELECT selected_author.id, selected_author.country, selected_author.language_id as languageId, an.name FROM (SELECT * FROM author WHERE author.id = 1) as selected_author INNER JOIN author_name an on selected_author.id = an.author_id AND selected_author.language_id = an.language_id;`
        );
        console.log("Found author: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "not_found" });
    }
};

module.exports = { getById, getAll, create, deleteById };
