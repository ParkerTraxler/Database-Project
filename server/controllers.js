const db = require('./db');

exports.loginUser = async (req, res) => {
    let body = '';
    
    // Read the request data
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { email, password } = JSON.parse(body);

            // Query the database to check if the user exists
            const query = "SELECT * FROM logininfo WHERE email = ? AND UserPass = ?";
            const [rows] = await db.query(query, [email, password]);

            if (rows.length > 0) {
                // Send response if login is successful
                if (!res.headersSent) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Login successful", user: rows[0] }));
                }
            } else {
                // Send response if credentials are invalid
                if (!res.headersSent) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Invalid email or password" }));
                }
            }
        } catch (error) {
            // Handle any errors that occur
            if (!res.headersSent) {
                console.error("Database error:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
            }
        }
    });
};