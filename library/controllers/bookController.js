const Book = require("../models/book");
const { HttpStatusCode } = require("../utils/httpStatusCode");

const create = (request, response) => {
    if (!request.body) {
        response.statusCode(HttpStatusCode.BAD_REQUEST).send("Body cannot be empty!");
    }

    const book = new Book({
        author: request.body.author,
        name: request.body.name,
    });

    Book.create(book, (error, data) => {
        if (error) {
            response
                .statusCode(HttpStatusCode.INTERNAL_SERVER)
                .send(error.message || "Some error occurred on creating the book.");
        } else {
            // TODO: add location
            const location = "";
            response.created(location, data);
            response.created(data);
        }
    });
};

const getAll = (request, response) => {
    Book.getAll((error, data) => {
        if (error) {
            response
                .statusCode(HttpStatusCode.INTERNAL_SERVER)
                .send(error.message || "Some error occurred on retrieving books.");
        } else {
            response.ok(data);
        }
    });
};

const get = (request, response) => {
    // const id = request.url
    Book.getById(id, (error, data) => {
        if (error) {
            if (error.reason === "not_found") {
                response.statusCode(HttpStatusCode.NOT_FOUND).send(`No book with id ${request.params.bookId}.`);
            } else {
                response
                    .statusCode(HttpStatusCode.INTERNAL_SERVER)
                    .send("Error retrieving book with id " + request.params.bookId);
            }
        } else {
            response.ok(data);
        }
    });
};

module.exports = { create, get, getAll };
