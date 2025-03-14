// routes.js
const http = require('http');
const { loginUser, registerUser } = require('../controllers/authController');

const handleRoutes = (req, res) => {

    if (req.url === '/auth/login' && req.method === 'POST') {
        loginUser(req, res);
    } else if (req.url === '/auth/register' && req.method === 'POST') {
        registerUser(req, res);
    } else {
        if (!res.headersSent) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Route not found' }));
        }
    }
};

module.exports = handleRoutes;