const { Router } = require("./router");
const FileController = require("../controllers/fileController");

const getFileRouter = (storageDir) => {
    const router = new Router();
    const controller = new FileController(storageDir);
    router.get("/files", async (request, response) => {
        await controller.getAllFiles(request, response);
    });

    router.post("/files", async (request, response) => {
        const fileName = await controller.saveFile(request, response);
    });

    router.get(/^\/files\/((?!(\/|\\)).)*$/, async (request, response) => {
        await controller.getFile(request, response);
    });

    return router;
};

module.exports = { getFileRouter };
