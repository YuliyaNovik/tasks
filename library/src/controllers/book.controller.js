const Book = require("../models/book");
const { getLocationValue } = require("../utils/location");

class BookController {
    async create(request, response) {
        const book = {
            author: request.body.author,
            name: request.body.name,
        };

        try {
            const resource = await Book.create(book);
            return response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on creating the book.");
        }
    }

    async deleteById() {}

    async getAll(request, response) {
        try {
            const resources = await Book.getAll();
            return response.ok(JSON.stringify(resources));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on retrieving books.");
        }
    }

    async get(request, response) {
        if (!request.params.id) {
            return response.badRequest("Param id cannot be empty!");
        }
        try {
            const resource = await Book.getById(request.params.id);
            return response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                return response.notFound(`No book with id ${request.params.id}.`);
            } else {
                return response.internalServerError("Error retrieving book with id " + request.params.id);
            }
        }
    }
}

module.exports = { BookController };
