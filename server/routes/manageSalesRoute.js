const http = require('http');
const {processTransaction, ticketPurchase, getTransactionReport} = require('../controllers/manageTransactionsController');
const verifyToken = require('../middleware/authMiddleware');

const manageSalesRoutes = (req, res) => {
    // process transaction
    if (req.url.startsWith('/transactions/items') && req.method === 'POST') {
        verifyToken('Manager') (req, res, () => {
            processTransaction(req, res);
        });
    } else if (req.url.startsWith('/transactions/tickets') && req.method == "POST"){
        verifyToken('Customer') (req, res, () => {
            ticketPurchase(req, res);
        });
    } else if (req.url.startsWith('/transactions') && req.method === 'GET') {
        verifyToken('Manager') (req, res, () => {
            getTransactionReport(req, res);
        });
    }
}

module.exports = manageSalesRoutes;