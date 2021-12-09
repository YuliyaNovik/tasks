const { ResourceRouter } = require("./router");
const { AuthorController } = require("../controllers/author.controller");
const { verifyToken } = require("../utils/auth");

const getAuthorRouter = () => {
    const router = new ResourceRouter("authors", new AuthorController());
    router.addMiddleware(verifyToken);
    return router;
};

module.exports = { getAuthorRouter };
