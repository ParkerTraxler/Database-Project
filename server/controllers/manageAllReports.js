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
        console.error('Error fetching giftshop sales report: ', err);
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
        console.error('Error fetching giftshop aggregate report: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the giftshop aggregate report.' }));
    }
}

const exhibit_cost_report = async (req, res, email, upper_cost, lower_cost, exhibit_type) =>{
    try{
        var end_of_query = "";

        // handle if there's event filtering
        if(exhibit_type != "all"){
            end_of_query += " WHERE"

            if(exhibit_type == "special"){
                end_of_query += " se.ExhibitID IS NOT NULL";
            }

            else if(exhibit_type == "normal"){
                end_of_query += " se.ExhibitID IS NULL"
            }
        }

        end_of_query += ` GROUP BY ex.ExhibitID, ah.TimestampAction`

        // handle if there's an upper bound and a lower bound, or an upper bound with no lower bound
        if(upper_cost != "all"){
            end_of_query += ` HAVING SUM(em.HourlyWage * em.WeeklyHours) <= ${parseInt(upper_cost)}`
            if(lower_cost != "all"){
                end_of_query += ` AND SUM(em.HourlyWage * em.WeeklyHours) >= ${parseInt(lower_cost)}`
            }
        }
        // handle if there's a lower bound with no upper bound
        else{
            if(lower_cost != "all"){
                end_of_query += ` HAVING SUM(em.HourlyWage * em.WeeklyHours) >= ${parseInt(lower_cost)}`;
            }
        }

        
        // SQL QUERY - get the report 
        const [ rows ] = await db.query(queries.weekly_exhibit_cost+end_of_query);

        // Return report to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err){
        console.error('Error fetching exhibit cost report: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the exhibit weekly cost report.' }));
    }
}

const change_history_report = async (req, res, email, from_date, to_date, action_type, effected_table) =>{
    try{
        var end_of_query = "";
        // Start by converting the from and to dates
        if(from_date != "all"){
            from_date = new Date(from_date);
            to_date = new Date(to_date);
            from_date.setHours(0, 0, 0, 0);
            to_date.setHours(23, 59, 59, 999);
            const final_from_date = from_date.toISOString().slice(0, 19).replace('T', ' ');
            const final_to_date = to_date.toISOString().slice(0, 19).replace('T', ' ');
            end_of_query += ` AND ah.TimestampAction >= "${final_from_date}" AND ah.TimestampAction <= "${final_to_date}"`;
        }
        if(action_type != "any"){
            end_of_query += ` AND ah.ActionType = "${action_type}"`
        }
        if(effected_table != "all"){
            end_of_query += ` AND ah.EffectedTable = "${effected_table}"`
        }

        end_of_query += " ORDER BY ah.TimestampAction DESC"

        const [ rows ] = await db.query(queries.change_history_report+end_of_query);

        // log that a manager generated a report
        await db.query(queries.new_history_log, [email, "Report Generated", "Sales", 0, "Manager has generated the Giftshop Sales Report."]);

        // Return reviews to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));

    } catch (err) {
        console.error('Error fetching change history report: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the museum changes history report.' }));
    }
}

const customer_info_report = async(req, res, email, account_creation_period, promotional_offer_candidate, members_only) =>{
    try{
        var timeframe = get_timeframe(account_creation_period);
        var end_of_query = "";

        // dynamic filtering wooo!! so we'll always have a date, but- 
        switch(promotional_offer_candidate){
            case "true":
                end_of_query += " AND Good_Promotion = TRUE";
                break;
            case "false":
                end_of_query += " AND Good_Promotion = FALSE";
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
                end_of_query += " AND Currently_Member = TRUE";
                break;
            case "false":
                if(promotional_offer_candidate != "all"){
                    end_of_query += " AND Currently_Member = FALSE";
                    break;
                }
                end_of_query += " AND Currently_Member = FALSE";
                break;
            default: // no filtering added
                break;
        }

        end_of_query += " ORDER BY c.LastName asc, c.FirstName asc"

        // if you're reading this code, I'd like to extend a formal apology to you. 
        // this query is a mess but it worked when I tried it :(
        const [ rows ] = await db.query(queries.customer_report_info+end_of_query, [timeframe]);

        // log that a manager generated a report
        await db.query(queries.new_history_log, [email, "Report Generated", "Customers", 0, "Manager has generated the Customer Info Report."]);

        // Return report to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(rows));
    } catch (err) {
        console.error('Error fetching customer report: ', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error fetching the customer report.' }));
    }
}

module.exports = {giftshop_sales_report, giftshop_aggregate, exhibit_cost_report, change_history_report, customer_info_report};