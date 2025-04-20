const http = require('http');
const {getManagerProfile, updateManagerProfile, getAllManagers} = require('../controllers/manageManagerController');
const verifyToken = require('../middleware/authMiddleware');

const manageManagerRoute = (req, res) => {
    if (req.url.startsWith('/managers') && req.method == 'GET'){
        getAllManagers(req, res);
    }
    else if (req.url.startsWith('/manager') && req.method === 'PUT') {
        verifyToken('Manager', null) (req, res, () => {
            updateManagerProfile(req, res);
        });
    } else if (req.url.startsWith('/manager') && req.method === 'GET') {
        verifyToken('Manager', null) (req, res, () => {
            const urlParts = req.url.split('/');
            const email = decodeURIComponent(urlParts[urlParts.length - 1]);
            getManagerProfile(req, res, email);
        });
    }
}

module.exports = manageManagerRoute;