const http = require('http');
const verifyToken = require('../controllers/authController');
// Include controllers later...

const manageExhibitsRoutes = (req, res) => {
    if (req.url === '/exhibits' && req.method === 'GET') {
        verifyToken('Manager')(req, res, () => {
            // Read all exhibit
        });
    } else if (req.url === '/exhibits/:exhibit' && req.method === 'GET') {
        verifyToken('Manager')(req, res, () => {
            // Read a specific exhibit
        });
    } else if (req.url === '/exhibits' && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            // Create a new exhibit
        });
    } else if (req.url === '/exhibits/:exhibit' && req.method === 'PUT') {
        verifyToken('Manager')(req, res, () => {
            // Update an exhibit
        });
    } else if (req.url === '/exhibits/:exhibit' && req.method === 'DELETE') {
        verifyToken('Manager')(req, res, () => {
            // Delete an exhibit
        });
    }
}

module.exports = manageExhibitsRoutes;