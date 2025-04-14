const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getManagerProfile = async (req, res, email) => {
    try {
        if(!email){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'No manager email received.'}));
        }
        // Get the manager's profile page and return all the fields they're allowed to see

        const [ results ] = await db.query(queries.get_manager_profile, [email]);
        if(!results || results.affectedRows == 0){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'No manager found.'}));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(results[0]));
    } catch (err) {
        console.error('Error fetching review: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error fetching manager profile.' }));
        }
}

const updateManagerProfile = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response 
    req.on('end', async () => {
        var { firstname, lastname, birthdate, gender, email } = JSON.parse(body);
        try {
            if(!email){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No manager email received.'}));
            }

            const [ curr_user ] = await db.query(queries.get_manager_profile, [email]);
            // Update a manager's account information (excluding membership)
            if(!curr_user || curr_user.length == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No account with that manager ID found!'}));
            }

            if(firstname == null || firstname == ""){
                firstname = curr_user[0].FirstName;
            }

            if(lastname == null || lastname == ""){
                lastname = curr_user[0].LastName;
            }

            if(birthdate == null || birthdate == ""){
                birthdate = curr_user[0].BirthDate;
            }

            if(gender == null || gender == ""){
                gender = curr_user[0].Gender;
            }

            const [ result ] = await db.query(queries.update_manager_profile, [firstname, lastname, birthdate, gender, email]);

            if(!result || result.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Updated", "Manager", curr_user[0].ManagerID, "Manager by the name of " + firstname + " " + lastname + " has updated their account."])

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Manager\'s profile successfully updated.' }));
        } catch (err) {
            console.error('Error updating manager profile: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error updating manager\'s profile.' }));
        }
    });
}

module.exports = { getManagerProfile, updateManagerProfile};