var mysql = require('mysql2');
const fs = require('fs');

// Define database pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}).promise();

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }

    console.log("Successfully connected to the database.");
    connection.release();
});

module.exports = pool;
