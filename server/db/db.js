var mysql = require('mysql2');

// Define database pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: process.env.SSL_CERTIFICATE,
        rejectUnauthorized: false
    }
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
