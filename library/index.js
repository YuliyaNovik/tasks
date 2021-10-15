const Book = require("./models/book");
const Author = require("./models/author");
const { Server } = require("./server");
const { getBookRouter } = require("./routes/bookRouter");
const { getAuthorRouter } = require("./routes/authorRouter");

const hostName = "127.0.0.1";
const PORT = process.env.PORT || 3000;

process.on("uncaughtException", function (err) {
    console.error(err.stack);
});

const main = async () => {
    const server = new Server(PORT, hostName);
    server.addRouter(getBookRouter());
    server.addRouter(getAuthorRouter());
};

main();
