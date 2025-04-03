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
            const email = decodeURIComponent(urlParts[urlParts.length - 5]); // manager email
            const from_date = urlParts[urlParts.length - 4]; // first date selected
            const to_date = urlParts[urlParts.length - 3]; // second date selected (should be later than the first)
            const action_type = urlParts[urlParts.length-2]; // matches the enum in allhistory OR -> "any"
            const effected_table = urlParts[urlParts.length-1]; // matches the enum in allhistory OR -> "all"
            change_history_report(req, res, email, from_date, to_date, action_type, effected_table);
        });
    
    // forth report stuff
    } else if (req.url.startsWith('/reports/customer-report') && req.method === 'GET') {
        verifyToken('Manager', null)(req, res, () => {
            const urlParts = req.url.split('/');
            const email = decodeURIComponent(urlParts[urlParts.length - 4]); // manager email
            const account_creation_period = urlParts[urlParts.length - 3]; // same as the other reports
            const promotional_offer_candidate = urlParts[urlParts.length - 2]; // true false all
            const members_only = urlParts[urlParts.length-1]; // true false all
            customer_info_report(req, res, email, account_creation_period, promotional_offer_candidate, members_only);
        });
    }
};


module.exports = manageReportsRoutes;