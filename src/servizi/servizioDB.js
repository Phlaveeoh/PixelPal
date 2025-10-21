const mysql = require("mysql2");

//Creazione di un connection pool con i dati del file .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//Esporto il modulo per utilizzarlo in altri file
module.exports = pool;