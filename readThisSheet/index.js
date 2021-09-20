const { readThisSheet } = require("./modules/readThisSheet");

const FILE_NAME = process.env.FILE_NAME || "Karl_Marx-Das_Kapital.txt";
const MESSAGE_LENGTH = process.env.MESSAGE_LENGTH || 15;

readThisSheet(FILE_NAME, MESSAGE_LENGTH);