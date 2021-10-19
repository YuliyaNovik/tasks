const { ResourceRouter } = require("./router");
const { UserController } = require("../controllers/user.controller");

const getUserRouter = (nestedRouters) => {
    return new ResourceRouter("users", new UserController(), nestedRouters);
};

module.exports = { getUserRouter };
