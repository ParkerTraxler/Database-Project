const http = require('http');
const verifyToken = require('../middleware/authMiddleware');
const { getAllArtworks, getArtwork, createArtwork, deleteArtwork, updateArtwork } = require('../controllers/manageArtworksController');

const manageArtworksRoutes = (req, res) => {
    if (req.url === '/artworks' && req.method === 'GET') {
        getAllArtworks(req, res);
    } else if (req.url === '/artworks' && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            createArtwork(req, res);
        });
    } else if (req.url === '/artworks/' && req.method === 'GET') {
        getArtwork(req, res);
    } else if (req.url === '/artworks/' && req.method === 'PUT') {
        verifyToken('Manager')(req, res, () => {
            updateArtwork(req, res);
        });
    } else if (req.url === '/artworks/' && req.method === 'DELETE') {
        verifyToken('Manager')(req, res, () => {
            deleteArtwork(req, res);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Route not found.' }))
    }
}

module.exports = manageArtworksRoutes;