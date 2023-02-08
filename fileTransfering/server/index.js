const { Server } = require("./src/server");
const { createDir } = require("./src/utils/dir");
const { getFileRouter } = require("./src/routes/fileRouter");

const hostName = "127.0.0.1";
const STORAGE_DIR = process.env.STORAGE_DIR || "storage";
const PORT = process.env.PORT || 3000;

process.on('uncaughtException', function (err) {
    console.error(err.stack);
});

const initStorage = async (storageDir) => {
    await createDir(storageDir);
};

const initServer = async (PORT, hostName, storageDir) => {
    const server = new Server(PORT, hostName);
    server.addRouter(getFileRouter(storageDir));
};

const main = async () => {
    await initStorage(STORAGE_DIR);
    await initServer(PORT, hostName, STORAGE_DIR);
};

main();
