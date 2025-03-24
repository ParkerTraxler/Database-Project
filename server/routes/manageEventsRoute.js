const http = require('http');
const { getAllEvents, getEvent, createEvent, deleteEvent, updateEvent } = require('../controllers/manageEventsController');
const verifyToken = require('../controllers/authController');

const manageEventsRoutes = (req, res) => {
    if (req.url === '/events' && req.method === 'GET') {
        getAllEvents(req, res);
    } else if (req.url.startsWith('/events/') && req.method === 'GET') {
        getEvent(req, res);
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
            deleteEvent(req, res);
        });
    }
}

module.exports = manageEventsRoutes;