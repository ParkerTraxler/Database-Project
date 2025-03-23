const http = require('http');
const db = require('../db/db');

const getAllArtworks = async (req, res) => {
    try {
        // SQL QUERY
        // Retrieve artworks from database


        // END SQL QUERY

        // Return artworks to the frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching all artworks.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve artworks.' }));
    }
}

const getArtwork = async (req, res) => {
    
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    req('end', async () => {
        try {
            // SQL QUERY
            // Check if the artwork exists

            // Retrieve artwork from database
    
            // END SQL QUERY
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (err) {
            console.error('Error fetching artwork.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve artworks.' }));
        }
    });
}

const createArtwork = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {

        const { artName, artist, dateMade, artType, artVal, collection, artDesc, onDisplay } = JSON.parse(body);

        try {
            // Ensure artName and onDisplay were provided.
            if (!artName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Art name not provided.'}));
            } else if (!onDisplay) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Display status not provided.' }));
            }

            // SQL QUERY

            // Check if the artwork exists

            // SQL QUERY
            // Insert new artwork into database

            // END SQL QUERY

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Artwork created successfully.' }));

        } catch (err) {
            console.log('Error creating artwork: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to create artwork.' }));
        }
    });
}

const deleteArtwork = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { artName } = JSON.parse(body);

            // Ensure a name was provided
            if (!artName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({}))
            }

            // SQL QUERY
            // Delete artwork in the database with the same name


            // END SQL QUERY

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Artwork deleted successfully.' }));

        } catch (err) {
            console.error('Error creating artwork: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to create artwork.' }));
        }
    });
}

const updateArtwork = (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            // Store all the updated fields
            const {artName, artist, dateMade, artType, artVal, collection, artDesc, onDisplay } = JSON.parse(body);

            // If no art name is provided, halt
            if (!artName) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide an email to update the artwork.' }));
            }

            // SQL QUERY
            // Check that the art exists
            
            // Create the query to update only provided fields.

            // END SQL QUERY
 
             // Return success message
             res.writeHead(200, { 'Content-Type': 'application/json' });
             return res.end(JSON.stringify({ message: 'Artwork updated successfully.' }));

        } catch (err) {
            console.log('Error updating artwork: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to update artwork.' }));
        }
    });
}

module.exports = { getAllArtworks, getArtwork, createArtwork, deleteArtwork, updateArtwork };