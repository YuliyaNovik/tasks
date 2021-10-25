const { ResourceRouter } = require("./router");
const { UserController } = require("../controllers/user.controller");

const getUserRouter = () => {
    const resourceKey = "users";
    const controller = new UserController();
    const router = new ResourceRouter(resourceKey, controller);
    addNestedFines(router, controller);
    return router;
};

const addNestedFines = (router, controller) => {
    router.post(`/${router.resourceKey}/register`, async (request, response) => {
        await controller.register(request, response);
    });

    router.post(`/${router.resourceKey}/login`, async (request, response) => {
        await controller.login(request, response);
    });

    router.get(`/${router.resourceKey}/:userId/fines/:id`, async (request, response) => {
        await controller.getAllUserFines(request, response);
    });

    router.delete(`/${router.resourceKey}/:userId/fines/:id`, async (request, response) => {
        await controller.deleteUserFine(request, response);
    });
};

module.exports = { getUserRouter };
