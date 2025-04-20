const http = require('http');
const { getAllCollections, getSpecificCollection, getExhibitCollections, createCollection, deleteCollection, updateCollection } = require('../controllers/manageCollectionsController');
const verifyToken = require('../middleware/authMiddleware');

const manageCollectionsRoutes = (req, res) => {
    // Collection management
    if (req.url === '/collections' && req.method === 'GET') {
        getAllCollections(req, res);
    } else if (req.url.startsWith('/collections/exhibit/') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        var exhibitID = urlParts[urlParts.length - 1];
        if (exhibitID != "null"){
            exhibitID = parseInt(urlParts[urlParts.length - 1]);
        }
        getExhibitCollections(req, res, exhibitID);
    } else if (req.url.startsWith('/collections/') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        var title = decodeURIComponent(urlParts[urlParts.length - 1]);
        getSpecificCollection(req, res, title);
    } else if (req.url === '/collections' && req.method === 'POST') {
        verifyToken('Employee', 'Curator')(req, res, () => {
            createCollection(req, res);
        });
    } else if (req.url.startsWith('/collections/') && req.method === 'PUT') {
        verifyToken('Employee', 'Curator')(req, res, () => {
            updateCollection(req, res);
        });
    } else if (req.url.startsWith('/collections/') && req.method === 'DELETE') {
        verifyToken('Employee', 'Curator')(req, res, () => {
            deleteCollection(req, res);
        });
    }
};

module.exports = manageCollectionsRoutes;