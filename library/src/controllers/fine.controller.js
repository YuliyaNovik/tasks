const Fine = require("../models/fine");
const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");

class FineController {
    async create(request, response) {
        const fine = {
            period: request.body.period,
        };

        if (!fine.period) {
            return response.badRequest("Period is required");
        }

        try {
            const resource = await Fine.create(fine);
            return response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on creating the fine.");
        }
    }

    async deleteById(request, response) {
        if (!request.params.id) {
            return response.badRequest("Param id cannot be empty!");
        }
        try {
            await Fine.deleteById(request.params.id);
            return response.ok();
        } catch (error) {
            return response.internalServerError(
                error.message || `Some error occurred on deleting fine with id ${request.params.id}.`
            );
        }
    }

    async getAll(request, response) {
        try {
            const resources = await Fine.getAll();
            return response.ok(JSON.stringify(resources));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on retrieving fines.");
        }
    }

    async get(request, response) {
        if (!request.params.id) {
            return response.badRequest("Param id cannot be empty!");
        }
        try {
            const resource = await Fine.getById(request.params.id);
            return response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                return response.notFound(`No fine with id ${request.params.id}.`);
            } else {
                return response.internalServerError("Error retrieving fine with id " + request.params.id);
            }
        }
    }

    async deleteUserFine(request, response) {
        if (!request.params.fineId || !request.params.id) {
            return response.badRequest("Params fineId and id cannot be empty!");
        }

        try {
            await UserFine.deleteByUserIdAndFineId(request.params.id, request.params.fineId);
            return response.ok();
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async getAllUserFines(request, response) {
        if (!request.params.fineId || !request.params.id) {
            return response.badRequest("Params fineId and id cannot be empty!");
        }

        try {
            const resources = await UserFine.getByUserIdAndFineId(request.params.fineId, request.params.id);
            return response.ok(JSON.stringify(resources));
        } catch (error) {
            if (error.reason === "not_found") {
                return response.notFound(`No active fines with userId ${request.params.id} and fineId ${request.params.fineId}.`);
            } else {
                return response.internalServerError(
                    `Cannot retrieve active fine with userId ${request.params.id} and fineId ${request.params.fineId}.`
                );
            }
        }
    }
}

module.exports = { FineController };
