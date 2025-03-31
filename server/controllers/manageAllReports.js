const http = require('http');
const queries = require('../querylist.js')
const db = require('../db/db');

// This is the controller that gets all the reports - based on what follows after reports/???
const get_timeframe = (timeframe) => {
    var filter_date = new Date();
    switch(timeframe){
        case 'last-day':
            filter_date.setDate(filter_date.getDate() - 1);
            break;
        case 'last-week':
            filter_date.setDate(filter_date.getDate() - 7);
            break; 
        case 'last-month':
            filter_date.setMonth(filter_date.getMonth() - 1);
            break;
        case 'last-quarter':
            filter_date.setMonth(filter_date.getMonth() - 3);
            break;
        case 'last-year':
            filter_date.setFullYear(filter_date.getFullYear() - 1);
            break;
        default:
            // simulate "all-time"
            filter_date.setFullYear(1970, 0, 1);
    }

    const year = filter_date.getFullYear();
    const month = (filter_date.getMonth() + 1).toString().padStart(2, '0');
    const day = filter_date.getDate().toString().padStart(2, '0');
    filter_date.setHours(0, 0, 0, 0);
    final_date = `${year}-${month}-${day}`;
    return filter_date;
}


const giftshop_sales_report = async (req, res, email, period_of_time) => {
    try {
        var final_date = get_timeframe(period_of_time);

        // SQL QUERY - get the report 
        const [ rows ] = await db.query(queries.all_sales_report, [final_date]);

        // Return reviews to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching reviews: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the report.' }));
    }
}

const giftshop_aggregate = async(req, res, period_of_time) =>{
    try {
        var final_date = get_timeframe(period_of_time);

        // SQL QUERY - get the report 
        const [ rows ] = await db.query(queries.all_sales_aggregate, [final_date]);

        // Return reviews to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching reviews: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the report.' }));
    }
}

const aggregate_finance_report = async (req, res, email) =>{

}

const change_history_report = async (req, res, email) =>{

}

const customer_info_report = async(req, res, email) =>{

}

module.exports = {giftshop_sales_report, giftshop_aggregate, aggregate_finance_report, change_history_report, customer_info_report};