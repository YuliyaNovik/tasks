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

    Author.create(author, (error, data) => {
        if (error) {
            response
                .statusCode(HttpStatusCode.INTERNAL_SERVER)
                .send(error.message || "Some error occurred on creating the author.");
        } else {
            // TODO: add location
            const location = "";
            response.created(location, data);
        }
    });
};

const getAll = (request, response) => {
    Author.getAll((error, data) => {
        if (error) {
            response
                .statusCode(HttpStatusCode.INTERNAL_SERVER)
                .send(error.message || "Some error occurred on retrieving authors.");
        } else {
            response.ok(data);
        }
    });
};

const get = (request, response) => {
    // const id = request.url
    Author.getById(id, (error, data) => {
        if (error) {
            if (error.reason === "not_found") {
                response.statusCode(HttpStatusCode.NOT_FOUND).send(`No author with id ${request.params.authorId}.`);
            } else {
                response
                    .statusCode(HttpStatusCode.INTERNAL_SERVER)
                    .send("Error retrieving author with id " + request.params.authorId);
            }
        } else {
            response.ok(data);
        }
    });
};

module.exports = { create, get, getAll };
