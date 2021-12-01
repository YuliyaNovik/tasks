const { AuthController } = require("../../../src/controllers/auth.controller");

jest.mock("../../../src/models/user");
const User = require("../../../src/models/user");

jest.mock("../../../src/services/user.service");
const UserService = require("../../../src/services/user.service");

jest.mock("../../../src/utils/crypt");
const Crypt = require("../../../src/utils/crypt");

jest.mock("../../../src/utils/auth");
const Auth = require("../../../src/utils/auth");

const mockCreate = (user, id, roleId) => {
    User.create.mockImplementationOnce(async () => {
        return {
            id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            address: user.address,
            role_id: roleId,
            password_hash: user.password,
        }
    })
}

const mockGetByEmail = (user) => {
    User.getByEmail.mockImplementationOnce(async () => user)
}

const mockUserExists = (exists) => {
    UserService.userExists.mockImplementationOnce(async () => exists);
}

const mockToResource = (user, id) => {
    UserService.toResource.mockImplementationOnce(() => {
        return {
            id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            role: user.role,
        };
    });
}

const mockJWTSign = (token) => {
    Auth.jwt.sign.mockImplementationOnce(() => {
        return token;
    });
}

const mockEncrypt = (value) => {
    Crypt.encrypt.mockImplementationOnce(() => value);
}

const mockCompare = (equals) => {
    Crypt.compare.mockImplementationOnce(() => equals);
}

const mockRequest = (body, url) => {
    return {
        url,
        body,
    };
};

const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    res.header = jest.fn().mockReturnValue(res);
    res.statusCode = jest.fn().mockReturnValue(res);
    res.badRequest = jest.fn().mockReturnValue(res);
    res.internalServerError = jest.fn().mockReturnValue(res);
    res.notFound = jest.fn().mockReturnValue(res);
    res.ok = jest.fn().mockReturnValue(res);
    res.created = jest.fn().mockReturnValue(res);
    return res;
};

describe("it should check controller", () => {
    beforeAll(() => {
        jest.resetAllMocks();
    });

    describe("it should check register method", () => {
        it("it should register user", async () => {
            const userMock = {
                firstName: "Name", lastName: "Lastname", address: "address", password: "password", email: "12@gmail.com"
            };
            mockCreate(userMock, 1, 1);
            mockUserExists(false);
            mockToResource(userMock, 1);
            mockEncrypt("hash");
            mockJWTSign("token");
            const controller = new AuthController();
            const request = mockRequest(userMock, "/some/base/path");
            const response = mockResponse();

            await controller.register(request, response);

            expect(response.created).toHaveBeenCalled();
            expect(response.created.mock.calls[0][0]).toEqual("/some/base/path/1");
            expect(JSON.parse(response.created.mock.calls[0][1])).toEqual({
                id: 1,
                email: "12@gmail.com",
                firstName: "Name",
                lastName: "Lastname",
                address: "address",
                token: "token"
            });
        });

        it("it should check user existence", async () => {
            const userMock = {
                firstName: "Name", lastName: "Lastname", address: "address", password: "password", email: "12@gmail.com"
            };
            mockUserExists(true);
            const controller = new AuthController();
            const request = mockRequest(userMock);
            const response = mockResponse();

            await controller.register(request, response);

            expect(response.statusCode).toHaveBeenCalledWith(422);
            expect(response.end).toHaveBeenCalledWith("User already exists");
        });

        it("it should check body fields before creation", async () => {
            const controller = new AuthController();
            const request = mockRequest({});
            const response = mockResponse();

            await controller.register(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Email, password, first name, last name, and address are required");
        });
    });

    describe("it should check login method", () => {
        it("it should login user", async () => {
            const resourceMock = {
                id: 1,
                firstName: "Name",
                lastName: "Lastname",
                address: "address",
                password: "hash",
                email: "12@gmail.com"
            };
            const userMock = {
                id: 1, firstName: "Name", lastName: "Lastname", address: "address", email: "12@gmail.com"
            };
            mockGetByEmail(resourceMock);
            mockToResource(resourceMock, 1);
            mockCompare(true);
            const controller = new AuthController();
            const request = mockRequest({
                email: "12@gmail.com",
                password: "password"
            });
            const response = mockResponse();
            await controller.login(request, response);

            expect(response.ok).toHaveBeenCalled();
            expect(JSON.parse(response.ok.mock.calls[0][0])).toEqual(userMock);
        });

        it("it should check body fields before login", async () => {
            const controller = new AuthController();
            const request = mockRequest({});
            const response = mockResponse();

            await controller.login(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Email and password are required");
        });

    });

    describe("it should check resetPassword method", () => {
        it("it should reset password", () => {
            // TODO
            const controller = new AuthController();
        });
    });

    describe("it should check createUserJWT method", () => {
        it("it should create jwt", async () => {
            const userMock = {
                firstName: "Name", lastName: "Lastname", address: "address", password: "password", email: "12@gmail.com"
            };
            mockJWTSign("token");
            const controller = new AuthController();

            const actualResult = await controller.createUserJWT(userMock);
            expect(actualResult).toEqual("token");
        });
    });
})
