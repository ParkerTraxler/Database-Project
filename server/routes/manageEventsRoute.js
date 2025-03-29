const http = require('http');
const { getAllEvents, getEvent, getEventEmployees, createEvent, cancelEvent, updateEvent } = require('../controllers/manageEventsController');
const verifyToken = require('../middleware/authMiddleware');

const manageEventsRoutes = (req, res) => {
    if (req.url === '/events' && req.method === 'GET') {
        getAllEvents(req, res);
    } else if (req.url.startsWith('/events/') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const eventID = parseInt(urlParts[urlParts.length - 1]);
        getEvent(req, res, eventID);
    } else if (req.url.startsWith('/events/employees') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const eventID = parseInt(urlParts[urlParts.length - 1]);
        getEventEmployees(req, res, eventID);
    } else if (req.url === '/events' && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            createEvent(req, res);
        });
    } else if (req.url.startsWith('/events/') && req.method === 'PUT') {
        verifyToken('Manager')(req, res, () => {
            updateEvent(req, res);
        });
    } else if (req.url.startsWith('/events/') && req.method === 'DELETE') {
        verifyToken('Manager')(req, res, () => {
            cancelEvent(req, res);
        });
    }
}

module.exports = manageEventsRoutes;