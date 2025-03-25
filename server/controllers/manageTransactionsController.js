const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getTransactionReport = (req, res) => {
    // This function gets the whole report, front-end should handle filtering I believe
    req.on('end', async () => {
        try {
            // SQL Query - return a report to the front-end including all sales transactions
            const [ transaction_report ] = await db.query(queries.all_sales_report);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(transaction_report));
        } catch (err) {
            console.error('Error fetching report: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error fetching transaction report.' }));
        }
    });
}

const processTransaction = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        var { itemid, email, quantity, finalprice, datepurchased } = JSON.parse(body);
        try {
            if(!itemid){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'No item in cart detected.'}));
            }

            if(!email){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Customer not authorized / no email given.'}));
            }

            if(!quantity || quantity <= 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Quantity is invalid number.'}));
            }

            if(finalprice == "" || !finalprice){
                finalprice = null;
            }

            if(!datepurchased){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Must supply a date of purchase.'}));
            }
            // SQL Query - new transaction added to table. finalprice is auto-calc'd if null/blank
            const { result } = await db.query(queries.new_transaction, [itemid, email, quantity, finalprice, datepurchased]);

            if(!result || result.affectedRows == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'An error occurred after adding the transaction.'}));
            }

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'New transaction added.' }));
        } catch (err) {
            console.error('Error creating review.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to add transaction.' }));
        }
    });
}

module.exports = { getTransactionReport, processTransaction };