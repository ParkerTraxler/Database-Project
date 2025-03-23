const http = require('http');
const db = require('../db/db');

const getAllCollections = async (req, res) => {
    try {
        // SQL QUERY
        // Retrieve collections from database


        // END SQL QUERY

        // Return collections to the frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching all collections.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve collections.' }));
    }
}

const getCollection = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    // After the request is received, process it and send the response
    req('end', async () => {
        try {
            // SQL QUERY
            // Check if the collection exists

            // Retrieve collection from database
    
            // END SQL QUERY
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (err) {
            console.error('Error fetching collection.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve collections.' }));
        }
    });
}

const createCollection = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // After the request is received, process it and send the response
    req.on('end', async () => {

        // FILL IN: get fields from frontend

        try {
            // Ensure the necessary fields were provided (in this case, just collection name)

            // SQL QUERY

            // Check if the collection exists

            // SQL QUERY
            // Insert new collection into database

            // END SQL QUERY

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Collection created successfully.' }));

        } catch (err) {
            console.log('Error creating collection: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to create collection.' }));
        }
    });
}

const deleteCollection = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // After the request is received, process it and send the response
    req.on('end', async () => {
        try {
            // FILL IN: get fields from frontend

            // Ensure a name was provided
            if (!collectionName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({}))
            }

            // SQL QUERY
            // Delete collection in the database with the same name


            // END SQL QUERY

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'collection deleted successfully.' }));

        } catch (err) {
            console.error('Error creating collection: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to create collection.' }));
        }
    });
}

const updateCollection = (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // After the request is received, process it and send the response
    req.on('end', async () => {
        try {
            // FILL IN: get fields from frontend

            // If no collection name is provided, halt
            if (!collectionName) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide a name to update the collection.' }));
            }

            // SQL QUERY
            // Check that the collection exists
            
            // Create the query to update only provided fields.

            // END SQL QUERY
 
             // Return success message
             res.writeHead(200, { 'Content-Type': 'application/json' });
             return res.end(JSON.stringify({ message: 'Collection updated successfully.' }));

        } catch (err) {
            console.log('Error updating collection: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to update collection.' }));
        }
    });
}

module.exports = { getAllCollections, getCollection, createCollection, deleteCollection, updateCollection };