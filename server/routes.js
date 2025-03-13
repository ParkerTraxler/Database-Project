// routes.js
const http = require('http');
const cors = require('cors'); // CORS module
const loginController = require('./controllers');

const corsMiddleware = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
};

const handleRoutes = (req, res) => {
    corsMiddleware(req, res);  // Enable CORS for all routes

    const url = req.url;
    const method = req.method;

    if (url === '/log-in' && method === 'POST') {
        loginController.loginUser(req, res);
    } else {
        if (!res.headersSent) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Route not found' }));
        }
    }
};

module.exports = handleRoutes;