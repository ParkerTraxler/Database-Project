const http = require('http');
const authRoutes = require('./routes/authRoutes');
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
    if (req.url.startsWith('/auth'))
        authRoutes(req, res);
    else {
        res.writeHead(404, {'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});