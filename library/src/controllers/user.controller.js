const User = require("../models/user");
const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");

class UserController {
    async create(request, response) {
        const user = {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            address: request.body.address,
        };

        try {
            const resource = await User.create(user);
            response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async deleteById() {}

    async getAll(request, response) {
        try {
            const resources = await User.getAll();
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on retrieving users.");
        }
    }

    async get(request, response) {
        if (!request.params.id) {
            response.badRequest("Param id cannot be empty!");
            return;
        }
        try {
            const resource = await User.getById(request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.notFound(`No user with id ${request.params.id}.`);
            } else {
                response.internalServerError("Error retrieving user with id " + request.params.id);
            }
        }
    }

    async createUserFine(request, response) {
        if (!request.params.userId || !request.params.id) {
            response.badRequest("Params userId and id cannot be empty!");
            return;
        }

        const userFine = {
            userId: request.params.userId,
            fineId: request.body.id,
            startDateTime: request.body.startDateTime,
        };

        try {
            const resource = await UserFine.create(userFine);
            response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async deleteUserFine(request, response) {
        if (!request.params.userId || !request.params.id) {
            response.badRequest("Params userId and id cannot be empty!");
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
        if (!request.params.userId) {
            response.badRequest("Param userId cannot be empty!");
            return;
        }

        try {
            const resources = await UserFine.getAllByUserId(request.params.userId);
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(`Cannot retrieve user fines with userId ${request.params.userId}`);
        }
    }

    async getUserFine(request, response) {
        if (!request.params.userId || !request.params.id) {
            response.badRequest("Params userId and id cannot be empty!");
            return;
        }

        try {
            const resource = await UserFine.getByUserIdAndFineId(request.params.userId, request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.notFound(`No user fine with userId ${request.params.userId} and fineId ${request.params.id}.`);
            } else {
                response.internalServerError(
                    `Cannot retrieve user fine with userId ${request.params.userId} and fineId ${request.params.id}.`
                );
            }
        }
    }
}

module.exports = { UserController };
