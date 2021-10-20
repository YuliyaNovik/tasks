const User = require("../models/user");
const UserFine = require("../models/userFine");
const {HttpStatusCode} = require("../utils/httpStatusCode");

class UserController {
    async create(request, response) {
        if (!request.body) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Body cannot be empty!");
            return;
        }

        const user = {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            address: request.body.address,
        };

        try {
            const resource = await User.create(user);
            // TODO: add location
            const location = "";
            response.created(location, JSON.stringify(resource));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async deleteById() {
    }

    async getAll(request, response) {
        try {
            const resources = await User.getAll();
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on retrieving users.");
        }
    }

    async get(request, response) {
        if (!request.params || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Param id cannot be empty!");
            return;
        }
        try {
            const resource = await User.getById(request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.statusCode(HttpStatusCode.NOT_FOUND).send(`No user with id ${request.params.id}.`);
            } else {
                response.internalServerError("Error retrieving user with id " + request.params.id);
            }
        }
    }

    async createUserFine(request, response) {
        if (!request.body) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Body cannot be empty!");
            return;
        }

        if (!request.params || !request.params.userId || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Params userId and id cannot be empty!");
            return;
        }

        const userFine = {
            userId: request.params.userId,
            fineId: request.body.id,
            startDateTime: request.body.startDateTime
        };

        try {
            const resource = await UserFine.create(userFine);
            // TODO: add location
            const location = "";
            response.created(location, JSON.stringify(resource));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async deleteUserFine(request, response) {
        if (!request.params || !request.params.userId || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Params userId and id cannot be empty!");
            return;
        }

        try {
            await UserFine.deleteByUserIdAndFineId(request.params.userId, request.params.id);
            response.ok();
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async getAllUserFines(request, response) {
        if (!request.params || !request.params.userId) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Param userId cannot be empty!");
            return;
        }

        try {
            const resources = await UserFine.getAllByUserId(request.params.userId);
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on retrieving user fines.");
        }
    }

    async getUserFine(request, response) {
        if (!request.params || !request.params.userId || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Params userId and id cannot be empty!");
            return;
        }

        try {
            const resource = await UserFine.getByUserIdAndFineId(request.params.userId, request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.statusCode(HttpStatusCode.NOT_FOUND).send(`No user fine with userId ${request.params.userId} and fineId ${request.params.id}.`);
            } else {
                response.internalServerError(`Error retrieving user fine with userId ${request.params.userId} and fineId ${request.params.id}.`);
            }
        }
    }
}

module.exports = {UserController};
