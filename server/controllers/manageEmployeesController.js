const http = require('http');
const db = require('../db/db');
const bcrypt = require('bcrypt');

// Note: queries are empty.

getAllEmployees = async (req, res) => {
    try {
        // Get employees from the database
        const query = "";
        const [rows] = await db.query(query);

        // Return employees to frontend
        res.writeHead(200, {'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error while fetching employees: ');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to retrieve employees.' }));
    }
}

getEmployee = async (req, res, email) => {
    try {
        // Get the employee
        const query = "";
        const [rows] = await db.query(query);

        // If employee exists, get employee
        if (!rows.length) {
            res.writeHead(404, {'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Employee not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        }

    } catch (err) {
        console.error('Error while fetching employee: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to retrieve employee. '}));
    }
}

deleteEmployee = async (req, res, email) => {
    try {
        // Delete, then check if the employee exists
        const query = "";
        const [result] = db.query(query);

        if (!result.affectedRows) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Employee not found.' }));
        } else {
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Employee deleted.' }));
        }

    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error deleting employee.' }));
    }
}

createEmployee = (req, res) => {

    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    try {
        req.on('end', async () => {
            const { email, password, role } = JSON.parse(body);

            // Ensure at email, password, and role were all provided
            if (!email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email.'}));
            } else if (!password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide a password.'}));
            } else if (!role) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide a role.'}));
            }

            // Check if the user exists before creating it
            const user_exists_query = "";
            const [rows] = await db.query(user_exists_query, [email]);

            if (rows.length) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'User already exists. Please login.' }));
            }

            // If the user does not exist, create the new user
            const create_user_query = "";
            const hash = await bcrypt.hash(password, 10);
            await db.query(create_user_query, [email, hash, role]);

            // Return user creation success
            res.writeHead(201, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ message: 'User creation successful. '}));
        });
    } catch (err) {
        console.log('Error creating employee: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to register account.'}));
    }
}

updateEmployee = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const updateFields = JSON.parse(body);

            // If no email is provided, halt
            if (!email) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email to update the employee.' }));
            }

            // Check that the employee exists
            const check_query = "";
            const [rows] = await db.query(check_query, [email]);

            if (!rows.length) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Employee not found.' }));
            }

            // Create the query to update only provided fields.
            const allowedFields = [];

            const updateValues = [];
            const setClauses = [];

            for (const field in updateFields) {
                if (allowedFields.includes(field)) {
                    if (field === 'password') {
                        // Hash password before updating
                        const hash = await bcrypt.hash(updateFields[field], 10);
                        setClauses.push(`${field} = ?`);
                        updateValues.push(hash);
                    } else {
                        setClauses.push(`${field} = ?`);
                        updateValues.push(updateFields[field]);
                    }
                }
            }

            // If no valid fields were provided, return error
            if (!setClauses.length) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No valid fields to update.' }));
            }

             // Add email for WHERE clause
             updateValues.push(email);

             // Construct update query
             const update_query = `UPDATE employees SET ${setClauses.join(', ')} WHERE email = ?`;
 
             // Execute the update query
             await db.query(update_query, updateValues);
 
             // Return success message
             res.writeHead(200, { 'Content-Type': 'application/json' });
             return res.end(JSON.stringify({ message: 'Employee updated successfully.' }));

        } catch (err) {
            console.log('Error updating employee: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to update employee.' }));
        }
    });
}

module.exports = { getAllEmployees, getEmployee, deleteEmployee, createEmployee, updateEmployee };