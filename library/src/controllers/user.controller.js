const User = require("../models/user");
const Token = require("../models/token");
const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");
const { createSalt, createHash } = require("../utils/auth");
const UserService = require("../services/user.service");
const MailSender = require("../utils/mailSender");
const { LinkToResetLetter } = require("../utils/mail");

class UserController {
    async create(request, response) {
        try {
            const { firstName, lastName, address, email } = request.body;

            if (!(email && firstName && lastName && address)) {
                return response.badRequest("Email, first name, last name, and address are required");
            }

            if (await UserService.userExists(email)) {
                return response.statusCode(422).end("User already exists");
            }

            const user = {
                firstName,
                lastName,
                address,
                email: email.toLowerCase(),
                role: UserService.DEFAULT_ROLE,
            };

            const resource = UserService.toResource(await User.create(user));

            const salt = await createSalt();
            // TODO: randomize
            const resetToken = "reset token";
            const token = await createHash(resetToken, salt);

            // TODO: add link
            await MailSender.send(new LinkToResetLetter(resource, ""));

            console.log("Token: " + resetToken);
            await Token.create({ userId: resource.id, token });

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
            await User.deleteById(request.params.id);
            return response.ok();
        } catch (error) {
            return response.internalServerError(
                error.message || `Some error occurred on deleting user with id ${request.params.id}.`
            );
        }
    }

    async getAll(request, response) {
        try {
            const users = await User.getAll();
            return response.ok(JSON.stringify(users.map(UserService.toResource)));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on retrieving users.");
        }
    }

    async get(request, response) {
        if (!request.params.id) {
            return response.badRequest("Param id cannot be empty!");
        }
        try {
            const user = await User.getById(request.params.id);
            return response.ok(JSON.stringify(UserService.toResource(user)));
        } catch (error) {
            if (error.reason === "not_found") {
                return response.notFound(`No user with id ${request.params.id}.`);
            } else {
                return response.internalServerError("Error retrieving user with id " + request.params.id);
            }
        }
    }

    async getAllUserFines(request, response) {
        if (!request.params.userId || !request.params.id) {
            return response.badRequest("Params userId and id cannot be empty!");
        }

        try {
            const resources = await UserFine.getByUserIdAndFineId(request.params.userId, request.params.id);
            return response.ok(JSON.stringify(resources));
        } catch (error) {
            if (error.reason === "not_found") {
                return response.notFound(
                    `No active fines with userId ${request.params.userId} and fineId ${request.params.id}.`
                );
            } else {
                return response.internalServerError(
                    `Cannot retrieve active fine with userId ${request.params.userId} and fineId ${request.params.id}.`
                );
            }
        }
    }
}

module.exports = { UserController };
