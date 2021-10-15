const { ResourceRouter } = require("./router");
const { AuthorController } = require("../controllers/authorController");

const getAuthorRouter = () => {
    const router = new ResourceRouter("authors", new AuthorController());
    return router;
};

module.exports = { getAuthorRouter };
