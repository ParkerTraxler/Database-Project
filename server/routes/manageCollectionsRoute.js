const http = require('http');
const { getAllCollections, getCollection, createCollection, deleteCollection, updateCollection } = require('../controllers/manageCollectionsController');
const verifyToken = require('../middleware/authMiddleware');

const manageCollectionsRoutes = (req, res) => {
    // Collection management
    if (req.url === '/collections' && req.method === 'GET') {
        getAllCollections(req, res);
    } else if (req.url.startsWith('/collections/') && req.method === 'GET') {
        getCollection(req, res);
    } else if (req.url === '/collections' && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            createCollection(req, res);
        });
    } else if (req.url.startsWith('/collections/') && req.method === 'PUT') {
        verifyToken('Manager')(req, res, () => {
            updateCollection(req, res);
        });
    } else if (req.url.startsWith('/collections/') && req.method === 'DELETE') {
        verifyToken('Manager')(req, res, () => {
            deleteCollection(req, res);
        });
    }
};

module.exports = manageCollectionsRoutes;