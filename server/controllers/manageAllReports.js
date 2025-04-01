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

        // log that a manager generated a report
        await db.query(queries.new_history_log, [email, "Report Generated", "Sales", 0, "Manager has generated the Giftshop Sales Report."]);

        // Return reviews to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching reviews: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the giftshop sales report.' }));
    }
}

const giftshop_aggregate = async(req, res, period_of_time) =>{
    try {
        var final_date = get_timeframe(period_of_time);

        // SQL QUERY - get the report 
        const [ rows ] = await db.query(queries.all_sales_aggregate, [final_date]);

        // Return report to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching reviews: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the giftshop aggregate report.' }));
    }
}

const aggregate_finance_report = async (req, res, email) =>{

}

const change_history_report = async (req, res, email) =>{

}

const customer_info_report = async(req, res, email, account_creation_period, promotional_offer_candidate, members_only) =>{
    try{
        var timeframe = get_timeframe(account_creation_period);
        var end_of_query = "";

        // dynamic filtering wooo!! so we'll always have a date, but- 
        switch(promotional_offer_candidate){
            case "true":
                end_of_query += " HAVING Good_Promotion = TRUE";
                break;
            case "false":
                end_of_query += " HAVING Good_Promotion = FALSE";
                break;
            default: // no filtering added
                break;
        }

        // add filtering for members if it was asked for
        switch(members_only){
            case "true":
                if(promotional_offer_candidate != "all"){
                    end_of_query += " AND Currently_Member = TRUE";
                    break;
                }
                end_of_query += " HAVING Currently_Member = TRUE";
                break;
            case "false":
                if(promotional_offer_candidate != "all"){
                    end_of_query += " AND Currently_Member = FALSE";
                    break;
                }
                end_of_query += " HAVING Currently_Member = FALSE";
                break;
            default: // no filtering added
                break;
        }

        // if you're reading this code, I'd like to extend a formal apology to you. 
        // this query is a mess but it worked when I tried it :(
        const [ rows ] = await db.query(queries.customer_report_info+end_of_query, [timeframe]);

        // log that a manager generated a report
        await db.query(queries.new_history_log, [email, "Report Generated", "Customers", 0, "Manager has generated the Customer Info Report."]);

        // Return report to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching reviews: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the customer report.' }));
    }
}

module.exports = {giftshop_sales_report, giftshop_aggregate, aggregate_finance_report, change_history_report, customer_info_report};