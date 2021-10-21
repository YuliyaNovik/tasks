const Author = require("../models/author");
const {HttpStatusCode} = require("../utils/httpStatusCode");
const {getLocationValue} = require("../utils/location");

class AuthorController {
    async create(request, response) {
        const author = {
            name: request.body.name,
            country: request.body.country,
            languageId: request.body.languageId,
        };

        try {
            const resource = await Author.create(author);
            response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the author.");
        }
    }

    async deleteById(request, response) {
        if (!request.params || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Param id cannot be empty!");
        }
        try {
            await Author.deleteById(request.params.id);
            response.ok();
        } catch (error) {
            response.internalServerError(error.message || `Some error occurred on deleting author with id ${request.params.id}.`);
        }
    }

    async getAll(request, response) {
        try {
            const resources = await Author.getAll();
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on retrieving authors.");
        }
    }

    async get(request, response) {
        if (!request.params || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Param id cannot be empty!");
            return;
        }
        try {
            const resource = await Author.getById(request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.statusCode(HttpStatusCode.NOT_FOUND).send(`No author with id ${request.params.id}.`);
            } else {
                response.internalServerError("Error retrieving author with id " + request.params.id);
            }
        }
    }
}

module.exports = {AuthorController};
