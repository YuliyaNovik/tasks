const { Router } = require("./router");
const { AuthController } = require("../controllers/auth.controller");

const getAuthRouter = () => {
    const resourceKey = "auth";
    const controller = new AuthController();
    const router = new Router();
    router.resourceKey = resourceKey;
    addRoutes(router, controller);
    return router;
};

const addRoutes = (router, controller) => {
    router.post(`/${router.resourceKey}`, async (request, response) => {
        await controller.register(request, response);
    });

    router.get(`/${router.resourceKey}`, async (request, response) => {
        await controller.login(request, response);
    });

    router.put(`/${router.resourceKey}`, async (request, response) => {
        await controller.resetPassword(request, response);
    });
};

module.exports = { getAuthRouter };