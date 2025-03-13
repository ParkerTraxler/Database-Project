// routes.js
const http = require('http');
const loginController = require('./controllers');



const handleRoutes = (req, res) => {

    if (req.url === '/log-in' && req.method === 'POST') {
        loginController.loginUser(req, res);
    } else {
        if (!res.headersSent) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Route not found' }));
        }
    }
};

module.exports = handleRoutes;