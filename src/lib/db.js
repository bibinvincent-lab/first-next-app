// src/lib/db.js
import mysql from "mysql2/promise";

let connection; // single variable to store the connection

export const createConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("Connected to MySQL!");
  }
  return connection;
};