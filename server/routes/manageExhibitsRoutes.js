const http = require('http');
const { getExhibits, getExhibit, createExhibit, deleteExhibit, updateExhibit } = require('../controllers/manageExhibitsController');
const verifyToken = require('../controllers/authController');
// Include controllers later...

const manageExhibitsRoutes = (req, res) => {
    if (req.url === '/exhibits' && req.method === 'GET') {
        getExhibits(req, res);  
    } else if (req.url.startsWith('/exhibits/') && req.method === 'GET') {
        getExhibit(req, res);
    } else if (req.url === '/exhibits' && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            createExhibit(req, res);
        });
    } else if (req.url.startsWith('/exhibits/') && req.method === 'PUT') {
        verifyToken('Manager')(req, res, () => {
            updateExhibit(req, res);
        });
    } else if (req.url.startsWith('/exhibits/') && req.method === 'DELETE') {
        verifyToken('Manager')(req, res, () => {
            deleteExhibit(req, res);
        });
    }
}

module.exports = manageExhibitsRoutes;