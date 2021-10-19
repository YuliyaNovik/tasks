const Book = require("./src/models/book");
const Author = require("./src/models/author");
const { Server } = require("./src/server");
const { getBookRouter } = require("./src/routes/book.router");
const { getAuthorRouter } = require("./src/routes/author.router");
const { getFineRouter } = require("./src/routes/fine.router");
const { getUserRouter } = require("./src/routes/user.router");

const hostName = "127.0.0.1";
const PORT = process.env.PORT || 3000;

process.on("uncaughtException", function (err) {
    console.error(err.stack);
});

const main = async () => {
    const server = new Server(PORT, hostName);
    server.use("/books", getBookRouter());
    server.use("/authors", getAuthorRouter());
    const fineRouter = getFineRouter();
    server.use("/fines", fineRouter);
    server.use("/user/:userId/fines", fineRouter);
};

main();
