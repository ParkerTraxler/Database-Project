const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getAllCollections = async (req, res) => {
    try {
        // SQL QUERY - Retrieve collections from database
        const [rows] = await db.query(queries.get_collections_query);

        // Return collections to the frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching all collections.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve collections.' }));
    }
}

const getExhibitCollections = async (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    req('end', async () => {
        const { exhibitID } = JSON.parse(body);
        try {
            if(!exhibitID){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'No exhibit ID supplied to search for'}));
            }
            // SQL QUERY - Retrieve collection from database
            const [rows] = await db.query(queries.get_exhibit_collections, [exhibitID]);

            // may return empty if exhibit hsa no collections in it
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (err) {
            console.error('Error fetching collection: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve collections for specific exhibit.' }));
        }
    });
}

const createCollection = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { title, collectdesc, collectpic, exhibitid } = JSON.parse(body);
        try {
            if(!title){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Collections are required to have a title.'}));
            }

            const [rows] = await db.query(queries.get_specific_collection, [title]);
            if(rows.length){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'A collection already exists by that title!'}));
            }
            // SQL QUERY - input new collection assuming all above pass

            const result = await db.query(queries.insert_new_collection, [title, collectdesc, collectpic, exhibitid]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not accept entry. Invalid input?' }));
            }

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

    req.on('end', async () => {
        try {
            const { title } = JSON.parse(body);

            // Ensure a name was provided
            if (!title) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({error: 'No title provided to delete collection'}))
            }

            // SQL QUERY - Delete collection in the database with the same name
            const result = db.query(queries.mark_collection_delete, [title]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to delete the entry. Is it already deleted?' }));
            }

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Collection deleted successfully.' }));

        } catch (err) {
            console.error('Error creating collection: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to delete collection.' }));
        }
    });
}

const updateCollection = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            var { title, collectdesc, collectpic, exhibitid } = JSON.parse(body);

            // If no collection name is provided, halt
            if (!title) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'You must provide a name to update the collection.' }));
            }
            // check that an exhibit even exists to be updated
            const [ curr_col ] = await db.query(queries.get_specific_collection, [title]);
            if(!curr_col || curr_col.length == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'No collection found to be updated. Did you mean insert?'}));
            }

            if(collectdesc == null || collectdesc == ""){
                collectdesc = curr_col[0].CollectDesc;
            }

            if(collectpic == null || collectpic == ""){
                collectpic = curr_col[0].CollectPic;
            }

            console.log("New collectpic value " + collectpic);

            if(exhibitid == null || exhibitid == ""){
                exhibitid = curr_col[0].ExhibitID;
            }

            // SQL QUERY - Create the query to update provided fields
            const result = await db.query(queries.update_collection_query, [collectdesc, collectpic, exhibitid, title]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
            }
 
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

module.exports = { getAllCollections, getExhibitCollections, createCollection, deleteCollection, updateCollection };