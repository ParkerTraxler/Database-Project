const http = require('http');
const handleRoutes = require('./routes');
const PORT = 3001;

// CORS middleware
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

const server = http.createServer((req, res) => {
    corsMiddleware(req, res);
    handleRoutes(req, res);
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});