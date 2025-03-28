const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getReviews = async (req, res) => {
    try {
        // SQL QUERY - get all donations + name
        const [ rows ] = await db.query(queries.get_all_reviews);

        // Return donations to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching donations: ', err);
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

            let reviewdate = Date();
            reviewdate = reviewdate.getFullYear() + "-" + reviewdate.getMonth() + "-" + reviewdate.getDate();

            //  SQL QUERY - Create a new review
            const [ result ] = await db.query(queries.new_user_review, [email, starcount, reviewdesc, reviewdate]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not accept entry. Invalid input?' }));
            }

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Successfully created review.' }));
        } catch (err) {
            console.error('Error creating review.');
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
            const [rows] = await db.query(queries.get_user_review, [email]);

            if(rows.length == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'User does not have a review to edit.'}));
            }

            if(starcount == null || starcount == ""){
                starcount = curr_col[0].StarCount;
            }

            if(reviewdesc == null || reviewdesc == ""){
                reviewdesc = curr_col[0].ReviewDesc;
            }

            let reviewdate = Date();
            reviewdate = reviewdate.getFullYear() + "-" + reviewdate.getMonth() + "-" + reviewdate.getDate();

            //  SQL QUERY - Create a new review
            const [ result ] = await db.query(queries.update_review [starcount, reviewdesc, reviewdate, email]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update the review. Invalid input?' }));
            }

            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Review successfully updated.' }));
        } catch (err) {
            console.error('Error updating review.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error updating review.' }));
        }
    });
}

module.exports = {getReviews, getUserReview, createReview, updateReview };