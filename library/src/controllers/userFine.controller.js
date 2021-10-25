const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");

class UserFineController {
    async create(request, response) {
        if (!request.body.fineId || !request.body.userId) {
            return response.badRequest("Body fields fineId and userId cannot be empty!");
        }

        const userFine = {
            userId: request.body.userId,
            fineId: request.body.fineId,
            startDateTime: new Date(),
        };

        try {
            const resource = await UserFine.create(userFine);
            return response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async deleteById(request, response) {
        if (!request.params.id) {
            return response.badRequest("Param id cannot be empty!");
        }

        try {
            await UserFine.deleteById(request.params.id);
            return response.ok();
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async getAll(request, response) {
        try {
            const resources = await UserFine.getAll();
            return response.ok(JSON.stringify(resources));
        } catch (error) {
            return response.internalServerError(`Cannot retrieve active fines with fineId ${request.params.fineId}`);
        }
    }

    async get(request, response) {
        if (!request.params.id) {
            return response.badRequest("Param id cannot be empty!");
        }

        try {
            const resource = await UserFine.getById(request.params.id);
            return response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                return response.notFound(`No active fine with id ${request.params.id}`);
            } else {
                return response.internalServerError(`Cannot retrieve active fine with id ${request.params.id}`);
            }
        }
    }
}

module.exports = { UserFineController };
