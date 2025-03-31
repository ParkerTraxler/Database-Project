const http = require('http');
const {processTransaction, ticketPurchase, getTransactionReport} = require('../controllers/manageTransactionsController');
const verifyToken = require('../middleware/authMiddleware');

const manageSalesRoutes = (req, res) => {
    // process transaction
    if (req.url.startsWith('/transactions/items') && req.method === 'POST') {
        verifyToken('Employee', 'GiftShopTeam') (req, res, () => {
            processTransaction(req, res);
        });
    } else if (req.url.startsWith('/transactions/tickets') && req.method == "POST"){
        verifyToken('Customer', null) (req, res, () => {
            ticketPurchase(req, res);
        });
    } else if (req.url.startsWith('/transactions') && req.method === 'GET') {
        verifyToken('Manager', null) (req, res, () => {
            getTransactionReport(req, res);
        });
    }
}

module.exports = manageSalesRoutes;