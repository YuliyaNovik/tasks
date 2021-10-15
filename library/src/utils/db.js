const mysql = require("mysql2/promise");
const dbConfig = require("../../db.config.json");

dbConfig.password = process.env.DB_PASSWORD;
const connectionPromise = mysql.createConnection(dbConfig);

module.exports = { connectionPromise };
