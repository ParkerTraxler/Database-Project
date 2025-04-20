const http = require('http');
const verifyToken = require('../middleware/authMiddleware');
const { getAllArtworks, getSpecificArtwork, getCollectionArtwork, createArtwork, deleteArtwork, updateArtwork } = require('../controllers/manageArtworksController');

const manageArtworksRoutes = (req, res) => {
    if (req.url === '/artworks' && req.method === 'GET') {
        getAllArtworks(req, res);
    } else if (req.url.startsWith('/artworks') && req.method === 'POST') {
        verifyToken('Employee', 'Curator')(req, res, () => {
            createArtwork(req, res);
        });
    } else if (req.url.startsWith('/artworks/collection/') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const title = decodeURIComponent(urlParts[urlParts.length - 1]);  // Extract the collectionTitle from the last part of the URL
        getCollectionArtwork(req, res, title);
    } else if (req.url.startsWith('/artworks/') && req.method === 'GET'){
        const urlParts = req.url.split('/');
        const artworkID = parseInt(urlParts[urlParts.length - 1]); 
        getSpecificArtwork(req, res, artworkID);
    } else if (req.url.startsWith('/artworks/') && req.method === 'PUT') {
        verifyToken('Employee', 'Curator')(req, res, () => {
            updateArtwork(req, res);
        });
    } else if (req.url.startsWith('/artworks/') && req.method === 'DELETE') {
        verifyToken('Employee', 'Curator')(req, res, () => {
            deleteArtwork(req, res);
        });
    }
}

module.exports = manageArtworksRoutes;