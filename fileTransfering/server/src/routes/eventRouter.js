const { Router } = require("./router");
const { HttpStatusCode } = require("../utils/httpStatusCode");

const getEventRouter = (request, response, next) => {
    // const headers = {
    //     "Content-Type": "text/event-stream",
    //     Connection: "keep-alive",
    //     "Cache-Control": "no-cache",
    // };
    // response.writeHead(HttpStatusCode.OK, headers);

    // const data = `data: ${JSON.stringify(facts)}\n\n`;

    // response.write(data);

    // const clientId = Date.now();

    // const newClient = {
    //     id: clientId,
    //     response,
    // };

    // clients.push(newClient);

    // request.on("close", () => {
    //     console.log(`${clientId} Connection closed`);
    //     clients = clients.filter((client) => client.id !== clientId);
    // });
};

const getFileRouter = () => {
    const router = new Router();

    router.get("/events", (request, response) => {
        eventsHandler(request, response);
    });

    return router;
};

module.exports = { getEventRouter };
