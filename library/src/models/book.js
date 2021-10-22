const { connectionPromise } = require("../utils/db.js");

const Book = (book) => {
    this.id = book.id;
    this.author = book.author;
    this.name = book.name;
    this.annotation = book.annotation;
    this.originalName = book.originalName;
    this.originalAuthor = book.originalAuthor;
    this.indoorAccess = !!book.indoorAccess;
    this.language = book.language;
};

const create = async (newBook) => {
    try {
        const connection = await connectionPromise;
        // TODO: add query
        const [rows, fields] = await connection.query(`INSERT INTO book () VALUES ?`, [[[]]]);
        const resource = { id: rows.insertId, ...newBook };
        console.log("Created book: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "Error in sql query" });
    }
};

const deleteById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`DELETE FROM book WHERE id = ${id};`);
        console.log("Deleted book: ", id);
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "Error in sql query" });
    }
};

const getById = async (id) => {
    const connection = await connectionPromise;
    const [rows, fields] = await connection.query(
        `SELECT book.id, book.name, book.annotation, book.author as author, original.author as originalAuthor, original.name as originalName, book.indoor_access as indoorAccess FROM (SELECT * from book_view WHERE book_view.id = ${id}) as book LEFT JOIN book_view original on book.original_id = original.id;`
    );
    const resource = rows[0];
    if (!resource) {
        throw new Error({ reason: "not_found" });
    }
    console.log("Found book: ", resource);
    return resource;
};

const getAll = async () => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(
            `SELECT book.id, book.name, book.annotation, book.author as author, original.author as originalAuthor, original.name as originalName, book.indoor_access as indoorAccess FROM book_view book LEFT JOIN book_view original on book.original_id = original.id;`
        );
        console.log("Found books: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "not_found" });
    }
};

module.exports = { create, getById, getAll, deleteById };
