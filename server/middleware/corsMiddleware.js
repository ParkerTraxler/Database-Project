const corsMiddleware = (req, res) => {

    const allowedOrigin = 'https://green-ground-0dc4ce31e.6.azurestaticapps.net';

    // Check that the request's origin matches the allowed origin
    const origin = req.headers.origin;
    if (origin === allowedOrigin) {
        console.log('Header sent');
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);        
    }

    // ALlow methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Allow headers
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
};

module.exports = corsMiddleware;