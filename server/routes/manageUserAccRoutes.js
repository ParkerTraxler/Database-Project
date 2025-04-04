const http = require('http');
const { getProfile, updateProfile, toggleMembership } = require('../controllers/manageUserController');
const verifyToken = require('../middleware/authMiddleware');

const manageProfileRoutes = (req, res) => {
    if (req.url.startsWith('/profile') && req.method === 'GET') {
        verifyToken('Customer', null) (req, res, () => {
            const urlParts = req.url.split('/');
            const email = decodeURIComponent(urlParts[urlParts.length - 1]);
            getProfile(req, res, email);
        });
    } else if (req.url.startsWith('/profile/membership') && req.method === 'PUT') {
        verifyToken('Customer', null) (req, res, () => {
            toggleMembership(req, res);
        });
    } else if (req.url.startsWith('/profile/') && req.method === 'PUT') {
        verifyToken('Customer', null) (req, res, () => {
            updateProfile(req, res);
        });
    }
};

module.exports = manageProfileRoutes;