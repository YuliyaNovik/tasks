const {ResourceRouter} = require("./router");
const {FineController} = require("../controllers/fine.controller");

const getFineRouter = () => {
    const resourceKey = "fines";
    const controller = new FineController();
    const router = new ResourceRouter(resourceKey, controller);
    addNestedFines(router, controller)
    return router;
};

const addNestedFines = (router, controller) => {
    router.get(new RegExp(`^/${router.resourceKey}/[1-9]\\d*/users$`), async (request, response) => {
        await controller.getAllUserFines(request, response);
    });

    router.post(new RegExp(`^/${router.resourceKey}/[1-9]\\d*/users$`), async (request, response) => {
        await controller.createUserFine(request, response);
    });

    const uri = new RegExp(`^/${router.resourceKey}/[1-9]\\d*/users/[1-9]\\d*$`);

    router.get(uri, async (request, response) => {
        request.params.id = request.url.split(`/${router.resourceKey}/`)[1];
        await controller.getUserFine(request, response);
    });

    router.delete(uri, async (request, response) => {
        request.params.id = request.url.split(`/${router.resourceKey}/`)[1];
        await controller.deleteUserFine(request, response);
    });
}

module.exports = {getFineRouter};