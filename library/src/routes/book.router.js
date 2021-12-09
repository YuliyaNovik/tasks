const { ResourceRouter } = require("./router");
const { BookController } = require("../controllers/book.controller");
const { verifyToken } = require("../utils/auth");

const getBookRouter = () => {
    const router = new ResourceRouter("books", new BookController());
    router.addMiddleware(verifyToken);
    return router;
};

module.exports = { getBookRouter };
