const http = require('http');
const { getProfile, updateProfile, toggleMembership } = require('../controllers/manageUserController');
const verifyToken = require('../middleware/authMiddleware');

const manageProfileRoutes = (req, res) => {
    if (req.url.startsWith('/profile') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const email = decodeURIComponent(urlParts[urlParts.length - 1]);
        getProfile(req, res, email);
    } else if (req.url.startsWith('/profile/') && req.method === 'PUT') {
        verifyToken('Customer') (req, res, () => {
            updateProfile(req, res);
        });
    } else if (req.url.startsWith('/profile/membership') && req.method === 'PUT') {
        toggleMembership(req, res);
    }
};

module.exports = manageProfileRoutes;