const { ResourceRouter } = require("./router");
const { UserFineController } = require("../controllers/userFine.controller.controller");

const getUserRouter = () => {
    const resourceKey = "user-fine";
    const controller = new UserFineController();
    const router = new ResourceRouter(resourceKey, controller);
    addNestedFines(router, controller);
    return router;
};

const addNestedFines = (router, controller) => {
    router.get(`/${router.resourceKey}`, async (request, response) => {
        await controller.getAllUserFines(request, response);
    });

    router.post(`/${router.resourceKey}`, async (request, response) => {
        await controller.createUserFine(request, response);
    });

    router.get(`/${router.resourceKey}/:id`, async (request, response) => {
        await controller.getUserFine(request, response);
    });

    router.delete(`/${router.resourceKey}/:id`, async (request, response) => {
        await controller.deleteUserFine(request, response);
    });
};

module.exports = { getUserRouter };
