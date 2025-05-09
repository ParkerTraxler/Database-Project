const http = require('http');
const { getReviews, getUserReview, createReview, updateReview } = require('../controllers/manageReviewsController');
const verifyToken = require('../middleware/authMiddleware');

const manageReviewsRoutes = (req, res) => {
    if (req.url === '/reviews' && req.method === 'GET') {
        getReviews(req, res);
    } else if (req.url.startsWith('/reviews/') && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const userEmail = decodeURIComponent(urlParts[urlParts.length - 1]);
        getUserReview(req, res, userEmail);
    } else if (req.url === '/reviews' && req.method === 'POST') {
        verifyToken('Customer', null)(req, res, () => {
            createReview(req, res);
        });
    } else if (req.url.startsWith('/reviews/') && req.method === 'PUT') {
        verifyToken('Customer', null)(req, res, () => {
            updateReview(req, res);
        });
    }
};

module.exports = manageReviewsRoutes;