const { ResourceRouter } = require("./router");
const { UserController } = require("../controllers/user.controller");

const getUserRouter = (nestedRouters) => {
    const resourceKey = "users";
    const router = new ResourceRouter("users", new UserController());

    for (const nestedRouter of nestedRouters) {

        const nestedResourceKey = nestedRouter.resourceKey;
        const nestedResourceUrl = new RegExp(`^/${resourceKey}/[1-9]\d*/${nestedResourceKey}`);
    
        router.get(nestedResourceUrl, async (request, response) => {
            request.primaryParams = {
                userId: request.url.split(`/${resourceKey}/`)[1],
            };
    
            const newUrl = "/"+ nestedResourceKey + request.url.split(nestedResourceKey)[1];
            const route = nestedRouter.routes.find(
                (route) => router.compareURL(route.url, newUrl) && route.method === request.method
            );
    
            if (route) {
                route.callback(request, response);
            } else {
                // TODO: error
            }
        });
    }

    return router;
};

module.exports = { getUserRouter };
