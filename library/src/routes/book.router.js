const { ResourceRouter } = require("./router");
const { BookController } = require("../controllers/book.controller");

const getBookRouter = () => {
    const router = new ResourceRouter("books", new BookController());
    return router;
};

module.exports = { getBookRouter };
