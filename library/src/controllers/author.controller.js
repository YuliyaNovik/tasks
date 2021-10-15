const Author = require("../models/author");
const { HttpStatusCode } = require("../utils/httpStatusCode");

class AuthorController {
    async create(request, response) {
        if (!request.body) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Body cannot be empty!");
        }

        const author = new Author({
            name: request.body.name,
            country: request.body.country,
            languageId: request.body.languageId,
        });

        try {
            const resource = await Author.create(author);
            // TODO: add location
            const location = "";
            response.created(location, resource);
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the author.");
        }
    }

    async deleteById() {}

    async getAll(request, response) {
        try {
            const resources = await Author.getAll();
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on retrieving authors.");
        }
    }

    async get(request, response) {
        try {
            const resource = await Author.getById(request.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.statusCode(HttpStatusCode.NOT_FOUND).send(`No author with id ${request.params.authorId}.`);
            } else {
                response.internalServerError("Error retrieving author with id " + request.params.authorId);
            }
        }
    }
}

module.exports = { AuthorController };
