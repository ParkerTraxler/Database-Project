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

            console.log(birthdate);

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

            console.log(result[0].BirthDate)

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

            // Check to see if the user was already a member
            const [ user_member ] = await db.query(queries.get_user_member_info, [email]);
            if(user_member.length > 0){
                today = new Date();
                today.setHours(0, 0, 0, 0);
                // Check if they're cancelling first and foremost
                if(user_member[0].IsRenewing){
                    // they are cancelling
                    [ results ] = await db.query(queries.cancel_membership, user_member[0].CustomerID);
                    if(!results || results.affectedRows == 0){
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Failed to cancel user\'s membership.'}));
                    }
                    await db.query(queries.new_history_log, [email, "Updated", "Membership", user_member[0].CustomerID, "User cancelled their renewing membership."])
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'User cancelled their membership successfully.' }));
                }
                // user was indeed a member before and is renewing now
                else if(user_member[0].DateOfExpiration == null || user_member[0].DateOfExpiration.toDateString() < today.toDateString()){
                    // if the user's membership expired or never renewed, "charge" them $100, set their new date to a year from today, add one to years of membership, etc.
                    expiration = new Date();
                    expiration.setFullYear(expiration.getFullYear() + 1);
                    expiration = expiration.getFullYear() + "-" + String(expiration.getMonth()+1).padStart(2, '0') + "-" + String(expiration.getDate()).padStart(2, '0');
                    [ results ] = await db.query(queries.renew_with_expire, [expiration, user_member[0].CustomerID]);
                    if(!results || results.affectedRows == 0){
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Failed to re-enable user\'s expired membership.'}));
                    }
                    await db.query(queries.new_history_log, [email, "Updated", "Membership", user_member[0].CustomerID, "User has re-enabled their membership (with charge)."])
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'User re-enabled their membership successfully.' }));
                }
                else{
                    // this user is re-enabling their subscription but has not had their previous one "expire" yet. Change nothing, do not charge them, do not add to years of membership
                    [ results ] = await db.query(queries.renew_without_expire, user_member[0].CustomerID);
                    if(!results || results.affectedRows == 0){
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Failed to renew user\'s membership.'}));
                    }
                    await db.query(queries.new_history_log, [email, "Updated", "Membership", user_member[0].CustomerID, "User has decided to re-enable auto-renewal on their membership (no charge)."])
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'User resubscribed without charge successfully.' }));
                }
            }
            else{
                // user's first time as a member, get their profile
                const [ new_member ] = await db.query(queries.get_user_profile, [email]);
                if(!new_member || new_member.length == 0){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Failed to find user in the system - subscription cancelled.'}));
                }
                expiration = new Date();
                expiration.setFullYear(expiration.getFullYear() + 1)
                expiration = expiration.getFullYear() + "-" + String(expiration.getMonth()+1).padStart(2, '0') + "-" + String(expiration.getDate()).padStart(2, '0');
                // add them to the members list, then make a log of it
                await db.query(queries.insert_new_member, [new_member[0].CustomerID, expiration]);
                await db.query(queries.new_history_log, [email, "Created", "Membership", new_member[0].CustomerID, "User by the name of " + new_member[0].FirstName + " " + new_member[0].LastName + " has subscribed for the very first time!"])
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'First time member successfully added!' }));
            }
        } catch (err) {
            console.error('Error with membership: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error with processing membership activity.' }));
        }
    });
}

module.exports = { getProfile, updateProfile, toggleMembership };