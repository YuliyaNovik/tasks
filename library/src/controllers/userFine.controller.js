const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");

class UserFineController {
    async createUserFine(request, response) {
        if (!request.body.fineId || !request.body.userId) {
            response.badRequest("Body fields fineId and userId cannot be empty!");
            return;
        }

        const userFine = {
            userId: request.body.userId,
            fineId: request.body.fineId,
            startDateTime: Date.now(),
        };

        try {
            const resource = await UserFine.create(userFine);
            response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async deleteUserFine(request, response) {
        if (!request.params.id) {
            response.badRequest("Params fineId and id cannot be empty!");
            return;
        }

        try {
            await UserFine.deleteById(request.params.id);
            response.ok();
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async getAllUserFines(request, response) {
        try {
            const resources = await UserFine.getAll(request.params.fineId);
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(`Cannot retrieve user fines with fineId ${request.params.fineId}`);
        }
    }

    async getUserFine(request, response) {
        if (!request.params.id) {
            response.badRequest("Param id cannot be empty!");
            return;
        }

        try {
            const resource = await UserFine.getById(request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.notFound(`No user fine with id ${request.params.id}`);
            } else {
                response.internalServerError(`Cannot retrieve user fine with id ${request.params.id}`);
            }
        }
    }
}

module.exports = { UserFineController };
