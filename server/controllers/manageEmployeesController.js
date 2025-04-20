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

const getEmployee = async (req, res, empEmail) => {
    try {
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
}

const deleteEmployee = async (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { empEmail, managerEmail } = JSON.parse(body);

            // Ensure an email was provided
            if (!empEmail) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Please specify an email pointing to the employee to delete' }))
            }
            // SQL Query - get employee account to downgrade into customer
            const [ emp_account ] = await db.query(queries.get_email_specific_emp, [empEmail]);
            if(!emp_account || emp_account.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Could not find employee account' }))
            }

            // SQL QUERY - get employee based off email (we assume we don't have their ID)
            const [ result ] = await db.query(queries.mark_emp_for_deletion, [empEmail]);
            
            if(!result || result.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Unable to mark employee for deletion.' }))
            }

            const [ downgrade ] = await db.query(queries.downgrade_employee, [empEmail]);

            if(!downgrade || downgrade.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Employee user account failed to be downgraded to customer. Contact a DBA admin immediately.' })) 
            }

            // reinstate user account
            const [ acc_reinstate ] = await db.query(queries.reinstate_customer_profile, [emp_account[0].FirstName, emp_account[0].LastName, emp_account[0].BirthDate, emp_account[0].Gender, empEmail]);
            if(!acc_reinstate || acc_reinstate.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Unable to reinstate employee\'s customer account.' })) 
            }

            await db.query(queries.new_history_log, [empEmail, "Deleted", "Employees", emp_account[0].EmployeeID, "Employee " + emp_account[0].FirstName + " " + emp_account[0].LastName + " was demoted. Their user account linked to email " + empEmail + " is now marked as a customer one."]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Employee deleted successfully' }));
        } catch (err) {
            console.error("Could not delete employee: ", err)
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

    req.on('end', async () => {
        try {
            // the way we're gonna do this is, employee makes their acc via normal login, we update enum.
            // we're also going to assume that the manager knows name, role, managerID, and all other non-null values
            // make sure getting managerID makes logical sense - might need to change this later
            const { email, position, managerEmail, managerMakingChangeEmail } = JSON.parse(body);

            // Ensure all of these were provided
            if (!email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email.'}));
            }

            else if(!position){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide the employee\'s position'}));
            }
            
            else if(!managerEmail){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Please provide which manager the employee will be working under.'})); 
            }
            
            let giftshopname = null;
            if(position == "GiftShopTeam"){
                giftshopname = "Museum Gift Shop";
            }

            // grab the customer profile of the employee (which 100% has their name and maybe other info and MUST exist)
            const [ old_profile ] = await db.query(queries.get_user_profile, [email]);
            let firstName = old_profile[0].FirstName;
            let lastName = old_profile[0].LastName;
            

            // get the managerID based off their email
            const [ manager_query ] = await db.query(queries.get_manager_query, [managerEmail]);
            if(!manager_query || manager_query.length == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'This email is not related to a manager account!'}));
            }
            let managerID = manager_query[0].ManagerID;
            const [ user_row ] = await db.query(queries.create_new_employee, [email]);
            if(!user_row || user_row.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'The employee\'s email does not have a user account! Have them create one.'}));
            }

            let employee_id = 0;

            // SQL QUERY - Reinstate the currently existing row instead of creating a new one
            const [ wasHeDeleted ] = await db.query(queries.check_employee_exist, [email]);
            if(wasHeDeleted.length > 0){
                employee_id = wasHeDeleted[0].EmployeeID;
                const [ result ] = await db.query(queries.reinstate_employee_info, [firstName, lastName, old_profile[0].BirthDate, position, giftshopname, managerID, old_profile[0].Gender, email]);
                if(!result || result.affectedRows == 0){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Unable to reinstate employee.'}));
                }
                await db.query(queries.new_history_log, [managerMakingChangeEmail, "Created", "Employees", employee_id, "An employee by the name of " + firstName + " " + lastName + " and with email " + email + " was reinstated into the system under Manager with email " + managerEmail + "."]);
            }

            // SQL QUERY - Create an entry in the employee table for the user. If it fails, reset the state
            else{
                const [ result ] = await db.query(queries.insert_employee_info, [firstName, lastName, old_profile[0].BirthDate, position, giftshopname, managerID, old_profile[0].Gender, email]);
                employee_id = result.insertId;
                if(!result || result.affectedRows == 0){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Unable to create employee.'}));
                }
                await db.query(queries.new_history_log, [managerMakingChangeEmail, "Created", "Employees", employee_id, "A new employee by the name of " + firstName + " " + lastName + " and with email " + email + " has been added to the system under Manager with email " + managerEmail + "."]);
            }

            // Remove his customer profile entirely
            const [ result ] = await db.query(queries.remove_customer_profile, [email]);
            if(!result || result.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Unable to remove employee\'s customer account!'}));
            }

            // Return user creation success
            res.writeHead(201, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ message: 'Employee creation successful. '}));
    } catch (err) {
        console.log('Error creating employee: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to create the employee account.'}));
        }
    });
}

const updateEmployee = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            var { hourlywage, weeklyhours, firstname, lastname, birthdate, ePosition, exhibitID, managerID, gender, email, managerEmail} = JSON.parse(body);

            // If no email is provided, halt
            if (!email) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email to update the employee.' }));
            }

            // SQL QUERY - Update an employee's information, by first checking if they exist
            const [rows] = await db.query(queries.get_email_specific_emp, [email]);

            if(rows.length == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Specified employee does not exist!'}));
            }

            let giftshopname = null;

            if(ePosition == "GiftShopTeam"){
                giftshopname = "Museum Gift Shop";
            }

            // my favorite part - guaranteeing all the fields
            if(hourlywage == null || hourlywage == ""){
                hourlywage = rows[0].HourlyWage;
            }

            if(weeklyhours == null || weeklyhours == ""){
                weeklyhours = rows[0].WeeklyHours;
            }

            if(firstname == null || firstname == ""){
                firstname = rows[0].FirstName;
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

            if(managerID == null || managerID == ""){
                managerID = rows[0].ManagerID;
            }

            if(gender == null || gender == ""){
                gender = rows[0].Gender;
            }
            // Create the query to update the actual entry yippee
            const [ result ] = await db.query(queries.update_employee_info, [hourlywage, weeklyhours, firstname, lastname, birthdate, ePosition, exhibitID, giftshopname, managerID, gender, email]);

            if(!result || result.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [managerEmail, "Updated", "Employees", rows[0].EmployeeID, "An employee by the name of " + firstname + " " + lastname + " with email " + email + " had information about them updated."]);

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

const updateSelfEmployee = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            var { firstname, lastname, birthdate, gender, email} = JSON.parse(body);

            // If no email is provided, halt
            if (!email) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'No employee email provided - try relogging.' }));
            }

            // SQL QUERY - Update an employee's information, by first checking if they exist
            const [rows] = await db.query(queries.get_email_specific_emp, [email]);

            if(rows.length == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Specified employee does not exist!'}));
            }

            if(firstname == null || firstname == ""){
                firstname = rows[0].FirstName;
            }

            if(lastname == null || lastname == ""){
                lastname = rows[0].LastName;
            }

            if(birthdate == null || birthdate == ""){
                birthdate = rows[0].BirthDate;
            }

            if(gender == null || gender == ""){
                gender = rows[0].Gender;
            }
            // Create the query to update the actual entry yippee
            const [ result ] = await db.query(queries.employee_acc_update, [firstname, lastname, birthdate, gender, email]);

            if(!result || result.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Updated", "Employees", rows[0].EmployeeID, "An employee by the name of " + firstname + " " + lastname + " with email " + email + " updated their own information."]);

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

// REPORT INFORMATION - Employees in each exhibit
const getExhibitEmployees = async (req, res) => {
    try {
        // SQL Query - Get employees from the database
        const [ rows ] = await db.query(queries.employee_exhibit_report);

        // to do: log when a manager generates report - do so in the report controller

        // Return employees to frontend
        res.writeHead(200, {'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error while fetching employees: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve report regarding employees & exhibits.' }));
    }
}

module.exports = { getAllEmployees, getEmployee, deleteEmployee, createEmployee, updateEmployee, updateSelfEmployee, getExhibitEmployees };