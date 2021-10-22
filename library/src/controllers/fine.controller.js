const Fine = require("../models/fine");
const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");

class FineController {
    async create(request, response) {
        const fine = {
            period: request.body.period,
        };

        try {
            const resource = await Fine.create(fine);
            response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the fine.");
        }
    }

    async deleteById(request, response) {
        if (!request.params.id) {
            response.badRequest("Param id cannot be empty!");
        }
        try {
            await Fine.deleteById(request.params.id);
            response.ok();
        } catch (error) {
            response.internalServerError(
                error.message || `Some error occurred on deleting fine with id ${request.params.id}.`
            );
        }
    }

    async getAll(request, response) {
        try {
            const resources = await Fine.getAll();
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on retrieving fines.");
        }
    }

    async get(request, response) {
        if (!request.params.id) {
            response.badRequest("Param id cannot be empty!");
            return;
        }
        try {
            const resource = await Fine.getById(request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.notFound(`No fine with id ${request.params.id}.`);
            } else {
                response.internalServerError("Error retrieving fine with id " + request.params.id);
            }
        }
    }
    
    async deleteUserFine(request, response) {
        if (!request.params.fineId || !request.params.id) {
            response.badRequest("Params fineId and id cannot be empty!");
            return;
        }

        try {
            await UserFine.deleteByUserIdAndFineId(request.params.id, request.params.fineId);
            response.ok();
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async getAllUserFines(request, response) {
        if (!request.params.fineId || !request.params.id) {
            response.badRequest("Params fineId and id cannot be empty!");
            return;
        }

        try {
            const resource = await UserFine.getByUserIdAndFineId(request.params.fineId, request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response
                    .notFound(`No user fine with userId ${request.params.id} and fineId ${request.params.fineId}.`);
            } else {
                response.internalServerError(
                    `Cannot retrieve user fine with userId ${request.params.id} and fineId ${request.params.fineId}.`
                );
            }
        }
    }
}

module.exports = { FineController };
