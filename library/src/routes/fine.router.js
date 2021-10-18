const { ResourceRouter } = require("./router");
const { FineController } = require("../controllers/fine.controller");

const getFineRouter = () => {
    const resourceKey = "fines";
    const router = new ResourceRouter(resourceKey, new FineController());

    return router;
};

module.exports = { getFineRouter };