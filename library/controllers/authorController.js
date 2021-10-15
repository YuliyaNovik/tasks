const Author = require("../models/author");
const { HttpStatusCode } = require("../utils/httpStatusCode");

const create = (request, response) => {
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
        response
            .statusCode(HttpStatusCode.INTERNAL_SERVER)
            .send(error.message || "Some error occurred on creating the author.");
    }
};

const getAll = (request, response) => {
    try {
        const resources = await Author.getAll();
        response.ok(resources);
    } catch (error) {
        response
            .statusCode(HttpStatusCode.INTERNAL_SERVER)
            .send(error.message || "Some error occurred on retrieving authors.");
    }
};

const get = (request, response) => {
    try {
        // const id = request.url
        const resource = await Author.getById(id);
        response.ok(resource);
    } catch (error) {
        if (error.reason === "not_found") {
            response.statusCode(HttpStatusCode.NOT_FOUND).send(`No author with id ${request.params.authorId}.`);
        } else {
            response
                .statusCode(HttpStatusCode.INTERNAL_SERVER)
                .send("Error retrieving author with id " + request.params.authorId);
        }
    }
};

module.exports = { create, get, getAll };
