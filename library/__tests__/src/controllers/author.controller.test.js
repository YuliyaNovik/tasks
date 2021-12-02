const { AuthorController } = require("../../../src/controllers/author.controller");

jest.mock("../../../src/models/author");
const Author = require("../../../src/models/author");

jest.mock("../../../src/services/author.service");
const AuthorService = require("../../../src/services/author.service");

const mockCreate = (author, id) => {
    Author.create.mockImplementationOnce(async () => {
        return {
            id,
            name: author.name,
            country: author.country,
            languageId: author.languageId,
        };
    });
};

const mockGetById = (author) => {
    Author.getById.mockImplementationOnce(async () => author);
};

const mockGetAll = (authors) => {
    Author.getAll.mockImplementationOnce(async () => authors);
};

const mockDeleteById = () => {
    Author.deleteById.mockImplementationOnce(async () => {});
};

const mockExists = (exists) => {
    AuthorService.exists.mockImplementationOnce(async () => exists);
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

describe("it should check author controller", () => {
    beforeAll(() => {
        jest.resetAllMocks();
    });

    describe("it should check create method", () => {
        it("it should create author", async () => {
            const authorMock = {
                name: "Name",
                country: "USA",
                languageId: 1,
            };
            mockCreate(authorMock, 1);
            const controller = new AuthorController();
            const request = mockRequest({ body: authorMock, url: "/some/base/path" });
            const response = mockResponse();

            await controller.create(request, response);

            expect(response.created).toHaveBeenCalled();
            expect(response.created.mock.calls[0][0]).toEqual("/some/base/path/1");
            expect(JSON.parse(response.created.mock.calls[0][1])).toEqual({
                id: 1,
                name: "Name",
                country: "USA",
                languageId: 1,
            });
        });

        it("it should check author existence", async () => {
            const authorMock = {
                name: "Name",
                country: "USA",
                languageId: 1,
            };
            mockExists(true);
            const controller = new AuthorController();
            const request = mockRequest({ body: authorMock });
            const response = mockResponse();

            await controller.create(request, response);

            expect(response.statusCode).toHaveBeenCalledWith(422);
            expect(response.end).toHaveBeenCalledWith("Author already exists");
        });

        it("it should check body fields before creation", async () => {
            const controller = new AuthorController();
            const request = mockRequest({ body: {} });
            const response = mockResponse();

            await controller.create(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Name, country, and languageId are required");
        });
    });

    describe("it should check get method", () => {
        it("it should get author by id", async () => {
            const authorMock = {
                id: 1,
                name: "Name",
                country: "USA",
                languageId: 1,
            };
            mockGetById(authorMock);
            const controller = new AuthorController();
            const request = mockRequest({ params: { id: 1 }, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.get(request, response);

            expect(response.ok).toHaveBeenCalled();
            expect(JSON.parse(response.ok.mock.calls[0][0])).toEqual(authorMock);
        });

        it("it should check id parameter", async () => {
            const authorMock = {
                name: "Name",
                country: "USA",
                languageId: 1,
            };
            mockGetById(authorMock);
            const controller = new AuthorController();
            const request = mockRequest({ params: {}, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.get(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Param id cannot be empty!");
        });
    });

    describe("it should check getAll method", () => {
        it("it should get authors", async () => {
            const authorsMock = [
                {
                    name: "Name",
                    country: "USA",
                    languageId: 1,
                },
            ];
            mockGetAll(authorsMock);
            const controller = new AuthorController();
            const request = mockRequest({ url: "/some/base/path/" });
            const response = mockResponse();

            await controller.getAll(request, response);

            expect(response.ok).toHaveBeenCalled();
            expect(JSON.parse(response.ok.mock.calls[0][0])).toEqual(authorsMock);
        });
    });

    describe("it should check deleteById method", () => {
        it("it should delete author by id", async () => {
            mockDeleteById();
            const controller = new AuthorController();
            const request = mockRequest({ params: { id: 1 }, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.deleteById(request, response);

            expect(response.ok).toHaveBeenCalled();
        });

        it("it should check id parameter", async () => {
            mockDeleteById();
            const controller = new AuthorController();
            const request = mockRequest({ params: {}, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.deleteById(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Param id cannot be empty!");
        });
    });
});
