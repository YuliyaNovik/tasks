const { ResourceRouter } = require("./router");
const { UserFineController } = require("../controllers/userFine.controller");
const { verifyToken } = require("../utils/auth");

const getUserFineRouter = () => {
    const resourceKey = "activeFines";
    const controller = new UserFineController();
    const router = new ResourceRouter(resourceKey, controller);
    router.addMiddleware(verifyToken);
    return router;
};

module.exports = { getUserFineRouter };
