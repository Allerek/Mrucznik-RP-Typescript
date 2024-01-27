var mysql = require('mysql');
const {
  SendRconCommand
} = require('samp-node-lib');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'allerek',
  password: '6JvFP8QN)nZUy.Bk',
  database: 'mrp_samp'
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