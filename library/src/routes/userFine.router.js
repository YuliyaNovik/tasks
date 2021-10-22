const { ResourceRouter } = require("./router");
const { UserFineController } = require("../controllers/userFine.controller");

const getUserFineRouter = () => {
    const resourceKey = "activeFines";
    const controller = new UserFineController();
    const router = new ResourceRouter(resourceKey, controller);
    return router;
};

module.exports = { getUserFineRouter };
