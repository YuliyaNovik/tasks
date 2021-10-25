const User = require("../models/user");
const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");
const { jwt, createSalt, createHash, compare } = require("../utils/auth");

class UserController {
    async register(request, response) {
        try {
            const { firstName, lastName, address, password, email } = request.body;

            if (!(email && password && firstName && lastName && address)) {
                return response.badRequest("Email, password, first name, last name, and address are required");
            }

            if (await this.userExists(email)) {
                return response.statusCode(422).end("User already exists");
            }

            const salt = await createSalt();
            const encryptedPassword = await createHash(password, salt);

            const user = {
                firstName,
                lastName,
                address,
                email: email.toLowerCase(),
                password: encryptedPassword,
                salt,
                role: "follower"
            };

            const resource = await User.create(user);

            resource.token = await jwt.sign({ user_id: resource.id, email }, {
                expiresIn: "1h",
            });

            return response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async login(request, response) {
        try {
            const { email, password } = request.body;

            if (!(email && password)) {
                response.badRequest("Email and password are required");
                return;
            }

            const user = await User.getByEmail(email.toLowerCase());

            if (user && (await compare(password, user.password))) {
                user.token = await jwt.sign({ user_id: user.id, email }, {
                    expiresIn: "1h",
                });

                return response.ok(JSON.stringify(user));
            }
            return response.badRequest("Credentials are invalid");
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on login.");
        }
    }

    async create(request, response) {
        return this.register(request, response);
    }

    async userExists(email) {
        try {
            await User.getByEmail(email);
            return true;
        } catch (e) {
            return false;
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

    async getAllUserFines(request, response) {
        if (!request.params.userId || !request.params.id) {
            response.badRequest("Params userId and id cannot be empty!");
            return;
        }

        try {
            const resources = await UserFine.getByUserIdAndFineId(request.params.userId, request.params.id);
            response.ok(JSON.stringify(resources));
        } catch (error) {
            if (error.reason === "not_found") {
                response.notFound(
                    `No active fines with userId ${request.params.userId} and fineId ${request.params.id}.`
                );
            } else {
                response.internalServerError(
                    `Cannot retrieve active fine with userId ${request.params.userId} and fineId ${request.params.id}.`
                );
            }
        }
    }
}

module.exports = { UserController };
