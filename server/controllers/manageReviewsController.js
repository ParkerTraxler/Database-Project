const http = require('http');
const db = require('../db/db');

const getReviews = async (req, res) => {
    try {
        /* SQL QUERY */

        /* END SQL QUERY */

        // Return reviews to frontend
    } catch (err) {
        console.error('Error fetching reviews: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error fetching reviews.' }));
    }
}

const getReview = (req, res) => {
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

            // Check that the review exists

            // Return review to frontend
        } catch (err) {
            console.error('Error fetching review: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error fetching review.' }));
        }
    });
}

const createReview = (req, res) => {
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
            res.end(JSON.stringify({ message: 'Successfully created review.' }));
        } catch (err) {
            console.error('Error creating review.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error creating review.' }));
        }
    });
}

const deleteReview = (req, res) => {
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

            /* SQL QUERY */
            

            /* END SQL QUERY */

            // Return successful delete message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Review successfully deleted.' }));
        } catch (err) {
            console.error('Error deleting review.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error deleting review.' }));
        }
    });
}

const updateReview = (req, res) => {
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
            res.end(JSON.stringify({ message: 'Review successfully updated.' }));
        } catch (err) {
            console.error('Error updating review.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error updating review.' }));
        }
    });
}

module.exports = { getReview, getReviews, createReview, deleteReview, updateReview };