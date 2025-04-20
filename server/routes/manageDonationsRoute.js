const http = require('http');
const { getDonations, getDonationsForUser, createDonation } = require('../controllers/manageDonationsController');
const verifyToken = require('../middleware/authMiddleware');

const manageDonationsRoutes = (req, res) => {
    if (req.url === '/donations' && req.method === 'GET') {
        getDonations(req, res);
    } else if (req.url.startsWith('/donations/') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const email = decodeURIComponent(urlParts[urlParts.length - 1]);
        getDonationsForUser(req, res, email);
    } else if (req.url === '/donations' && req.method === 'POST') {
        verifyToken('Customer', null)(req, res, () => {
            createDonation(req, res);
        });
    }
};

module.exports = manageDonationsRoutes;