const { connection } = require("../utils/db.js");

const Author = (author) => {
    this.id = author.id;
    this.name = author.name;
    this.country = author.country;
    this.languageId = author.languageId;
};

const getById = (id, callback) => {
    connection.query(
        "SELECT selected_author.id, an.name FROM (SELECT * FROM author WHERE author.id = 1) as selected_author INNER JOIN author_name an on selected_author.id = an.author_id AND selected_author.language_id = an.language_id;",
        (error, res) => {
            if (error) {
                console.log("Error: ", error);
                callback(error, null);
                return;
            }

            if (res.length > 0) {
                console.log("Found author: ", res[0]);
                callback(null, res[0]);
                return;
            }

            callback({ reason: "not_found" }, null);
        }
    );
};

const getAll = (callback) => {
    connection.query(
        "SELECT selected_author.id, selected_author.country, selected_author.language_id, an.name FROM (SELECT * FROM author WHERE author.id = 1) as selected_author INNER JOIN author_name an on selected_author.id = an.author_id AND selected_author.language_id = an.language_id;",
        (error, res) => {
            if (error) {
                console.log("Error: ", error);
                callback(null, error);
                return;
            }

            console.log("Authors: ", res);
            callback(null, res);
        }
    );
};

module.exports = { getById, getAll };
