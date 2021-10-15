const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig.json");

dbConfig.password = process.env.DB_PASSWORD;
const connectionPromise = mysql.createConnection(dbConfig);

module.exports = { connectionPromise };
