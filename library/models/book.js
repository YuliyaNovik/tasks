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

const create = async (newBook, callback) => {
    connection.query("INSERT INTO books SET ?", newBook, (error, res) => {
        if (error) {
            console.log("Error: ", error);
            callback(error, null);
            return;
        }

        console.log("Created book: ", { id: res.insertId, ...newBook });
        callback(null, { id: res.insertId, ...newBook });
    });
};

const deleteById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`DELETE FROM book WHERE id = ${id};`);
        console.log("Deleted book: ", id);
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({reason: "Error in sql query"});
    }
}

const getById = async (id) => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`SELECT book.id, book.name, book.annotation, book.author as author, original.author as originalAuthor, original.name as originalName, book.indoor_access as indoorAccess FROM (SELECT * from book_view WHERE book_view.id = ${id}) as book LEFT JOIN book_view original on book.original_id = original.id;`);
        const resource = rows[0];
        console.log("Found book: ", resource);
        return resource;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "not_found" });
    }
};

const getAll = async () => {
    try {
        const connection = await connectionPromise;
        const [rows, fields] = await connection.query(`SELECT book.id, book.name, book.annotation, book.author as author, original.author as originalAuthor, original.name as originalName, book.indoor_access as indoorAccess FROM book_view book LEFT JOIN book_view original on book.original_id = original.id;`);
        console.log("Books book: ", rows);
        return rows;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error({ reason: "not_found" });
    }
};

module.exports = { create, getById, getAll, deleteById };