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
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error while fetching employees: ');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve employees.' }));
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
            return res.end(JSON.stringify(rows[0]));
        } catch (err) {
            console.error('Error while fetching employee: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to retrieve employee. '}));
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
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No employee with that email found!' }))
            }

            const downgrade = await db.query(queries.downgrade_employee, [empEmail]);

            if(!downgrade || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Employee user account failed to be downgraded to customer. Contact a DBA admin immediately.' })) 
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Employee deleted successfully' }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error deleting employee.' }));
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
            // make sure getting managerID makes logical sense - might need to change this later
            const { email, firstName, lastName, position, managerEmail } = JSON.parse(body);

            // Ensure all of these were provided
            if (!email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email.'}));
            }
            else if (!firstName || !lastName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide the employee\'s full name'}));
            }

            else if(!position){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide the employee\'s position'}));
            }
            
            else if(!managerEmail){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Please provide which manager the employee will be working under.'})); 
            }
            
            // get the managerID based off their email
            const manager_query = await db.query(queries.get_manager_query, [managerEmail]);
            if(!manager_query || manager_query.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'This email is not related to a manager account!'}));
            }
            let managerID = manager_query[0].ManagerID;
            const user_row = await db.query(queries.create_new_employee, [email]);
            if(!user_row || user_row.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'The employee\'s email does not have a user account! Have them create one.'}));
            }

            // SQL QUERY - Create an entry in the employee table for the user. If it fails, reset the state
            try {
                const result = await db.query(queries.insert_employee_info, [firstName, lastName, position, managerID, email]);
                if(!result || result.rowCount == 0){
                    throw ("Unable to add employee info into employee table");
                }
            } catch (err){
                db.query(queries.downgrade_employee, [email]);
                throw err;
            }

            // Return user creation success
            res.writeHead(201, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ message: 'Employee creation successful. '}));
        });
    } catch (err) {
        console.log('Error creating employee: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to create the employee account.'}));
    }
}

const updateEmployee = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            var { hourlywage, weeklyhours, firstname, lastname, birthdate, ePosition, exhibitID, giftshopname, managerID, gender, email } = JSON.parse(body);

            // If no email is provided, halt
            if (!email) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email to update the employee.' }));
            }

            // SQL QUERY - Update an employee's information, by first checking if they exist
            const [rows] = await db.query(queries.get_specific_art, [artID]);

            if(!rows.length){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Specified employee does not exist!'}));
            }

            // my favorite part - guaranteeing all the fields
            if(hourlywage == null || hourlywage == ""){
                hourlywage = rows[0].HourlyWage;
            }

            if(weeklyhours == null || weeklyhours == ""){
                weeklyhours = rows[0].WeeklyHours;
            }

            if(firstname == null || firstname == ""){
                firstname = rows[0].Firstname;
            }

            if(lastname == null || lastname == ""){
                lastname = rows[0].LastName;
            }

            if(birthdate == null || birthdate == ""){
                birthdate = rows[0].BirthDate;
            }

            if(ePosition == null || ePosition == ""){
                ePosition = rows[0].EPosition;
            }

            if(exhibitID == null || exhibitID == ""){
                exhibitID = rows[0].ExhibitID;
            }

            if(giftshopname == null || giftshopname == ""){
                giftshopname = rows[0].GiftShopName;
            }

            if(managerID == null || managerID == ""){
                managerID = rows[0].ManagerID;
            }

            if(gender == null || gender == ""){
                gender = rows[0].Gender;
            }
            // Create the query to update the actual entry yippee
            const result = await db.query(queries.update_employee_info, [hourlywage, weeklyhours, firstname, lastname, birthdate, ePosition, exhibitID, giftshopname, managerID, gender, email]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
            }

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