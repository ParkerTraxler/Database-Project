const http = require('http');
const { createItem, deleteItem, updateItem, updateItemQuantity, getTickets, getTicket} = require('../controllers/manageItemsController');
const verifyToken = require('../controllers/authController');

const manageItemsRoutes = (req, res) => {
    if (req.url.startsWith('/items/') && req.url.method === 'POST') {
        verifyToken('Manager') (req, res, () => {
            createItem(req, res);
        });
    } else if (req.url.startsWith('/items/') && req.url.method === 'DELETE') {
        verifyToken('Manager') (req, res, () => {
            deleteItem(req, res);
        });
    } else if (req.url.startsWith('/items/') && req.url.method === 'PUT') {
        verifyToken('Manager') (req, res, () => {
            updateItem(req, res);
        });
    } else if (req.url === '/items/tickets' && req.url.method === 'GET') {
        verifyToken('Manager') (req, res, () => {
            getTickets(req, res);
        });
    } else if (req.url.startsWith('/items/tickets/') && req.url.method === 'GET') {
        verifyToken('Manager') (req, res, () => {
            getTicket(req, res);
        });
    }
}

module.exports = manageItemsRoutes;