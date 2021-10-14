const { connection } = require("../utils/db.js");

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

const create = (newBook, callback) => {
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

const getById = (id, callback) => {
    connection.query(`SELECT * FROM book WHERE id = ${id}`, (error, res) => {
        if (error) {
            console.log("Error: ", error);
            callback(error, null);
            return;
        }

        if (res.length > 0) {
            console.log("Found book: ", res[0]);
            callback(null, res[0]);
            return;
        }

        callback({ reason: "not_found" }, null);
    });
};

const getAll = (callback) => {
    connection.query(
        "SELECT book.id, book.name, book.annotation, book.author as author, original.author as originalAuthor, original.name as originalName, book.indoor_access as indoorAccess FROM book_view book LEFT JOIN book_view original on book.original_id = original.id;",
        (error, res) => {
            if (error) {
                console.log("Error: ", error);
                callback(null, error);
                return;
            }

            console.log("Books: ", res);
            callback(null, res);
        }
    );
};

module.exports = { create, getById, getAll };
