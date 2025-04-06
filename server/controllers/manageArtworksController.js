const http = require('http');
const queries = require('../querylist.js');
const db = require('../db/db');

const getAllArtworks = async (req, res) => {
    try {
        // SQL Query - Retrieve artworks from database
        const [rows] = await db.query(queries.get_artwork_query);
        
        // Return artworks to the frontend
        // ASSUMPTION - Return all information on the artworks - can be changed later
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching all artworks: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve artworks.' }));
    }
}

const getCollectionArtwork = async (req, res, title) => {
    try {
        if(!title){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({error: 'No title provided for collection to retrieve'}))
        }

        // SQL Query - Return ALL artwork part of a collection
        // ASSUMPTION: We return ALL of the artwork information - frontend can decide what to show
        const [rows] = await db.query(queries.get_collection_art, [title]);

        // can return 0 artwork, just as a worry
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching artwork: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve artworks.' }));
    }
}

const createArtwork = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { artName, artist, dateMade, artType, artVal, collection, artDesc, artPic, onDisplay, email} = JSON.parse(body);

        try {
            // Ensure artName and onDisplay were provided.
            if (!artName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Art name not provided.'}));
            } 
            if (!onDisplay) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Display status not provided.' }));
            }

            // SQL QUERY - Check if the artwork exists. If yes, prompt. If no, add it
            // ASSUMPTION - Do not outright refuse artwork if enough "pieces" match, but perhaps prompt?
            const [rows] = await db.query(queries.get_name_specific_art, [artName]);
            if(rows.length && rows[0].Artist == artist & rows[0].DateMade == dateMade){
                // this is enough information to prompt that maybe this piece already exists. Note: if the piece was deleted and is being re-added, then allow for that.
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'This art piece seems to already exist!' }));
            }
            
            if(dateMade == ""){
                dateMade = null;
            }

            // SQL Query - Insert new artwork into database
            const [ result ] = await db.query(queries.insert_art_piece, [artName, artist, dateMade, artType, artVal, collection, artDesc, artPic, onDisplay]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not accept entry. Invalid input?' }));
            }

            // add to the history log
            await db.query(queries.new_history_log, [email, "Created", "Artworks", result.insertId, "A new artwork has been added to the museum."])

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Artwork created successfully.' }));

        } catch (err) {
            console.log('Error creating artwork: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to create artwork.' }));
        }
    });
}

const deleteArtwork = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { artID, email } = JSON.parse(body);

            // Ensure an ID was provided
            if (!artID) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Please select an art piece to delete' }))
            }
            // SQL QUERY - Delete artwork in the database with the same name (change to ID later?)
            const [ result ] = await db.query(queries.mark_art_for_deletion, [artID]);

            if (!result || result.rowCount == 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to delete art piece into the database.' }))
            }

            await db.query(queries.new_history_log, [email, "Deleted", "Artworks", artID, "An artwork has been removed from the museum entirely."])

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Artwork deleted successfully.' }));

        } catch (err) {
            console.error('Error creating artwork: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to delete artwork.' }));
        }
    });
}

const updateArtwork = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            // Store all the updated fields
            var {artID, artName, artist, dateMade, artType, artVal, collection, artDesc, artPic, onDisplay, email} = JSON.parse(body);

            // If no art ID is provided, halt
            if (!artID) {
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'No art piece provided to be edited' }));
            }

            // SQL QUERY - Update art, if it exists. Filter art by ID. Fill nulls in with what was already in the DB
            const [ rows ] = await db.query(queries.get_specific_art, [artID]);
            if(!rows.length){
                res.writeHead(400, { 'Content-Type':  'application/json' });
                return res.end(JSON.stringify({ error: 'No art piece found - has it been deleted?' }));
            }

            if(artName == null || artName == ""){
                artName = rows[0].ArtName; 
            }

            if(artist == null || artist == ""){
                artist = rows[0].Artist; 
            }

            if(dateMade == null || dateMade == ""){
                dateMade = rows[0].DateMade; 
            }

            if(artType == null || artType == ""){
                artType = rows[0].ArtType; 
            }

            if(artVal == null || artVal == ""){
                artVal = rows[0].ArtVal; 
            }

            if(collection == null || collection == ""){
                collection = rows[0].Collection; 
            }

            if(artDesc == null || artDesc == ""){
                artDesc = rows[0].ArtDesc; 
            }

            if(artPic == null || artPic == ""){
                artPic = rows[0].ArtPic; 
            }

            if(onDisplay == null || onDisplay == ""){
                onDisplay = rows[0].OnDisplay; 
            }

            // okay that's a lot of if statements but now we can do the update - result not needed since earlier query
            const result = await db.query(queries.update_art_piece, [artName, artist, dateMade, artType, artVal, collection, artDesc, artPic, onDisplay, artID]);
 
            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
            }

            await db.query(queries.new_history_log, [email, "Updated", "Artworks", artID, "Artwork by the name of \"" + artName + "\" belonging to collection \"" + collection + "\" was updated."] );
             // Return success message
             res.writeHead(200, { 'Content-Type': 'application/json' });
             return res.end(JSON.stringify({ message: 'Artwork updated successfully.' }));

        } catch (err) {
            console.log('Error updating artwork: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to update artwork.' }));
        }
    });
}

module.exports = { getAllArtworks, getCollectionArtwork, createArtwork, deleteArtwork, updateArtwork };