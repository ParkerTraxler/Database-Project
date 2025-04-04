const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

// For this entire file, we assume tickets will always occupy the first 4 item IDs
// That is, ItemIDs 1-4 will not be deletable and will display on a separate 

const createItem = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { itemname, itemprice, amountinstock, email } = JSON.parse(body);
        try {
            if(!itemname){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Please supply a name for the new item'}));
             }

             if(itemname.toLowerCase().includes("ticket")){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Reserved word detected - please refrain from naming items with the word ticket.'}));
             }

            // SQL Query - Create a new item
             const [ result ] = await db.query(queries.insert_new_item, [itemname, itemprice, amountinstock]);

            if(!result || result.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not input new item. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Created", "Items", result.insertId, "A new item with name " + itemname + " has been added to the Museum Gift Shop"]);

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Successfully created item.' }));
        } catch (err) {
            console.error('Error creating item: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error creating item.' }));
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
        const { itemid, email } = JSON.parse(body);
        try {
            if(!itemid){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Please supply an item ID for deletion'}));  
            }

            if([1, 2, 3, 4].includes(itemid)){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Attempted deletion on ticket is disallowed.'}));                  
            }
            // SQL QUERY - check to see if itemid is valid, check to see if it's a ticket, etc.
            const [ result ] = await db.query(queries.delete_item, [itemid]);

            if(!result || result.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not delete the item. Is it already deleted?' }));
            }

            await db.query(queries.new_history_log, [email, "Deleted", "Items", itemid, "An item has been deleted from the museum."]);

            // Return successful delete message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Item successfully deleted.' }));
        } catch (err) {
            console.error('Error deleting item: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error deleting item.' }));
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
        var { itemid, itemname, itemprice, giftshopname, email } = JSON.parse(body);
        try {
            if(!itemid){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Please supply an item ID for updating'}));  
            }

            // get the item from the DB / confirm it exists
            const [ curr_item ] = await db.query(queries.get_a_normal_item, [itemid]);


            // SQL QUERY - update the item 
            if(itemname == null || itemname == ""){
                itemname = curr_item[0].ItemName;
            }

            if(itemprice == null || itemprice == ""){
                itemprice = curr_item[0].ItemPrice;
            }

            if(giftshopname == null || giftshopname == ""){
                giftshopname = curr_item[0].GiftShopName;
            }

            const [ results ] = await db.query(queries.update_item, [itemname, itemprice, giftshopname, itemid]);
            if(!results || results.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update item. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Updated", "Items", itemid, "An item by the name of " + itemname + " has been updated."])

            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Item successfully updated.' }));
        } catch (err) {
            console.error('Error updating item: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error updating item.' }));
        }
    });
}

const updateTicket = (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // Process the request once it is received, send response
    req.on('end', async () => {
        var { itemid, itemprice, email } = JSON.parse(body);
        try {
            if(!itemid){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Invalid item ID.'}));
            }

            if(!([1, 2, 3, 4].includes(itemid))){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Item attempting to be updated is not a ticket.'}));
            }

            // get the item from the DB / confirm it exists
            const [ curr_item ] = await db.query(queries.get_specific_ticket, [itemid]);


            // SQL QUERY - update the item
            itemname = curr_item[0].ItemName;

            if(itemprice == null || itemprice == ""){
                itemprice = curr_item[0].ItemPrice;
            }

            giftshopname = null;

            const [ results ] = await db.query(queries.update_item, [itemname, itemprice, giftshopname, itemid]);
            if(!results || results.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update ticket. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Updated", "Items", itemid, "Ticket (Category: " + itemname + ") has had its price updated."])

            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Ticket successfully updated.' }));
        } catch (err) {
            console.error('Error updating ticket: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error updating ticket.' }));
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
        const { itemid, amounttoadd, email } = JSON.parse(body);
        try {
            if(!itemid){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Please supply an item ID for restocking!'}));  
            }

            if(!amounttoadd){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Please specify how much to increase the stock by!'}));  
            }
            // SQL Query - update the amount of an item in stock. it's an addition so, add it to the previous number
            const [ results ] = await db.query(queries.restock_item, [amounttoadd, itemid]);

            if(!results || results.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to restock item. Has it been deleted?' }));
            }

            await db.query(queries.new_history_log, [email, "Updated", "Items", itemid, "An item has been restocked. Amount added = " + amounttoadd + "."]);

            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Item quantity successfully updated.' }));
        } catch (err) {
            console.error('Error updating item quantity.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error updating item quantity.' }));
        }
    });
}

// get all non-ticket items
const getItems = async(req, res) =>{
    try {
        // SQL Query - get all non-ticket items
        var [ result ] = await db.query(queries.get_all_normal_items);

        // Convert BLOB -> Base64 (for each item)  
        let imageBase64;
        for (let i = 0; i < result.length; i++) {
            imageBase64 = Buffer.from(result[i].ItemPic).toString('base64');
            result[i].ItemPic = `data:image/jpeg;base64,${imageBase64}`;
        }

        // Return success message
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(result));
    } catch (err) {
        console.error('Error retrieving all items: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error retrieving all items' }));
    }
}

const getItem = async(req, res, itemID) =>{
    // Process the request once it is received, send response 
    try {
        if(!itemID){
            res.writeHead(400, { 'Content-Type':  'application/json' });
            return res.end(JSON.stringify({ error: 'No item ID supplied to search for' }));
        }

        if([1, 2, 3, 4].includes(itemID)){
            res.writeHead(400, { 'Content-Type':  'application/json' });
            return res.end(JSON.stringify({ error: 'It seems you\'re trying to get a ticket. Did you mean getTicket?' }));
        }

        // SQL QUERY - Get item itself if checks are passed
        var [ result ] = await db.query(queries.get_a_normal_item, itemID);

        if(!result.length){
            res.writeHead(400, { 'Content-Type':  'application/json' });
            return res.end(JSON.stringify({ error: 'No item by that ID found! Was it deleted?' }));
        }

        // Convert BLOB -> Base64 (for each collection)
        let imageBase64 = Buffer.from(result[0].ItemPic).toString('base64');
        result[0].ItemPic = `data:image/jpeg;base64,${imageBase64}`;

        // Return success message
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(result[0]));
    } catch (err) {
        console.error('Error retrieving item: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error retrieving item.' }));
    }
}

const getTickets = async (req, res) => {
    try {
         // SQL Query - get all ticket_items
        const [ result ] = await db.query(queries.get_all_tickets);

        // Return success message
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(result));
    } catch (err) {
        console.error('Error retrieving tickets: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error retrieving tickets' }));
    }
}

const getTicket =  async(req, res, itemID) => {
    // Process the request once it is received, send response 
    try {
        if(!itemID){
            res.writeHead(400, { 'Content-Type':  'application/json' });
            return res.end(JSON.stringify({ error: 'No ticket ID supplied to search for' }));
        }

        if(!([1, 2, 3, 4].includes(itemid))){
            res.writeHead(400, { 'Content-Type':  'application/json' });
            return res.end(JSON.stringify({ error: 'Item being asked for is not a ticket' }));
        }

        // SQL QUERY - Get ticket itself if checks are passed
        const [ result ] = await db.query(queries.get_specific_ticket, itemID);

        if(result.affectedRows == 0){
            res.writeHead(400, { 'Content-Type':  'application/json' });
            return res.end(JSON.stringify({ error: 'No ticket by that ID found!' }));
        }

        // Return success message
        res.writeHead(204, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(JSON.stringify(result[0])));
    } catch (err) {
        console.error('Error updating item quantity.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error updating item quantity.' }));
    }
}

module.exports = { createItem, deleteItem, updateItem, updateTicket, updateItemQuantity, getItems, getItem, getTickets, getTicket };