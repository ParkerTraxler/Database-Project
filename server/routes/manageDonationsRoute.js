const http = require('http');
const { getDonations, getDonationsForUser, createDonation } = require('../controllers/manageDonationsController');
const verifyToken = require('../middleware/authMiddleware');

const manageDonationsRoutes = (req, res) => {
    if (req.url === '/donations' && req.method === 'GET') {
        getDonations(req, res);
    } else if (req.url.startsWith('/donations/') && req.method === 'GET') {
        getDonationsForUser(req, res);
    } else if (req.url === '/donations' && req.method === 'POST') {
        createDonation(req, res);
    }
};

module.exports = manageDonationsRoutes;