const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getReviews = async (req, res) => {
    try {
        // SQL QUERY - get all reviews + name
        const [ rows ] = await db.query(queries.get_all_reviews);

        // Return reviews to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching reviews: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching reviews.' }));
    }
}

const getUserReview = async (req, res, email) => {
    try {
        // SQL Query - Get specific user's review, if it exists. Might return null.
        const [ rows ] = await db.query(queries.get_user_review, [email]);

        // Return review to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows[0]));
        } catch (err) {
            console.error('Error fetching review: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error fetching review.' }));
        }
}

const createReview = (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try{
            const { email, starcount, reviewdesc } = JSON.parse(body);
            
            if(!email || !starcount ){
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'Missing required information for reviews.' }));
            }

            let reviewdate = new Date();
            reviewdate = reviewdate.getFullYear() + "-" + String(reviewdate.getMonth()+1).padStart(2, '0') + "-" + String(reviewdate.getDate()).padStart(2, '0');

            //  SQL QUERY - Create a new review
            const [ result ] = await db.query(queries.new_user_review, [email, starcount, reviewdesc, reviewdate]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not accept entry. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Created", "Reviews", result.insertId, "A customer has left a new review"])

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Successfully created review.' }));
        } catch (err) {
            console.error('Error creating review: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error creating review.' }));
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
            var { email, starcount, reviewdesc } = JSON.parse(body);
            
            if(!email){
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'Missing required information (email) for editing reviews.' }));
            }

            // SQL QUERY - Update an employee's information, by first checking if they exist
            const [ rows ] = await db.query(queries.get_user_review, [email]);

            if(rows.length == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'User does not have a review to edit.'}));
            }

            if(starcount == null || starcount == ""){
                starcount = rows[0].StarCount;
            }

            if(reviewdesc == null || reviewdesc == ""){
                reviewdesc = rows[0].ReviewDesc;
            }

            let reviewdate = new Date();
            reviewdate = reviewdate.getFullYear() + "-" + String(reviewdate.getMonth()+1).padStart(2, '0') + "-" + String(reviewdate.getDate()).padStart(2, '0');

            //  SQL QUERY - Create a new review
            const [ result ] = await db.query(queries.update_review, [starcount, reviewdesc, reviewdate, email]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update the review. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Updated", "Reviews", rows[0].CustomerID, "A customer has updated their review."])

            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Review successfully updated.' }));
        } catch (err) {
            console.error('Error updating review: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error updating review.' }));
        }
    });
}

module.exports = {getReviews, getUserReview, createReview, updateReview };