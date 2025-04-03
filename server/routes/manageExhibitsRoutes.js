const http = require('http');
const { getExhibits, getExhibit, createExhibit, updateExhibit } = require('../controllers/manageExhibitsController');
const verifyToken = require('../middleware/authMiddleware');

const manageExhibitsRoutes = (req, res) => {
    if (req.url === '/exhibits' && req.method === 'GET') {
        getExhibits(req, res);  
    } else if (req.url.startsWith('/exhibits/') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const exhibitID = parseInt(urlParts[urlParts.length - 1]);
        getExhibit(req, res, exhibitID);
    } else if (req.url.startsWith('/exhibits') && req.method === 'POST') {
        verifyToken('Manager', null)(req, res, () => {
            createExhibit(req, res);
        });
    } else if (req.url.startsWith('/exhibits/') && req.method === 'PUT') {
        verifyToken('Manager', null)(req, res, () => {
            updateExhibit(req, res);
        });
    }
}

module.exports = manageExhibitsRoutes;