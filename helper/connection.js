const { Client } = require("pg");
require("dotenv").config();

const { USER, HOST, DATABASE, PASSWORD, PORT } = process.env;

const db = new Client({
  user: USER,
  host: HOST,
  database: DATABASE,
  password: PASSWORD,
  port: PORT,
});

db.connect((err) => {
  if (err) {
    console.log("db connection error", err);
  } else {
    console.log("berhasil bro");
  }
});

module.exports = db;
