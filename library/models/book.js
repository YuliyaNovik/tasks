const { connection } = require("../utils/db.js");

const Book = (book) => {
    this.author = book.author;
    this.name = book.name;
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
        "SELECT book.id, book.name, author_name.name as author FROM book INNER JOIN author_name ON book.author_id = author_name.author_id AND book.language_id = author_name.language_id;",
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
