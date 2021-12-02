const { UserController } = require("../../../src/controllers/user.controller");

jest.mock("../../../src/models/user");
const User = require("../../../src/models/user");

jest.mock("../../../src/services/user.service");
const UserService = require("../../../src/services/user.service");

const mockUpdate = (updatedUser) => {
    User.update.mockImplementationOnce(async () => {
        const roleId = updatedUser.role === "admin" ? 1 : 2;
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            first_name: updatedUser.firstName,
            last_name: updatedUser.lastName,
            address: updatedUser.address,
            role_id: roleId,
            password_hash: updatedUser.password,
        };
    });
};

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
        };
    });
};

const mockGetById = (user) => {
    User.getById.mockImplementationOnce(async () => user);
};

const mockGetAll = (users) => {
    User.getAll.mockImplementationOnce(async () => users);
};

const mockDeleteById = () => {
    User.deleteById.mockImplementationOnce(async () => {});
};

const mockUserExists = (exists) => {
    UserService.userExists.mockImplementationOnce(async () => exists);
};

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
};

const mockRequest = (request) => {
    return request;
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

describe("it should check user controller", () => {
    beforeAll(() => {
        jest.resetAllMocks();
    });

    describe("it should check get method", () => {
        it("it should get user by id", async () => {
            const userMock = {
                id: 1,
                firstName: "Name",
                lastName: "Lastname",
                address: "address",
                password: "password",
                email: "12@gmail.com",
            };
            mockGetById(userMock);
            mockToResource(userMock, userMock.id);
            const controller = new UserController();
            const request = mockRequest({ params: { id: 1 }, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.get(request, response);

            expect(response.ok).toHaveBeenCalled();
            expect(JSON.parse(response.ok.mock.calls[0][0])).toEqual({
                id: 1,
                firstName: "Name",
                lastName: "Lastname",
                address: "address",
                email: "12@gmail.com",
            });
        });

        it("it should check id parameter", async () => {
            const userMock = {
                firstName: "Name",
                lastName: "Lastname",
                address: "address",
                password: "password",
                email: "12@gmail.com",
            };
            mockGetById(userMock);
            const controller = new UserController();
            const request = mockRequest({ params: {}, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.get(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Param id cannot be empty!");
        });
    });

    describe("it should check getAll method", () => {
        it("it should get users", async () => {
            const usersMock = [
                {
                    id: 1,
                    firstName: "Name",
                    lastName: "Lastname",
                    address: "address",
                    password: "password",
                    email: "12@gmail.com",
                },
            ];
            mockGetAll(usersMock);
            mockToResource(usersMock[0], usersMock[0].id);
            const controller = new UserController();
            const request = mockRequest({ url: "/some/base/path/" });
            const response = mockResponse();

            await controller.getAll(request, response);

            expect(response.ok).toHaveBeenCalled();
            expect(JSON.parse(response.ok.mock.calls[0][0])).toEqual([
                {
                    id: 1,
                    firstName: "Name",
                    lastName: "Lastname",
                    address: "address",
                    email: "12@gmail.com",
                },
            ]);
        });
    });

    describe("it should check deleteById method", () => {
        it("it should delete user by id", async () => {
            mockDeleteById();
            const controller = new UserController();
            const request = mockRequest({ params: { id: 1 }, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.deleteById(request, response);

            expect(response.ok).toHaveBeenCalled();
        });

        it("it should check id parameter", async () => {
            const controller = new UserController();
            const request = mockRequest({ params: {}, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.deleteById(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Param id cannot be empty!");
        });
    });
});
