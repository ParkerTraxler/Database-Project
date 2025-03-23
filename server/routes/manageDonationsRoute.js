const http = require('http');
const { getDonations, getDonation, createDonation, deleteDonation, updateDonation } = require('../controllers/manageDonationsController');
const verifyToken = require('../middleware/authMiddleware');

const manageDonationsRoutes = (req, res) => {
    if (req.url === '/donations' && req.method === 'GET') {
        getDonations(req, res);
    } else if (req.url.startsWith('/donations/') && req.method === 'GET') {
        getDonation(req, res);
    } else if (req.url === '/donations' && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            createDonation(req, res);
        });
    } else if (req.url.startsWith('/donations/') && req.method === 'PUT') {
        verifyToken('Manager')(req, res, () => {
            updateDonation(req, res);
        });
    } else if (req.url.startsWith('/donations/') && req.method === 'DELETE') {
        verifyToken('Manager')(req, res, () => {
            deleteDonation(req, res);
        });
    }
};

module.exports = manageDonationsRoutes;