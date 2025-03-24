const http = require('http');
const { getReviews, getReview, createReview, deleteReview, updateReview } = require('../controllers/manageReviewsController');
const verifyToken = require('../middleware/authMiddleware');

const manageReviewsRoutes = (req, res) => {
    if (req.url === '/reviews' && req.method === 'GET') {
        getReviews(req, res);
    } else if (req.url.startsWith('/reviews/') && req.method === 'GET') {
        getReview(req, res);
    } else if (req.url === '/reviews' && req.method === 'POST') {
            createReview(req, res);
    } else if (req.url.startsWith('/reviews/') && req.method === 'PUT') {
        updateReview(req, res);
    } else if (req.url.startsWith('/reviews/') && req.method === 'DELETE') {
        deleteReview(req, res);
    }
};

module.exports = manageReviewsRoutes;