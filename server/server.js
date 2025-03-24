const http = require('http');
const corsMiddleware = require('./middleware/corsMiddleware');
// Routers
const authRoutes = require('./routes/authRoutes');
const manageEmployeesRoutes = require('./routes/manageEmployeesRoute');
const manageCollectionsRoutes = require('./routes/manageCollectionsRoute');
const manageEventsRoutes = require('./routes/manageEventsRoute');
const manageExhibitsRoutes = require('./routes/manageExhibitsRoutes');
const manageArtworksRoutes = require('./routes/manageArtworksRoute');
const manageItemsRoutes = require('./routes/manageItemsRoute');
const manageDonationsRoutes = require('./routes/manageDonationsRoute');
const manageReviewsRoutes = require('./routes/manageReviewsRoute');
const manageSalesRoutes = require('./routes/manageSalesRoute')
// Port
const PORT = 3002;

const server = http.createServer((req, res) => {

    corsMiddleware(req, res);

    if (req.url.startsWith('/auth'))
        authRoutes(req, res);
    else if (req.url.startsWith('/employees'))
        manageEmployeesRoutes(req, res);
    else if (req.url.startsWith('/collections'))
        manageCollectionsRoutes(req, res);
    else if (req.url.startsWith('/events'))
        manageEventsRoutes(req, res);
    else if (req.url.startsWith('/exhibits'))
        manageExhibitsRoutes(req, res);
    else if (req.url.startsWith('/artworks'))
        manageArtworksRoutes(req, res);
    else if (req.url.startsWith('/items'))
        manageItemsRoutes(req, res);
    else if (req.url.startsWith('/donations'))
        manageDonationsRoutes(req, res);
    else if (req.url.startsWith('/reviews'))
        manageReviewsRoutes(req, res);
    else if (req.url.startsWith('/transactions'))
        manageSalesRoutes(req, res);
    else {
        res.writeHead(404, {'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});