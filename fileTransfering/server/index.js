const { Server } = require("./src/server/server");
const { createDir } = require("./src/fileSystem/dir");
const { getAllFiles, saveFile, getFile } = require('./src/controller/controller');

const hostName = '127.0.0.1';
const STORAGE_DIR = process.env.STORAGE_DIR || "storage";
const PORT = process.env.PORT || 3000;

let clients = [];
let facts = [];

const initStorage = async (storageDir) => {
    await createDir(storageDir);
}

function eventsHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
  
    const data = `data: ${JSON.stringify(facts)}\n\n`;
  
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
  }
  
//   app.get('/events', eventsHandler);

const initServer = async (PORT, hostName, storageDir) => {
    const server = new Server(PORT, hostName);

    server.get("/files", async (request, response) => {
        await getAllFiles(request, response, storageDir);
    })

    server.post("/files", async (request, response) => {
        const fileName = await saveFile(request, response, storageDir);
        server.sendEventToAll(fileName);
    })

    server.get(/^\/files\/[\w\-\. ]+$/, async (request, response) => {
        await getFile(request, response, storageDir);
    })

    server.get("/events", (request, response) => {
        eventsHandler(request, response);
    })
}

const main = async () => {
    await initStorage(STORAGE_DIR);
    await initServer(PORT, hostName, STORAGE_DIR);
}

main();