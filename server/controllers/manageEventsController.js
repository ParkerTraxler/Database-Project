const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

const getAllEvents = async (req, res) => {
    try {
        // SQL QUERY - Retrieve events from database
        const [ rows ] = db.query(queries.get_all_events);

        // Return events to the frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching all events: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve events.' }));
    }
}

const getEvent = async (req, res, eventid) => {
    try {
        // SQL Query - send an event, if it exists
        if(!eventid){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'No EventID specified to get!'}));
        }

        const [ rows ] = db.query(queries.get_specific_event, [eventid]);

        if(rows.length == 0){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'Specified event does not exist! Has it been canceled?'}));
        }
    
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows[0]));
    } catch (err) {
        console.error('Error fetching event: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve events.' }));
    }
}

const getEventEmployees = async (req, res, eventid) => {
    try {
        // SQL Query - send an event, if it exists
        if(!eventid){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'No EventID specified to get!'}));
        }

        const [ rows ] = db.query(queries.get_event_employees, [eventid]);

        if(rows.length == 0){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: 'Specified event has no employees assigned.'}));
        }
    
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching event: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to retrieve event workers.' }));
    }
}

const createEvent = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { eventname, eventdesc, eventdate, eventpic, memberonly, employeelist } = JSON.parse(body);
        try {
            if(!eventname){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({error: 'Events must have a title'}))
            }

            if(!eventdate){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({error: 'Events must have a planned date!'}))
            }
            // SQL QUERY - Create event and then add the employees to it (2 queries)
            const [ result ] = db.query(queries.create_event, [eventname, eventdesc, eventdate, eventpic, memberonly]);

            if(!result || result.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to create new event! Invalid input?' }));
            }

            const failedToAdd = [];

            for(let employeeEmail of employeelist){
                const [ results ] = db.query(queries.add_event_employee, [result.insertId, employeeEmail]);

                if(!results || results.rowCount == 0){
                    failedToAdd.push(employeeEmail);
                }
            }

            if(failedToAdd.length > 0){
                let employee_failure = failedToAdd.join(", ");
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to add the following employee emails: ', employee_failure}));
            }

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Event employees all added successfully.' }));

        } catch (err) {
            console.log('Error creating event: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to create event.' }));
        }
    });
}

const cancelEvent = async (req, res) => {
    // Get data from request
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { eventid } = JSON.parse(body);

            // Ensure an event name was provided
            if (!eventid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Event not found! Has it already been canceled?' }))
            }

            // SQL QUERY - cancel (delete) event by that ID - return if possible or not
            const { result } = db.queries(queries.cancel_event, [ eventid ])

            if(result.length == 0){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({ error: 'Specified event does not exist! Has it already been canceled?'}));
            }

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Event cancelled successfully.' }));

        } catch (err) {
            console.error('Error creating event: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to cancel event.' }));
        }
    });
}

// terrifying.
const updateEvent = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        var { eventid, eventname, eventdesc, eventdate, eventpic, memberonly, addedemployees, removedemployees } = JSON.parse(body);
        try {

            if(!eventid){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No event ID specified to get!' }));
            }

            // First, SQL QUERY to check if the event even exists (and is not deleted)
            const [ event ] = db.query(queries.get_specific_event, [eventid]);

            if(!event || event.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Event not found! Has it been deleted?' }));
            }

            if(eventname == null || eventname == ""){
                eventname = event[0].EventName;
            }

            if(eventdesc == null || eventdesc == ""){
                eventdesc = event[0].EventDesc;
            }

            if(eventdate == null || eventdate == ""){
                eventdate = event[0].EventDate;
            }

            if(eventpic == null || eventpic == ""){
                eventpic = event[0].EventPic;
            }

            if(memberonly == null || memberonly == ""){
                memberonly = event[0].MemberOnly;
            }

            // first update the event itself
            const [ results ] = db.query(queries.update_event, [eventname, eventdesc, eventdate, eventpic, memberonly, eventid]);

            if(!results || results.rowCount == 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to update event! Stopping before employees are added/removed' }));
            }

            const failedToRemove = []
            for(let employeeEmail of removedemployees){
                const [ results ] = db.query(queries.remove_event_employee, [eventid, employeeEmail]);

                if(!results || results.rowCount == 0){
                    failedToRemove.push(employeeEmail);
                }
            }

            if(failedToRemove.length > 0){
                let employee_failure = failedToAdd.join(", ");
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'STOPPING BEFORE ADDING EMPLOYEES -- Failed to remove the following employee emails: ', employee_failure}));
            }


            // then we add all the employees 
            const failedToAdd = [];

            for(let employeeEmail of addedemployees){
                const [ results ] = db.query(queries.add_event_employee, [eventid, employeeEmail]);

                if(!results || results.rowCount == 0){
                    failedToAdd.push(employeeEmail);
                }
            }

            if(failedToAdd.length > 0){
                let employee_failure = failedToAdd.join(", ");
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to add the following employee emails: ', employee_failure}));
            }

            // Return success message
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Event and its employees edited successfully.' }));

        } catch (err) {
            console.log('Error creating event: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to edit some part of the event.' }));
        }
    });
}

module.exports = { getAllEvents, getEvent, getEventEmployees, createEvent, cancelEvent, updateEvent };