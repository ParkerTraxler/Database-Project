const http = require('http');
const db = require('../db/db');

const getExhibits = async (req, res) => {
    try {
        /* SQL QUERY */
        // Get all exhibits, notice the list returned is called 'rows' in the last line of the try statement

        /* END SQL QUERY */

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching exhibits.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error fetching exhibits.'}));
    }
}

const getExhibit = async (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // Process the request once it is received, send response
    req.on('end', () => {
        try {
            // Store necessary field

            // Check that an id/name/etc. was provided

            /* SQL QUERY */
            
            // Get the exhibit and check if it exists

            /* END SQL QUERY */

            // Return the exhibit
        } catch (err) {
            console.error('Error fetching exhibit.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error fetching exhibit.' }));
        }
    });
}

const createExhibit = async (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            // Store necessary fields from frontend to create the entity.

            /* SQL QUERY */

            // Check if the exhibit already exists

            // If not, create the database entry

            /* END SQL QUERY */

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Successfully created exhibit.' }));
        } catch (err) {
            console.error('Error creating exhibit.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error creating exhibit.' }));
        }
    });
}

const deleteExhibit = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response
    req.on('end', () => {
        try {
            // Store the necessary field to delete the exhibit

            // Check that the necessary field was provided, return error if not

            /* SQL QUERY */


            /* END SQL QUERY */

            // Return successful delete message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Exhibit successfully deleted.' }));
        } catch (err) {
            console.error('Error deleting exhibit.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error deleting exhibit.' }));
        }
    });
}

const updateExhibit = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response 
    req.on('end', () => {
        try {
            // Get necessary fields from the request

            // Check that at least one (or some?) fields were provided

            /* SQL QUERY */

            // Ensure the exhibit exists in the database before updating, return error if not

            // Update necessary exhibit attributes

            /* END SQL QUERY */

            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Exhibit successfuly updated.' }));
        } catch (err) {
            console.error('Error updating exhibit.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error deleting exhibit.' }));
        }
    });
}