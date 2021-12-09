const { ResourceRouter } = require("./router");
const { UserController } = require("../controllers/user.controller");
const { verifyToken } = require("../utils/auth");

const getUserRouter = () => {
    const resourceKey = "users";
    const controller = new UserController();
    const router = new ResourceRouter(resourceKey, controller);
    addNestedFines(router, controller);
    router.addMiddleware(verifyToken);
    return router;
};

const addNestedFines = (router, controller) => {
    router.get(`/${router.resourceKey}/:userId/fines/:id`, async (request, response) => {
        await controller.getAllUserFines(request, response);
    });

    router.delete(`/${router.resourceKey}/:userId/fines/:id`, async (request, response) => {
        await controller.deleteUserFine(request, response);
    });
};

module.exports = { getUserRouter };
