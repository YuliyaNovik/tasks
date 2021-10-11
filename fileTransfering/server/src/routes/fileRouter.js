const { Router } = require("./router");
const { getAllFiles, saveFile, getFile } = require("../controllers/fileController");

// function eventsHandler(request, response, next) {
//     const headers = {
//         "Content-Type": "text/event-stream",
//         Connection: "keep-alive",
//         "Cache-Control": "no-cache",
//     };
//     response.writeHead(200, headers);

//     const data = `data: ${JSON.stringify(facts)}\n\n`;

//     response.write(data);

//     const clientId = Date.now();

//     const newClient = {
//         id: clientId,
//         response,
//     };

//     clients.push(newClient);

//     request.on("close", () => {
//         console.log(`${clientId} Connection closed`);
//         clients = clients.filter((client) => client.id !== clientId);
//     });
// }

const getFileRouter = () => {
    const router = new Router();

    router.get("/files", async (request, response) => {
        await getAllFiles(request, response);
    });

    router.post("/files", async (request, response) => {
        const fileName = await saveFile(request, response);
        // router.sendEventToAll(fileName);
    });

    router.get(/^\/files\/((?!(\/|\\)).)*$/, async (request, response) => {
        await getFile(request, response);
    });

    // router.get("/events", (request, response) => {
    //     eventsHandler(request, response);
    // })
    return router;
};

module.exports = { getFileRouter };
