const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getTransactionReport = async(req, res) => {
    // This function gets the whole report, front-end should handle filtering I believe
    try {
        // SQL Query - return a report to the front-end including all sales transactions
        const [ transaction_report ] = await db.query(queries.all_sales_report);

        // TO DO - whenever report generated, log the email of the manager who got the report 

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(transaction_report));
    } catch (err) {
        console.error('Error fetching report: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching transaction report.' }));
    }
}

const ticketPurchase = async(req, res) =>{
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { ticketArray, email, datepurchased } = JSON.parse(body);
        var itemIDs = [];
        var send_back = [];
        try{
            for(let x = 0; x < 4; x++){
                if(ticketArray[x] > 0){
                    itemIDs.push(x+1);
                }
                else{
                    send_back[x] = 0;
                }
            }
    
            if(itemIDs.length == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'This transaction includes no tickets to be purchased'}));
            }
    
            if(!email){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Customer not authorized / no email given.'}));
            }
    
            if(!datepurchased){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Must supply a date of purchase.'}));
            }
    
            for(let ItemID of itemIDs){
                var [ results ] = await db.query(queries.new_transaction, [ItemID, email, parseInt(ticketArray[ItemID-1]), datepurchased]);
                var [ get_price ] = await db.query(queries.specific_transaction, [results.insertId])
                send_back[ItemID-1] = get_price[0].FinalPrice;
                await db.query(queries.new_history_log, [email, "Created", "Sales", results.insertId, "A customer has purchased tickets. See transaction report for more details."]);
            }
    
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(send_back));
        } catch (err) {
            console.error('Error processing ticket purchase: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to purchase tickets.' }));
        }
    });
}

const processTransaction = async(req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        var { itemids, email, quantities, datepurchased } = JSON.parse(body);
        try {
            if(itemids.length <= 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'No items in cart detected.'}));
            }

            if(!email){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Customer not authorized / no email given.'}));
            }

            if(quantities.length <= 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Not enough quantities set.'}));
            }

            if(quantities.length != itemids.length){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Inequal number of quantities to items being purchased.'}));
            }

            if(!datepurchased){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Must supply a date of purchase.'}));
            }
            // SQL Query - new transaction added to table. finalprice is auto-calc'd if null/blank
            
            let faileditemadditions = [];
            
            for(let x = 0; x < itemids.length; x++){
                let itemid = itemids[x];
                let quantity = quantities[x];

                if(quantity <= 0){
                    faileditemadditions.push(itemid);
                    continue;
                }

                var [ result ] = await db.query(queries.new_transaction, [itemid, email, quantity, datepurchased]);

                if(!result || result.affectedRows == 0){
                    console.log("Failed to process transaction for ID: " + itemid);
                    faileditemadditions.push(itemid);
                }
                else{
                    await db.query(queries.new_history_log, [email, "Created", "Sales", result.insertId, "New transaction for an item has been processed. See transaction report for more details."]);
                }
            }

            if(faileditemadditions.length > 0){
                let failedidlist = faileditemadditions.join(', ')
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'An error occurred, the following transactions could not be added: ' + failedidlist}));
            }

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'New transactions added.' }));
        } catch (err) {
            console.error('Error processing transaction: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to attempt adding transactions.' }));
        }
    });
}

module.exports = { processTransaction, ticketPurchase, getTransactionReport};