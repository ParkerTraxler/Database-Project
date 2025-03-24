const http = require('http');
const db = require('../db/db');

const createItem = (req, res) => {
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
            res.end(JSON.stringify({ message: 'Successfully created item.' }));
        } catch (err) {
            console.error('Error creating item.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error creating item.' }));
        }
    });
}

const deleteItem = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response
    req.on('end', async () => {
        try {
            // Store the necessary field to delete the review

            // Check that the necessary field was provided, return error if not

            // Check if the item was a ticket

            /* SQL QUERY */

            /* END SQL QUERY */

            // Return successful delete message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item successfully deleted.' }));
        } catch (err) {
            console.error('Error deleting review.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error deleting item.' }));
        }
    });
}

const updateItem = (req, res) => {
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
            res.end(JSON.stringify({ message: 'Item successfully updated.' }));
        } catch (err) {
            console.error('Error updating item.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error updating item.' }));
        }
    });
}

const updateItemQuantity = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response 
    req.on('end', async () => {
        try {
            // Get item and item update value fromt frontend

            // Check  that both fields were provided

            /* SQL QUERY */

            /* END SQL QUERY */

            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item quantity successfully updated.' }));
        } catch (err) {
            console.error('Error updating item quantity.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error updating item quantity.' }));
        }
    });
}

const getTickets = async (req, res) => {
    try {
        /* SQL QUERY */

        /* END SQL QUERY */

        // Return tickets
    } catch (err) {
        console.error('Error getting tickets.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error getting tickets.' }));
    }
}

const getTicket = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    // Process the request once it is received, send response 
    req.on('end', async () => {
        try {
            // Get field from request

            // Check that the field was provided

            /* SQL QUERY */

            // Get ticket from database

            // Check that the ticket exists

            /* SQL QUERY */

            // Return ticket to the frontend
        } catch (err) {
            console.error('Error updating item quantity.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error updating item quantity.' }));
        }
    });
}

module.exports = { createItem, deleteItem, updateItem, updateItemQuantity, getTickets, getTicket };