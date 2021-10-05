const { Server } = require("./src/server/server");
const { createDir } = require("./src/fileSystem/dir");
const { getAllFiles, saveFile, getFile } = require('./src/controller/controller');

const hostName = '127.0.0.1';
const STORAGE_DIR = process.env.STORAGE_DIR || "storage";
const PORT = process.env.PORT || 3000;

const initStorage = async (storageDir) => {
    await createDir(storageDir);
}

const initServer = async (PORT, hostName, storageDir) => {
    const server = new Server(PORT, hostName);

    server.get("/files", async (request, response) => {
        await getAllFiles(request, response, storageDir);
    })

    server.post("/files", async (request, response) => {
        await saveFile(request, response, storageDir);
    })

    server.get(/^\/files\/[\w\-\. ]+$/, async (request, response) => {
        await getFile(request, response, storageDir);
    })
}

const main = async () => {
    await initStorage(STORAGE_DIR);
    await initServer(PORT, hostName, STORAGE_DIR);
}

main();