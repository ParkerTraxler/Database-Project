const http = require('http');
const db = require('../db/db');
const queries = require('../querylist.js');
const bcrypt = require('bcrypt');

// Note: entries in both the [customer/employee/manager] and logininfo.

const getAllEmployees = async (req, res) => {
    try {
        // SQL Query - Get employees from the database
        const [ rows ] = await db.query(queries.get_employee_query);

        // Return employees to frontend
        res.writeHead(200, {'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error while fetching employees: ');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to retrieve employees.' }));
    }
}

const getEmployee = async (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    req('end', async () => {
        try {
            const { empEmail } = JSON.parse(body);
            // Ensure an email was provided
            if (!empEmail) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Please provide an email pointing to the employee to get.' }))
            }

            // SQL QUERY - get employee based off email (we assume we don't have their ID)
            const[ rows ] = await db.query(queries.get_email_specific_emp, [empEmail]);
            
            if(!rows.length){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Specified employee does not exist! It may have been deleted.'}));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (err) {
            console.error('Error while fetching employee: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve employee. '}));
        }
    });
}

const deleteEmployee = async (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    req('end', async () => {
        try {
            const { empEmail } = JSON.parse(body);

            // Ensure an email was provided
            if (!empEmail) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Please specify an email pointing to the employee to delete' }))
            }
            // SQL QUERY - get employee based off email (we assume we don't have their ID)
            const result = await db.query(queries.mark_emp_for_deletion, [empEmail]);
            
            if(!result || result.rowCount == 0){
                throw err("No active employee with that email found.")
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error deleting employee.' }));
        }
    });
}

const createEmployee = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    try {
        req.on('end', async () => {
            // the way we're gonna do this is, employee makes their acc via normal login, we update enum.
            // we're also going to assume that the manager knows name, role, managerID, and all other non-null values
            const { email, firstName, lastName, position, managerID } = JSON.parse(body);

            // Ensure all of these were provided
            if (!email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email.'}));
            }
            else if (!firstName || !lastName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide the employee\'s full name'}));
            }

            // SQL QUERY

            // Check if the user exists before creating it

            // If the user does not exist, create the new user.
            // Remember to hash password
            
            // END SQL QUERY

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