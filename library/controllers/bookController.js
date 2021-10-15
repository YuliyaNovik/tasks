const Book = require("../models/book");
const { HttpStatusCode } = require("../utils/httpStatusCode");

const create = async (request, response) => {
    if (!request.body) {
        response.statusCode(HttpStatusCode.BAD_REQUEST).send("Body cannot be empty!");
    }

    const book = new Book({
        author: request.body.author,
        name: request.body.name,
    });

    try {
        const resource = await Book.create(book);
        // TODO: add location
        const location = "";
        response.created(location, resource);
    } catch (error) {
        response
            .statusCode(HttpStatusCode.INTERNAL_SERVER)
            .send(error.message || "Some error occurred on creating the book.");
    }
};

const deleteById = async () => {};

const getAll = async (request, response) => {
    try {
        const resources = await Book.getAll();
        response.ok(resources);
    } catch (error) {
        response
            .statusCode(HttpStatusCode.INTERNAL_SERVER)
            .send(error.message || "Some error occurred on retrieving books.");
    }
};

const get = async (request, response) => {
    try {
        // const id = request.url
        const resource = await Book.getById(id);
        response.ok(resource);
    } catch (error) {
        if (error.reason === "not_found") {
            response.statusCode(HttpStatusCode.NOT_FOUND).send(`No book with id ${request.params.bookId}.`);
        } else {
            response
                .statusCode(HttpStatusCode.INTERNAL_SERVER)
                .send("Error retrieving book with id " + request.params.bookId);
        }
    }
};

module.exports = { create, get, getAll };
