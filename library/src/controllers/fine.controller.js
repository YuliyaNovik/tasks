const Fine = require("../models/fine");
const {HttpStatusCode} = require("../utils/httpStatusCode");
const UserFine = require("../models/userFine");

class FineController {
    async createUserFine(request, response) {
        if (!request.body) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Body cannot be empty!");
            return;
        }

        if (!request.params || !request.params.fineId || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Params fineId and id cannot be empty!");
            return;
        }

        const userFine = {
            userId: request.params.id,
            fineId: request.body.fineId,
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
        if (!request.params || !request.params.fineId || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Params fineId and id cannot be empty!");
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
        if (!request.params || !request.params.fineId) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Param fineId cannot be empty!");
            return;
        }

        try {
            const resources = await UserFine.getAllByFineId(request.params.fineId);
            response.ok(JSON.stringify(resources));
        } catch (error) {
            response.internalServerError(error.message || "Some error occurred on retrieving user fines.");
        }
    }

    async getUserFine(request, response) {
        if (!request.params || !request.params.fineId || !request.params.id) {
            response.statusCode(HttpStatusCode.BAD_REQUEST).send("Params fineId and id cannot be empty!");
            return;
        }

        try {
            const resource = await UserFine.getByUserIdAndFineId(request.params.fineId, request.params.id);
            response.ok(JSON.stringify(resource));
        } catch (error) {
            if (error.reason === "not_found") {
                response.statusCode(HttpStatusCode.NOT_FOUND).send(`No user fine with userId ${request.params.id} and fineId ${request.params.fineId}.`);
            } else {
                response.internalServerError(`Error retrieving user fine with userId ${request.params.id} and fineId ${request.params.fineId}.`);
            }
        }
    }
}

module.exports = {FineController};
