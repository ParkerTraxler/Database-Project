const jwt = require('jsonwebtoken');

function verifyToken(requiredRole, requiredPosition) {

    return (req, res, next) => {

        // Extracts authorization header from the request
        const authHeader = req.headers['authorization'];

        // Check if the header exists and that it is in the correct format
        // If no to either, return no valid token provided
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Unauthorized: No token provided' }));
        }

        // Format: Bearer [token]
        // Extracts the token from the authorization header
        const token = authHeader.split(' ')[1];

        // Verify token using secret key
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            // If invalid, don't authorize the user
            if (err) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Forbidden: Invalid token' }));
            }
                
            // Token payload is atteched to req.user if valid
            req.user = decoded;

            if (requiredRole && req.user.role !== requiredRole) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Forbidden: Insufficient privileges' }));
            }

            if(requiredPosition != null && res.user.position !== requiredPosition){
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Forbidden: Insufficient privileges' }));  
            }

            // Proceed if authorized
            next();
        });
    }
}

module.exports = verifyToken;