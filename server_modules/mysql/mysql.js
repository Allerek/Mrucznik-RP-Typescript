var mysql = require('mysql');
require("dotenv").config();
const {
  SendRconCommand
} = require('samp-node-lib');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
});


pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
  if (error) {
    console.log("!!!!!!!Błąd połączenia z bazą danych!!!!!!!")
    console.log(error);
    SendRconCommand("exit");
  };

});
module.exports = {
  pool
};