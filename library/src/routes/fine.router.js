const { ResourceRouter } = require("./router");
const { FineController } = require("../controllers/fine.controller");

const getFineRouter = () => {
    const resourceKey = "fines";
    const controller = new FineController();
    const router = new ResourceRouter(resourceKey, controller);
    addNestedFines(router, controller);
    return router;
};

const addNestedFines = (router, controller) => {
    router.get(`/${router.resourceKey}/:fineId/users`, async (request, response) => {
        await controller.getAllUserFines(request, response);
    });

    router.post(`/${router.resourceKey}/:fineId/users`, async (request, response) => {
        await controller.createUserFine(request, response);
    });

    router.get(`/${router.resourceKey}/:fineId/users/:id`, async (request, response) => {
        await controller.getUserFine(request, response);
    });

    router.delete(`/${router.resourceKey}/:fineId/users/:id`, async (request, response) => {
        await controller.deleteUserFine(request, response);
    });
};

module.exports = { getFineRouter };
