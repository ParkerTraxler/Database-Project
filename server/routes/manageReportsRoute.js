const http = require('http');
const {giftshop_sales_report, giftshop_aggregate, aggregate_finance_report, change_history_report, customer_info_report} = require('../controllers/manageAllReports');
const verifyToken = require('../middleware/authMiddleware');


const manageReportsRoutes = (req, res) => {
    // first report stuff
    if (req.url.startsWith('/reports/giftshop-sales') && req.method === 'GET') {
        verifyToken('Manager', null)(req, res, () => {
            const urlParts = req.url.split('/');
            const email = decodeURIComponent(urlParts[urlParts.length - 2]);
            const period_of_time = urlParts[urlParts.length - 1]
            giftshop_sales_report(req, res, email, period_of_time);
        });
    } else if (req.url.startsWith('/reports/giftshop-aggregate') && req.method === 'GET'){
        verifyToken('Manager', null)(req, res, () => {
            const urlParts = req.url.split('/');
            const period_of_time = urlParts[urlParts.length - 1]
            giftshop_aggregate(req, res, period_of_time);
        });
    
    // second report stuff
    } else if (req.url.startsWith('/reports/aggregate-revenue') && req.method === 'GET') {
        verifyToken('Manager', null)(req, res, () => {
            const urlParts = req.url.split('/');
            const email = decodeURIComponent(urlParts[urlParts.length - 1]);
            aggregate_finance_report(req, res, email);
        });
    
    // third report stuff
    } else if (req.url.startsWith('/reports/change-history') && req.method === 'GET') {
        verifyToken('Manager', null)(req, res, () => {
            const urlParts = req.url.split('/');
            const email = decodeURIComponent(urlParts[urlParts.length - 1]);
            change_history_report(req, res, email);
        });
    
    // forth report stuff
    } else if (req.url.startsWith('/reports/customer-report') && req.method === 'GET') {
        verifyToken('Manager', null)(req, res, () => {
            const urlParts = req.url.split('/');
            const email = decodeURIComponent(urlParts[urlParts.length - 1]);
            customer_info_report(req, res, email);
        });
    }
};


module.exports = manageReportsRoutes;