const Fine = require("../models/fine");
const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");

class FineController {
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
