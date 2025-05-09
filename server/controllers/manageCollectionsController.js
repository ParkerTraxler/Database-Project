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

const getSpecificCollection = async(req, res, title) => {
    try {
        if(!title){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'No title supplied to search for'}));
        }

        console.log(title);

        // SQL QUERY - Retrieve collection from database
        const [rows] = await db.query(queries.get_specific_collection, [title]);

        console.log(rows);

        // may return empty if exhibit hsa no collections in it
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows[0]));
    } catch (err) {
        console.error('Error fetching collection: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve specific collection.' }));
    }
}

const getExhibitCollections = async (req, res, exhibitID) => {
    try {
        if(!exhibitID){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'No exhibit ID supplied to search for'}));
        }
        if(exhibitID == "null"){
            exhibitID = null
        }
        // SQL QUERY - Retrieve collection from database
        const [rows] = await db.query(queries.get_exhibit_collections, [exhibitID, exhibitID, exhibitID]);

        // may return empty if exhibit hsa no collections in it
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching collection: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve collections for specific exhibit.' }));
    }
}

const createCollection = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { title, collectdesc, collectpic, exhibitid, email } = JSON.parse(body);
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

            await db.query(queries.new_history_log, [email, "Created", "Collections", title, "A new collection was added to the museum."]);

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
            const { title, email } = JSON.parse(body);

            // Ensure a name was provided
            if (!title) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({error: 'No title provided to delete collection'}))
            }

            // SQL QUERY - Delete collection in the database with the same name
            const result = await db.query(queries.mark_collection_delete, [title]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to delete the entry. Is it already deleted?' }));
            }

            // SQL Query - Assign all art that belonged to previous collection to null
            const results2 = await db.query(queries.reset_collection_art, [title]);
            
            if(results2.affectedRows > 0){
                console.log(results2.affectedRows + " artworks have been set to null.");
            }

            await db.query(queries.new_history_log, [email, "Deleted", "Collections", title, "A collection has been removed from the museum entirely."])

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
            var { title, collectdesc, collectpic, exhibitid, email } = JSON.parse(body);

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

            await db.query(queries.new_history_log, [email, "Updated", "Collections", title, "A collection by the name of \"" + title + "\" belonging to exhibit ID " + exhibitid + " was updated."] );
 
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

module.exports = { getAllCollections, getSpecificCollection, getExhibitCollections, createCollection, deleteCollection, updateCollection };