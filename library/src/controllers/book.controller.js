const Book = require("../models/book");
const { HttpStatusCode } = require("../utils/httpStatusCode");

class BookController {
    async create(request, response) {
        await request.initBody();
        if (!request.body) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Body cannot be empty!");
            return;
        }

        const book = new Book({
            author: request.body.author,
            name: request.body.name,
        });

        try {
            const resource = await Book.create(book);
            // TODO: add location
            const location = "";
            response.created(location, JSON.stringify(resource));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the book.");
        }
    }

    async deleteById() {}

    async getAll(request, response) {
        try {
            const resources = await Book.getAll();
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on retrieving books.");
        }
    }

    async get(request, response) {
        if (!request.params || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Param id cannot be empty!");
            return;
        }
        try {
            const resource = await Book.getById(request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.statusCode(HttpStatusCode.NOT_FOUND).send(`No book with id ${request.params.id}.`);
            } else {
                response.internalServerError("Error retrieving book with id " + request.params.id);
            }
        }
    }
}

module.exports = { BookController };
