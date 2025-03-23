const http = require('http');
const db = require('../db/db');
const bcrypt = require('bcrypt');

const getAllEmployees = async (req, res) => {
    try {
        // SQL QUERY
        // Get employees from the database

        // END SQL QUERY

        // Return employees to frontend
        res.writeHead(200, {'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error while fetching employees: ');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to retrieve employees.' }));
    }
}

const getEmployee = async (req, res, email) => {
    try {
        // SQL QUERY

        // END SQL QUERY

    } catch (err) {
        console.error('Error while fetching employee: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to retrieve employee. '}));
    }
}

const deleteEmployee = async (req, res, email) => {
    try {
        // SQL QUERY

        // Check if the employee exists
        
        // Delete employee if they exist

        // END SQL QUERY

    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error deleting employee.' }));
    }
}

const createEmployee = (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // After the request is received, process it and send the response
    req.on('end', async () => {
        try {
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

            // SQL QUERY

            // Check if the user exists before creating it

            // If the user does not exist, create the new user.
            // Remember to hash password
            
            // END SQL QUERY

            // Return user creation success
            res.writeHead(201, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ message: 'User creation successful. '}));

        } catch (err) {
            console.log('Error creating employee: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to register account.'}));
        }
    });
}

updateEmployee = (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // After the request is received, process it and send the response
    req.on('end', async () => {
        try {
            const updateFields = JSON.parse(body);

            // If no email is provided, halt
            if (!email) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email to update the employee.' }));
            }

            // SQL QUERY
            // Check that the employee exists

            // Create the query to update only provided fields.


            // END SQL QUERY
 
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