const http = require('http');
const queries = require('../querylist.js');
const db = require('../db/db');

const getExhibits = async (req, res) => {
    try {
        // SQL QUERY  - Get all exhibits, yippee!
        var [ rows ] = await db.query(queries.get_all_exhibits);

        // Convert BLOB -> Base64 (for each collection)      
        // let imageBase64;
        // for (let i = 0; i < rows.length; i++) {
        //     imageBase64 = Buffer.from(rows[i].ExhibitPic).toString('base64');
        //     rows[i].ExhibitPic = `data:image/jpeg;base64,${imageBase64}`;
        // }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching exhibits.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching exhibits.'}));
    }
}

// Get an exhibit, can be normal or special - return all the information either way
const getExhibit = async (req, res, exhibitid) => {
    try {
        if(!exhibitid){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'No Exhibit ID provided to search for.'}));
        }

        // SQL Query - Get the exhibit (if it is exists)
        var [ row ] = await db.query(queries.get_specific_exhibit, exhibitid);

        if(!row.length) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'Specified exhibit does not exist! Was it created successfully?'}));
        }
        // Convert BLOB -> Base64 (for each collection)
        // let imageBase64 = Buffer.from(row[0].ExhibitPic).toString('base64');
        // row[0].ExhibitPic = `data:image/jpeg;base64,${imageBase64}`;

        // Return the exhibit
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(row[0]));
    } catch (err) {
        console.error('Error fetching exhibit.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching exhibit.' }));
    }
}

// allow creation of an exhibit, special or otherwise. 
const createExhibit = async (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async() => {
        const { exhibitname, exhibitdesc, exhibitpic, startdate, enddate, fee, isSpecial, managerEmail } = JSON.parse(body);
        try {
             // SQL Query - Inserting a new exhibit. If is special, insert it into that table too.
             if(!exhibitname){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Exhibits are required to have a name.'}));
             }
             if(isSpecial && !startdate){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Special exhibits are required to have a starting date.'}));
             }

             // no matter if special or not, insert into base table
             const [ results ] = await db.query(queries.create_exhibit, [exhibitname, exhibitdesc, exhibitpic]);
             if(!results || results.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not input exhibit. Invalid input?' }));
            }

            if(isSpecial){
                const exhibitID = results.insertId;
                const [ special_results ] = await db.query(queries.create_special_exhibit, [exhibitID, startdate, enddate, fee]);
                if(!special_results || special_results.affectedRows == 0){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Database could not input special exhibit. Invalid input?' }));
                }
                await db.query(queries.new_history_log, [managerEmail, "Created", "SpecialExhibits", results.insertId, "A new special exhibit has been created."]);
            }
            
            else{
                await db.query(queries.new_history_log, [managerEmail, "Created", "Exhibits", results.insertId, "A new normal exhibit has been created."]);
            }

            // Return success message
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Successfully created exhibit.' }));
        } catch (err) {
            console.error('Error creating exhibit: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error creating exhibit.' }));
        }
    });
}

const updateExhibit = async (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response 
    req.on('end', async() => {
        var { exhibitid, exhibitname, exhibitdesc, exhibitpic, startdate, enddate, fee, managerEmail } = JSON.parse(body);
        try {
            // Check that fields were provided
            if(!exhibitid){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'No Exhibit ID provided to update'}));
            }

            // SQL Query - check to see if exhibit exists, if yes then update it 
            const [ curr_exh ] = await db.query(queries.get_specific_exhibit, exhibitid);

            // first, we check all the normal exhibit parts out, no matter what
            if(exhibitname == null || exhibitname == ""){
                exhibitname = curr_exh[0].ExhibitName;
            }

            if(exhibitdesc == null || exhibitdesc == ""){
                exhibitdesc = curr_exh[0].ExhibitDesc;
            }

            if(exhibitpic == null || exhibitpic == ""){
                exhibitpic = curr_exh[0].ExhibitPic;
            }

            // if it's a special exhibit, we do more things with it
            if(curr_exh[0].IsSpecial){
                if(startdate == null || startdate == ""){
                    startdate = curr_exh[0].StartDate
                }
                if(enddate == null || enddate == ""){
                    enddate = curr_exh[0].EndDate
                }
                if(fee == null || fee == ""){
                    fee = curr_exh[0].Fee
                }

                const special_results = await db.query(queries.update_special_exhibit, [ startdate, enddate, fee, exhibitid]);
                if(!special_results || special_results.affectedRows == 0){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
                }
                await db.query(queries.new_history_log, [managerEmail, "Updated", "SpecialExhibits", exhibitid, "Special exhibit with the name " + exhibitname + " has been updated."]);
            }

            else{
                await db.query(queries.new_history_log, [managerEmail, "Updated", "Exhibits", exhibitid, "Normal exhibit with the name " + exhibitname + " has been updated."]);
            }

            const results = await db.query(queries.update_exhibit, [exhibitname, exhibitdesc, exhibitpic, exhibitid,])

            if(!results || results.affectedRows == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Database could not update entry. Invalid input?' }));
            }

            // Return success message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Exhibit successfully updated.' }));
        } catch (err) {
            console.error('Error updating exhibit: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error editing exhibit.' }));
        }
    });
}

/*
Alec and I decided exhibits cannot be deletable - therefore, this has been commented out

const deleteExhibit = async (req, res) => {
    // Get fields from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }); 

    // Process the request once it is received, send response
    req.on('end', async() => {
        try {
            // Store the necessary field to delete the exhibit

            // Check that the necessary field was provided, return error if not
            
            // SQL QUERY GOES HERE

            // Return successful delete message
            res.writeHead(204, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Exhibit successfully deleted.' }));
        } catch (err) {
            console.error('Error deleting exhibit.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error deleting exhibit.' }));
        }
    });
}
*/

module.exports = { getExhibits, getExhibit, createExhibit, updateExhibit };