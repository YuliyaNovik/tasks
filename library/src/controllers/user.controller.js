const User = require("../models/user");
const Token = require("../models/token");
const UserFine = require("../models/userFine");
const { getLocationValue } = require("../utils/location");
const { jwt, createSalt, createHash, compare } = require("../utils/auth");

class UserController {

    constructor () {
        this.DEFAULT_ROLE = "follower";
    }

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
                role: this.DEFAULT_ROLE,
            };

            const resource = this.getResource(await User.create(user));
            resource.token = await jwt.sign(
                { user_id: resource.id, email },
                {
                    expiresIn: "1h",
                }
            );

            return response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
    }

    async login(request, response) {
        try {
            const { email, password } = request.body;

            if (!(email && password)) {
                return response.badRequest("Email and password are required");
            }

            const user = await User.getByEmail(email.toLowerCase());

            if (user && (await compare(password, user.password))) {
                const token = await jwt.sign(
                    { user_id: user.id, email },
                    {
                        expiresIn: "1h",
                    }
                );

                const resource = this.getResource(user);
                resource.token = token;
                return response.ok(JSON.stringify(resource));
            }
            return response.badRequest("Credentials are invalid");
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on login.");
        }
    }

    async resetPassword(request, response) {
        try {
            const { token, password, userId } = request.body;

            let passwordResetToken = await Token.getByUserId(userId);

            const isValid = await compare(token, passwordResetToken.value);
            if (!isValid) {
                return response.badRequest("Invalid or expired password reset token");
            }

            const user = await User.getById(userId);
            user.salt = await createSalt();
            user.password = await createHash(password, user.salt);

            const resource = this.getResource(await User.update(user));
            // sendEmail();
            await Token.deleteByTokenValue(token);
            return response.ok(JSON.stringify(resource));
        } catch (error) {
            return response.badRequest("Invalid or expired password reset token");
        }
    }

    getResource(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            role: user.role,
        };
    }

    async create(request, response) {
        try {
            const { firstName, lastName, address, email } = request.body;

            if (!(email && firstName && lastName && address)) {
                return response.badRequest("Email, first name, last name, and address are required");
            }

            if (await this.userExists(email)) {
                return response.statusCode(422).end("User already exists");
            }

            const user = {
                firstName,
                lastName,
                address,
                email: email.toLowerCase(),
                role: this.DEFAULT_ROLE,
            };

            const resource = this.getResource(await User.create(user));

            const salt = await createSalt();
            // TODO: randomize
            const resetToken = "reset token";
            const token = await createHash(resetToken, salt);

            //sendEmail
            console.log("Token: " + resetToken);
            await Token.create({ userId: resource.id, token });

            return response.created(getLocationValue(request.url, resource.id), JSON.stringify(resource));
        } catch (error) {
            return response.internalServerError(error.message || "Some error occurred on creating the user.");
        }
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
            const users = await User.getAll();
            return response.ok(JSON.stringify(users.map(this.getResource)));
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
            return response.ok(JSON.stringify(this.getResource(user)));
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
