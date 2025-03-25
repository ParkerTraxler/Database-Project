const http = require('http');
const verifyToken = require('../middleware/authMiddleware');
const { getAllArtworks, getCollectionArtwork, createArtwork, deleteArtwork, updateArtwork } = require('../controllers/manageArtworksController');

const manageArtworksRoutes = (req, res) => {
    if (req.url === '/artworks' && req.method === 'GET') {
        getAllArtworks(req, res);
    } else if (req.url.startsWith('/artworks') && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            createArtwork(req, res);
        });
    } else if (req.url.startsWith('/artworks/collection/') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const title = decodeURIComponent(urlParts[urlParts.length - 1]);  // Extract the collectionTitle from the last part of the URL
        getCollectionArtwork(req, res, title);
    } else if (req.url.startsWith('/artworks/') && req.method === 'PUT') {
        verifyToken('Manager')(req, res, () => {
            updateArtwork(req, res);
        });
    } else if (req.url.startsWith('/artworks/') && req.method === 'DELETE') {
        verifyToken('Manager')(req, res, () => {
            deleteArtwork(req, res);
        });
    }
}

module.exports = manageArtworksRoutes;