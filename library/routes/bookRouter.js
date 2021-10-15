const { ResourceRouter } = require("./router");
const { BookController } = require("../controllers/bookController");

const getBookRouter = () => {
    const router = new ResourceRouter("books", new BookController());
    return router;
};

module.exports = { getBookRouter };
