const http = require('http');
const db = require('../db/db');

const getDonations = async (req, res) => {
    try {
        /* SQL QUERY */

        /* END SQL QUERY */

        // Return donations to frontend
    } catch (err) {
        console.error('Error fetching donations: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error fetching donations.' }));
    }
}

const getDonation = (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // Process request and return response
    req.on('end', async () => {
        try {
            // Get field from the frontend
            
            // Check that the field was provided 

            /* SQL QUERY */

            /* END SQL QUERY */

            // Check that the donation exists

            // Return donation to frontend
        } catch (err) {
            console.error('Error fetching donation: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error fetching donation.' }));
        }
    });
}

const createDonation = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            // Store necessary fields from frontend to create the entity.

            /* SQL QUERY */

            /* END SQL QUERY */

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Successfully created donation.' }));
        } catch (err) {
            console.error('Error creating donation.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error creating donation.' }));
        }
    });
}

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

            /* SQL QUERY */
            

            /* END SQL QUERY */

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

            /* SQL QUERY */

            /* END SQL QUERY */

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

module.exports = { getDonations, getDonation, createDonation, deleteDonation, updateDonation };