const { FineController } = require("../../../src/controllers/fine.controller");

jest.mock("../../../src/models/fine");
const Fine = require("../../../src/models/fine");

const mockCreate = (fine, id) => {
    Fine.create.mockImplementationOnce(async () => {
        return {
            id,
            period: fine.period
        };
    });
};

const mockGetById = (fine) => {
    Fine.getById.mockImplementationOnce(async () => fine);
};

const mockGetAll = (fines) => {
    Fine.getAll.mockImplementationOnce(async () => fines);
};

const mockDeleteById = () => {
    Fine.deleteById.mockImplementationOnce(async () => {});
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

describe("it should check fine controller", () => {
    beforeAll(() => {
        jest.resetAllMocks();
    });

    describe("it should check create method", () => {
        it("it should create fine", async () => {
            const fineMock = {
                period: 20
            };
            mockCreate(fineMock, 1);
            const controller = new FineController();
            const request = mockRequest({ body: fineMock, url: "/some/base/path" });
            const response = mockResponse();

            await controller.create(request, response);

            expect(response.created).toHaveBeenCalled();
            expect(response.created.mock.calls[0][0]).toEqual("/some/base/path/1");
            expect(JSON.parse(response.created.mock.calls[0][1])).toEqual({
                id: 1,
                period: 20
            });
        });

        // TODO: implement test on fine existence
        // it("it should check fine existence", async () => {
        //     const fineMock = {
        //         name: "Name", country: "USA", languageId: 1
        //     };
        //     mockFineExists(true);
        //     const controller = new FineController();
        //     const request = mockRequest(fineMock);
        //     const response = mockResponse();
        //
        //     await controller.create(request, response);
        //
        //     expect(response.statusCode).toHaveBeenCalledWith(422);
        //     expect(response.end).toHaveBeenCalledWith("Fine already exists");
        // });

        it("it should check body fields before creation", async () => {
            const controller = new FineController();
            const request = mockRequest({ body: {} });
            const response = mockResponse();

            await controller.create(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Period is required");
        });
    });

    describe("it should check get method", () => {
        it("it should get fine by id", async () => {
            const fineMock = {
                id: 1,
                name: "Name",
                country: "USA",
                languageId: 1,
            };
            mockGetById(fineMock);
            const controller = new FineController();
            const request = mockRequest({ params: { id: 1 }, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.get(request, response);

            expect(response.ok).toHaveBeenCalled();
            expect(JSON.parse(response.ok.mock.calls[0][0])).toEqual(fineMock);
        });

        it("it should check id parameter", async () => {
            const fineMock = {
                name: "Name",
                country: "USA",
                languageId: 1,
            };
            mockGetById(fineMock);
            const controller = new FineController();
            const request = mockRequest({ params: {}, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.get(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Param id cannot be empty!");
        });
    });

    describe("it should check getAll method", () => {
        it("it should get fines", async () => {
            const finesMock = [
                {
                    name: "Name",
                    country: "USA",
                    languageId: 1,
                },
            ];
            mockGetAll(finesMock);
            const controller = new FineController();
            const request = mockRequest({ url: "/some/base/path/" });
            const response = mockResponse();

            await controller.getAll(request, response);

            expect(response.ok).toHaveBeenCalled();
            expect(JSON.parse(response.ok.mock.calls[0][0])).toEqual(finesMock);
        });
    });

    describe("it should check deleteById method", () => {
        it("it should delete fine by id", async () => {
            mockDeleteById();
            const controller = new FineController();
            const request = mockRequest({ params: { id: 1 }, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.deleteById(request, response);

            expect(response.ok).toHaveBeenCalled();
        });

        it("it should check id parameter", async () => {
            mockDeleteById();
            const controller = new FineController();
            const request = mockRequest({ params: {}, url: "/some/base/path/1" });
            const response = mockResponse();

            await controller.deleteById(request, response);

            expect(response.badRequest).toHaveBeenCalledWith("Param id cannot be empty!");
        });
    });
});
