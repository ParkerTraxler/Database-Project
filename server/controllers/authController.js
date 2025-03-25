const db = require('../db/db');
const queries = require('../querylist.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginUser = async (req, res) => {
    let body = '';
    
    // Read the request data
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    try {
        req.on('end', async () => {
            const { email, password } = JSON.parse(body);

            // Ensure password was given, can be moved to frontend later
            if (!password) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Password field cannot be blank.' }));
            }

            // Ensure user exists in database
            const [rows] = await db.query(queries.user_exists_query, [email]);

            if (!rows.length) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'User does not exist.'}));
            }

            const hashedPassword = rows[0].UserPass;

            const match = await bcrypt.compare(password, hashedPassword);
            if (!match) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Invalid username and/or password.'}));
            }

            // Create JWT token
            const user = {
                email: email,
                role: rows[0].UserRole
            };

            // Sign JWT token, expires in 3 hours
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '3h'});

            // Return the token to the frontend
            res.writeHead(201, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ message: 'Login successful.', token: token }));
        });
    } catch (err) {
        console.error('Error during login: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Server error occurred'}));
    }
};

registerUser = async (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    try {
        req.on('end', async() => {
            const { email, password1, firstname, lastname} = JSON.parse(body);

            // Ensure both email and password were provided
            if (!email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email.'}));
            } else if (!password1) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide a password.'}));
            }

            const [rows] = await db.query(queries.user_exists_query, [email]);
            
            // If the user already exists, return 409 CONFLICT
            if (rows.length) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'User already exists. Please login.' }));
            }

            // If not, create the user
            // Will have to also create an entry in the customer table and get first, last name, etc. from a registration form
            const hash = await bcrypt.hash(password1, 10);
            const [ results ] = await db.query(queries.create_user_query, [email, hash, "Customer"]);
            assigned_USID = results.insertId;
            await db.query(queries.create_customer_acc, [firstname, lastname, assigned_USID]);

            // Create JWT token to authenticate new user account (assume role is customer)
            const user = {
                email: email,
                role: "Customer"
            };

            // Sign JWT token, expires in 3 hours
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '3h'});

            // Return the token to the frontend
            res.writeHead(201, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ message: 'User creation successful, logged in.', token: token }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to register account.'}));
    }
};

module.exports = { loginUser, registerUser };