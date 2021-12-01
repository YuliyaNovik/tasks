const User = require("../models/user");
const { getLocationValue } = require("../utils/location");
const { jwt } = require("../utils/auth");
const { encrypt, compare } = require("../utils/crypt");
const UserService = require("../services/user.service");
const TokenService = require("../services/token.service");
const MailSender = require("../utils/mailSender");
const { SuccessfulResetLetter } = require("../utils/mail");

class AuthController {
    async register(request, response) {
        try {
            const { firstName, lastName, address, password, email } = request.body;

            if (!(email && password && firstName && lastName && address)) {
                return response.badRequest("Email, password, first name, last name, and address are required");
            }

            if (await UserService.userExists(email)) {
                return response.statusCode(422).end("User already exists");
            }

            const encryptedPassword = await encrypt(password);

            const user = {
                firstName,
                lastName,
                address,
                email: email.toLowerCase(),
                password: encryptedPassword,
                role: UserService.DEFAULT_ROLE,
            };

            const resource = UserService.toResource(await User.create(user));
            resource.token = await this.createUserJWT(resource);

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
                const resource = UserService.toResource(user);
                resource.token = await this.createUserJWT(resource);
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

            if (!(await TokenService.isValidToken(userId, token))) {
                return response.badRequest("Invalid or expired password reset token");
            }

            const user = await User.getById(userId);
            user.password = await encrypt(password);

            const resource = UserService.toResource(await User.update(user));
            await TokenService.deleteByTokenValue(token);

            // TODO: add link + create new Token
            const newToken = TokenService.getActiveToken(resource.id);
            await MailSender.send(new SuccessfulResetLetter(resource, ""));

            return response.ok(JSON.stringify(resource));
        } catch (error) {
            return response.badRequest("Invalid or expired password reset token");
        }
    }

    async createUserJWT(user) {
        return await jwt.sign(
            { user_id: user.id, email: user.email },
            {
                expiresIn: "1h",
            }
        );
    }
}

module.exports = { AuthController };
