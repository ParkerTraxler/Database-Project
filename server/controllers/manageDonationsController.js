const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getDonations = async (req, res) => {
    try {
        // SQL QUERY - get all donations + name
        const [ rows ] = await db.query(queries.get_all_donations);

        // Return donations to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching donations: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error fetching donations.' }));
    }
}

const getDonationsForUser = async (req, res, email) => {
    try {
        // Confirm that a customer was supplied
        if (!email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Please supply which customer\'s donations to view' }))
        }
        // SQL QUERY - Return all the donations given by that user - MIGHT BE NONE.  
        const [ rows ] = await db.query(queries.get_specific_dons, [email]);

            // Return donations to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching donation: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error fetching donations for user.' }));
    }
}

const createDonation = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { email, donatedate, donateamt, donatedesc } = JSON.parse(body);
        try {
            if(!email){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Identity required for user making the donation (no email supplied)' }))
            }

            if(!donateamt){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Donation amount must be supplied' }))
            }

            if(!donatedate){
                donatedate = new Date();
                console.log("Automatically filled the current date as donation date for User with email: " + email);
            }
            // SQL QUERY - create the donation in the table assuming it all is good
            const [ results ] = await db.query(queries.add_new_donation, [email, donatedate, donateamt, donatedesc]);

            if(results.affectedRows == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Something has gone wrong inserting the donation into the table.'}));
            }

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Successfully created donation.' }));
        } catch (err) {
            console.error('Error creating donation: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error creating donation.' }));
        }
    });
}

/* DONATIONS SHOULD NOT BE EDITABLE 
const updateDonation = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response 
    req.on('end', async () => {
        try {
            // Get necessary fields from the request

            // Check that at least one (or some?) fields were provided


            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Donation successfully updated.' }));
        } catch (err) {
            console.error('Error updating donation.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error updating donation.' }));
        }
    });
}

DONATIONS SHOULD NOT BE DELETABLE I think
const deleteDonation = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response
    req.on('end', async () => {
        try {
            // Store the necessary field to delete the donation

            // Check that the necessary field was provided, return error if not

            // Return successful delete message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Donation successfully deleted.' }));
        } catch (err) {
            console.error('Error deleting donation.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error deleting donation.' }));
        }
    });
}
*/

module.exports = { getDonations, getDonationsForUser, createDonation };