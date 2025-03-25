const http = require('http');
const { createItem, deleteItem, updateItem, updateItemQuantity, getItems, getItem, getTickets, getTicket} = require('../controllers/manageItemsController');
const verifyToken = require('../middleware/authMiddleware');

const manageItemsRoutes = (req, res) => {
    // regular items
    if (req.url === '/items' && req.method === 'GET') {
        getItems(req, res);
    } else if(req.url.startsWith('/items/') && req.method === 'GET'){
        const urlParts = req.url.split('/');
        const itemID = parseInt(urlParts[urlParts.length - 1]);
        getItem(req, res, itemID);
    } else if (req.url.startsWith('/items/') && req.url.method === 'POST') {
        verifyToken('Manager') (req, res, () => {
            createItem(req, res);
        });
    } else if (req.url.startsWith('/items/') && req.url.method === 'DELETE') {
        verifyToken('Manager') (req, res, () => {
            deleteItem(req, res);
        });
    // both tickets & items can have the bottom 2 done to it
    } else if (req.url.startsWith('/items/restock') && req.url.method === 'PUT'){
        verifyToken('Manager') (req, res, () => {
            updateItemQuantity(req, res);
        });
    } else if (req.url.startsWith('/items/') && req.url.method === 'PUT') {
        verifyToken('Manager') (req, res, () => {
            updateItem(req, res);
        });
    // tickets - visible to everyone
    }  else if (req.url === '/items/tickets' && req.url.method === 'GET') {
        getTickets(req, res);
    } else if (req.url.startsWith('/items/tickets/') && req.url.method === 'GET') {
        const urlParts = req.url.split('/');
        const ticketID = parseInt(urlParts[urlParts.length - 1]);
        getTicket(req, res, ticketID);
    }
}

module.exports = manageItemsRoutes;