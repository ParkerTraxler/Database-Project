const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getProfile = async (req, res, email) => {
    try {
        if(!email){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'No customer email received.'}));
        }
        // Get the user's profile page and return all the fields they're allowed to see

        const [ results ] = await db.query(queries.get_user_profile, [email]);
        if(!results || results.affectedRows == 0){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'No customer found.'}));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(results[0]));
    } catch (err) {
        console.error('Error fetching review: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error fetching user profile.' }));
        }
}

const updateProfile = (req, res) => {
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
                return res.end(JSON.stringify({ error: 'No customer email received.'}));
            }

            const [ curr_user ] = await db.query(queries.get_user_profile, [email]);
            // Update a user's account information (excluding membership)
            if(!curr_user || curr_user.length == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No account with that customer ID found!'}));
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

            const [ result ] = await db.query(queries.update_user_profile, [firstname, lastname, birthdate, gender, email]);

            if(!result || result.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Updated", "Customers", curr_user[0].CustomerID, "User by the name of " + firstname + " " + lastname + " has updated their account."])

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User\'s profile successfully updated.' }));
        } catch (err) {
            console.error('Error updating user profile: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error updating user\'s profile.' }));
        }
    });
}

const toggleMembership = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response 
    req.on('end', async () => {
        const { email } = JSON.parse(body);
        try {
            // Swap a user's membership to either be unsubscribe from or subscribe to
            if(!email){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No customer email received.'}));
            }

            const [ results ] = await db.query(queries.toggleMembership, [email]);

            await db.query(queries.new_history_log, [email, "Updated", "Customers", curr_user[0].CustomerID, "User by the name of " + firstname + " " + lastname + " has subscribed/unsubscribed from the museum's monthly membership."])

            if(!results || results.affectedRows == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Unable to toggle user\'s membership'}));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Membership successfully updated.' }));
        } catch (err) {
            console.error('Error updating review.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error updating membership.' }));
        }
    });
}

module.exports = { getProfile, updateProfile, toggleMembership };