const http = require('http');
const db = require('../db/db');

const getAllEvents = async (req, res) => {
    try {
        // SQL QUERY
        // Retrieve events from database


        // END SQL QUERY

        // Return events to the frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching all events.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve events.' }));
    }
}

const getEvent = async (req, res) => {
    
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        // FILL IN: get field from frontend
        
        try {
            // SQL QUERY
            // Check if the event exists

            // Retrieve event from database
    
            // END SQL QUERY
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (err) {
            console.error('Error fetching event.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve events.' }));
        }
    });
}

const createEvent = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {

        // FILL IN: get fields from frontend

        try {
            // Ensure event name was provided.

            // SQL QUERY

            // Check if the event exists

            // SQL QUERY
            // Insert new event into database

            // END SQL QUERY

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'event created successfully.' }));

        } catch (err) {
            console.log('Error creating event: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to create event.' }));
        }
    });
}

const deleteEvent = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            // FILL IN: get fields from frontend

            // Ensure an event name was provided
            if (!eventName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({}))
            }

            // SQL QUERY
            // Delete event in the database with the same name


            // END SQL QUERY

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Event deleted successfully.' }));

        } catch (err) {
            console.error('Error creating event: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to create event.' }));
        }
    });
}

const updateEvent = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            // FILL IN: get fields from frontend

            // If no event name is provided, halt
            if (!eventName) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to provide an event name.' }));
            }

            // SQL QUERY
            // Check that the event exists
            
            // Create the query to update only provided fields.

            // END SQL QUERY
 
            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Event updated successfully.' }));

        } catch (err) {
            console.log('Error updating event: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to update event.' }));
        }
    });
}

module.exports = { getAllEvents, getEvent, createEvent, deleteEvent, updateEvent };