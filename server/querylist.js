// A list of all the queries we need and which controller file it's used in

// First up, login/auth-controller - user oriented queries
const user_exists_query = "SELECT UserPass, UserRole FROM logininfo WHERE Email = ?";
const create_user_query = "INSERT INTO logininfo (Email, UserPass, UserRole) VALUES (?, ?, ?)";
const create_customer_acc = "INSERT INTO customers (FirstName, LastName, UserID) VALUES (?, ?, ?)";
const create_new_employee = "UPDATE logininfo SET UserRole = 'Employee' WHERE Email = ?";
const downgrade_employee = "UPDATE logininfo SET UserRole = 'Customer' WHERE Email = ?";

// Artwork Management Controller - artwork oriented queries
const get_artwork_query = "SELECT * FROM artworks WHERE isDeleted = false";
const get_specific_art = "SELECT * FROM artworks WHERE ArtID = ? AND isDeleted = false";
const get_collection_art = "SELECT * FROM artworks WHERE (Collection = ? OR Collection IS NULL) AND isDeleted = false AND OnDisplay = true";
const get_name_specific_art = "SELECT * FROM artworks WHERE ArtName = ? AND isDeleted = false";
const insert_art_piece = "INSERT INTO artworks (ArtName, Artist, DateMade, ArtType, ArtVal, Collection, ArtDesc, ArtPic, OnDisplay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
const mark_art_for_deletion = "UPDATE artworks SET isDeleted = true WHERE ArtID = ? AND isDeleted = false";
const update_art_piece = "UPDATE artworks SET ArtName = ?, Artist = ?, DateMade = ?, ArtType = ?, ArtVal = ?, Collection = ?, ArtDesc = ?, ArtPic = ?, OnDisplay = ? WHERE ArtID = ? AND isDeleted = false";

// Employee Management Controller
const get_employee_query = "SELECT * FROM employees WHERE isDeleted = false";
const get_email_specific_emp = "SELECT * FROM employees WHERE Email = ? AND isDeleted = false";
const mark_emp_for_deletion = "UPDATE employees SET isDeleted = true WHERE Email = ? AND isDeleted = false";
const get_manager_query = "SELECT ManagerID FROM managers, logininfo WHERE logininfo.Email = ? AND logininfo.UserID = managers.UserID";
const insert_employee_info = "INSERT INTO employees (FirstName, LastName, BirthDate, EPosition, GiftShopName, ManagerID, Gender, Email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
const update_employee_info = "UPDATE employees SET HourlyWage = ?, WeeklyHours = ?, FirstName = ?, LastName = ?, BirthDate = ?, EPosition = ?, ExhibitID = ?, GiftShopName = ?, ManagerID = ?, Gender = ? WHERE Email = ? AND isDeleted = false";
// if an employee is being reinstated, use these two commands
const check_employee_exist = "SELECT * FROM employees WHERE Email = ? AND isDeleted = TRUE";
const reinstate_employee_info = "UPDATE employees SET FirstName = ?, LastName = ?, BirthDate = ?, EPosition = ?, GiftShopName = ?, ManagerID = ?, Gender = ?, isDeleted = FALSE WHERE Email = ?";
// remove their customer profile on creation - I'm using delete here since the information is the same, it just moves tables entirely.
const remove_customer_profile = "UPDATE customers JOIN logininfo ON customers.UserID = logininfo.UserID SET isDeleted = TRUE WHERE logininfo.email = ?";
const reinstate_customer_profile = "UPDATE customers JOIN logininfo ON customers.UserID = logininfo.UserID SET FirstName = ?, LastName = ?, BirthDate = ?, Gender = ?, isDeleted = FALSE WHERE logininfo.email = ?";

// Collections Management Controller
const get_collections_query = "SELECT * FROM collections WHERE isDeleted = false";
const get_specific_collection = "SELECT * FROM collections WHERE Title = ? AND isDeleted = false";
const get_exhibit_collections = "SELECT * FROM collections WHERE (ExhibitID = ? OR ExhibitID IS NULL) AND isDeleted = false";
const insert_new_collection = "INSERT INTO collections (Title, CollectDesc, CollectPic, ExhibitID) VALUES (?, ?, ?, ?)";
const mark_collection_delete = "UPDATE collections SET isDeleted = true WHERE Title = ? AND isDeleted = false";
const update_collection_query = "UPDATE collections SET CollectDesc = ?, CollectPic = ?, ExhibitID = ? WHERE Title = ? AND isDeleted = false";

// Exhibits Management Controller (very very long)
const get_all_exhibits = 
    `SELECT 
	exhibits.ExhibitID, ExhibitName, ExhibitDesc, ExhibitPic, 
    StartDate, EndDate, Fee, 
    CASE
        WHEN specialexhibits.ExhibitID IS NULL THEN FALSE
        ELSE TRUE
	END AS IsSpecial
    FROM exhibits 
    LEFT JOIN specialexhibits ON exhibits.ExhibitID = specialexhibits.ExhibitID
    WHERE EndDate > CURDATE() OR EndDate IS NULL
    ORDER BY IsSpecial ASC`;

const get_specific_exhibit = //coalesce checks to see if the value IS NOT null, and uses it if it is indeed not null
    `SELECT 
	exhibits.ExhibitID, ExhibitName, ExhibitDesc, ExhibitPic,
	StartDate, EndDate, Fee,
	CASE
		WHEN specialexhibits.ExhibitID IS NULL THEN FALSE
		ELSE TRUE
	END AS IsSpecial
	FROM
	exhibits
	LEFT JOIN specialexhibits ON exhibits.ExhibitID = specialexhibits.ExhibitID
	WHERE
	exhibits.ExhibitID = ?;`

const create_exhibit = "INSERT INTO exhibits (ExhibitName, ExhibitDesc, ExhibitPic) VALUES (?, ?, ?)";
const create_special_exhibit = "INSERT INTO specialexhibits (ExhibitID, StartDate, EndDate, Fee) VALUES (?, ?, ?, ?)";
const update_exhibit = "UPDATE exhibits SET ExhibitName = ?, ExhibitDesc = ?, ExhibitPic = ? WHERE ExhibitID = ?";
const update_special_exhibit = "UPDATE specialexhibits SET StartDate = ?, EndDate = ?, Fee = ? WHERE ExhibitID = ?";

// Donations Controller
const get_all_donations = "SELECT DonationID, CONCAT(customers.FirstName, ' ', customers.LastName) AS DonatorName, DonateDate, DonateAmt, DonateDesc FROM donations, customers WHERE customers.CustomerID = donations.CustomerID";
const get_specific_dons = "SELECT DonateDate, DonateAmt, DonateDesc FROM donations, logininfo, customers WHERE logininfo.email = ? AND logininfo.UserID = customers.userID AND customers.customerID = donations.customerID";
const add_new_donation = `INSERT INTO donations (CustomerID, DonateDate, DonateAmt, DonateDesc) 
                            VALUES ((SELECT CustomerID FROM logininfo, customers WHERE logininfo.Email = ? AND logininfo.UserID = customers.UserID), ?, ?, ?)`;

// Item and Ticket Controller : )
const get_all_normal_items = "SELECT * FROM items WHERE isDeleted = false AND ItemID NOT IN (1, 2, 3, 4)";
const get_a_normal_item = "SELECT * FROM items WHERE isDeleted = false AND ItemID = ?";
const get_all_tickets = "SELECT ItemID, ItemName, ItemPrice, AmountInStock, isPurchasable FROM items WHERE ItemID IN (1, 2, 3, 4)";
const get_specific_ticket = "SELECT * FROM items WHERE ItemID = ? AND ItemID IN (1, 2, 3, 4)";
const insert_new_item = "INSERT INTO items (ItemName, AmountSold, ItemPrice, ItemImage, AmountInStock, GiftShopName) VALUES (?, 0, ?, ?, ?, 'Museum Gift Shop')";
const delete_item = "UPDATE items SET isDeleted = true WHERE ItemID = ? AND isDeleted = false AND ItemID NOT IN (1, 2, 3, 4)";
const update_item = "UPDATE items SET ItemName = ?, ItemPrice = ?, ItemImage = ?, GiftShopName = ? WHERE ItemID = ? AND isDeleted = false";
const restock_item = "UPDATE items SET AmountInStock = AmountInStock + ? WHERE ItemID = ? AND isDeleted = false";

// Transaction Controller - one query to add a new transaction
const new_transaction = "INSERT INTO sales (ItemID, CustomerID, Quantity, DatePurchased) VALUES (?, (SELECT CustomerID FROM logininfo JOIN customers ON logininfo.UserID = customers.UserID WHERE logininfo.Email = ?), ?, ?)";
const specific_transaction = "SELECT FinalPrice FROM Sales WHERE PurchaseID = ?";

// User Profile Queries
const get_user_profile = `SELECT 
		customers.CustomerID, 
		FirstName, LastName, BirthDate, Gender, 
		DateOfExpiration, isRenewing, YearsOfMembership,
		CASE
            WHEN DateOfExpiration IS NULL THEN FALSE
            ELSE TRUE
        	END AS isMember
		FROM logininfo, customers 
		LEFT JOIN membership ON customers.CustomerID = membership.CustomerID 
		WHERE logininfo.Email = ? AND customers.UserID = logininfo.UserID`;
const update_user_profile = "UPDATE customers INNER JOIN logininfo ON logininfo.UserID = customers.UserID SET customers.FirstName = ?, customers.LastName = ?, customers.BirthDate = ?, customers.Gender = ? WHERE logininfo.Email = ?";
// User Profiles - membership stuff
const get_user_member_info = "SELECT m.CustomerID, m.DateOfExpiration, m.IsRenewing, M.YearsOfMembership FROM membership AS m JOIN customers ON m.CustomerID = customers.CustomerID JOIN logininfo ON customers.UserID = logininfo.UserID WHERE logininfo.email = ?"
const insert_new_member = "INSERT INTO membership (CustomerID, DateOfExpiration) VALUES (?, ?)"
const renew_without_expire = "UPDATE membership SET isRenewing = TRUE WHERE CustomerID = ?";
const renew_with_expire = "UPDATE membership SET isRenewing = TRUE, DateOfExpiration = ?, YearsOfMembership = YearsOfMembership+1 WHERE CustomerID = ?";
const cancel_membership = "UPDATE membership SET isRenewing = FALSE WHERE CustomerID = ?"

// All Review Queries
const get_all_reviews = "SELECT reviews.CustomerID, CONCAT(customers.FirstName, ' ', customers.LastName) as Name, reviews.StarCount, reviews.ReviewDesc, reviews.ReviewDate FROM reviews, customers WHERE customers.CustomerID = reviews.CustomerID";
const get_user_review = "SELECT reviews.CustomerID, reviews.StarCount, reviews.ReviewDesc, reviews.ReviewDate FROM reviews, logininfo, customers WHERE logininfo.Email = ? AND customers.UserID = logininfo.UserID AND customers.CustomerID = reviews.CustomerID"
const new_user_review = `INSERT INTO reviews (CustomerID, StarCount, ReviewDesc, ReviewDate) 
                            VALUES ((SELECT CustomerID FROM logininfo, customers WHERE logininfo.Email = ? AND logininfo.UserID = customers.UserID), ?, ?, ?)`;
const update_review = "UPDATE reviews INNER JOIN customers ON reviews.CustomerID = customers.CustomerID INNER JOIN logininfo ON logininfo.UserID = customers.UserID SET reviews.StarCount = ?, reviews.ReviewDesc = ?, reviews.ReviewDate = ? WHERE logininfo.Email = ?";

// A report that gets information on events
const get_all_events = "SELECT * FROM eventlist WHERE isDeleted = false AND EventDate >= CURDATE()"; 
const get_specific_event = "SELECT * FROM eventlist WHERE isDeleted = false AND EventID = ?";
const get_event_employees = "SELECT employees.EmployeeID, CONCAT(employees.FirstName, ' ', employees.LastName) AS EmployeeName, employees.Email, eventworkers.EventID FROM eventworkers, employees WHERE EventID = ? AND eventworkers.EmployeeID = employees.EmployeeID AND employees.isDeleted = FALSE";
const cancel_event = "UPDATE eventlist SET isDeleted = TRUE WHERE EventID = ?";
const create_event = "INSERT INTO eventlist (EventName, EventDesc, EventDate, EventPic, MemberOnly) VALUES (?, ?, ?, ?, ?)";
const add_event_employee = "INSERT INTO eventworkers (EventID, EmployeeID) VALUES (?, (SELECT EmployeeID FROM employees WHERE employees.Email = ? AND isDeleted = FALSE))";
const update_event = "UPDATE eventlist SET EventName = ?, EventDesc = ?, EventDate = ?, EventPic = ?, MemberOnly = ? WHERE EventID = ?";
// this is one of the only actual delete command in the whole DB - the history table will track when an employee gets unassigned, so no information is actually lost, but the table will actually remove things 
const remove_event_employee = "DELETE FROM eventworkers WHERE EventID = ? AND EmployeeID = (SELECT EmployeeID FROM employees WHERE employees.Email = ? AND isDeleted = FALSE)";

// history table command - incredibly important never touch these without asking Ash please!!
const new_history_log = "INSERT INTO allhistory (UserID, ActionType, EffectedTable, EffectedEntry, DescOfAction) VALUES ((SELECT UserID FROM logininfo WHERE Email = ?), ?, ?, ?, ?)";

// All report queries (for the report controller)
// REPORT QUERY #1 -- gets all transactions, including tickets. 
const all_sales_report = `SELECT
            s.PurchaseID as TransactionID,
			CONCAT(c.FirstName, ' ', c.LastName) as CustomerName, 
			i.ItemName as ItemName,
			s.Quantity as ItemQuantity,
			s.FinalPrice as FinalPrice,
			s.DatePurchased as DateofSale
			FROM 
			customers AS c,
			items AS i,
			sales AS s
			WHERE
			s.CustomerID = c.CustomerID
			AND
			s.ItemID = i.ItemID
            AND 
            i.ItemID NOT IN (1, 2, 3, 4)
            AND 
            s.DatePurchased >= ?
            ORDER BY s.DatePurchased DESC`;

const all_sales_aggregate = `SELECT 
            COUNT(s.PurchaseID) as TransactionCount,
            SUM(s.Quantity) as TotalQuantity, 
            SUM(s.FinalPrice) as TotalPrice
            FROM 
            Sales as s
            WHERE
            s.DatePurchased >= ?
            AND
            ItemID NOT IN (1, 2, 3, 4)`;

// REPORT QUERY #2 - A report that gets information on all the customers in the museum. Date of their last visit, total amount spent (donations + items + tickets + membership), etc.
const customer_report_info = `SELECT
        c.CustomerID as Customer_ID,
        CONCAT(c.FirstName, ' ', c.LastName) as Customer_Name,
        li.email as Customer_Email,
        CASE
            WHEN DateOfExpiration IS NULL then FALSE
            ELSE TRUE
        END AS Currently_Member,
        MIN(ah.TimestampAction) AS Account_Creation_Date,
        COALESCE((SELECT SUM(s.FinalPrice)
	        FROM sales AS s
            WHERE
            s.CustomerID = c.CustomerID), 0)
        + 
        COALESCE((SELECT SUM(d.DonateAmt) 
	        FROM donations as d
            WHERE
            d.CustomerID = c.CustomerID), 0)
        +
        COALESCE((SELECT YearsOfMembership*100
	        FROM membership as m
            WHERE
            m.CustomerID = c.CustomerID), 0) AS Total_Amount_Spent,
        (SELECT MAX(s.DatePurchased)
	        FROM sales as S
            WHERE
            s.CustomerID = c.CustomerID
            AND
            s.ItemID IN (1, 2, 3, 4)) AS Last_Visit_Date,
        CASE
	        WHEN (SELECT MAX(s.DatePurchased)
	        FROM sales as s
            WHERE
            s.CustomerID = c.CustomerID
            AND
            s.ItemID IN (1, 2, 3, 4)) <= CURDATE() - INTERVAL 1 MONTH 
            AND
            (SELECT COUNT(DISTINCT DATE(s2.DatePurchased)) 
            FROM sales AS s2
            WHERE 
            s2.ItemID IN (1, 2, 3, 4)
            AND
            s2.CustomerID = c.CustomerID) >= 2 THEN TRUE
            ELSE FALSE
        END AS Good_Promotion
        FROM
        customers AS c
        LEFT JOIN
        logininfo AS li
        ON 
        c.UserID = li.UserID
        LEFT JOIN
        membership as m
        ON
        c.CustomerID = m.CustomerID
        LEFT JOIN
        allhistory AS ah 
        ON 
            c.CustomerID = CAST(ah.EffectedEntry AS SIGNED)
            AND ah.EffectedTable = 'Customers'
            AND ah.ActionType = 'Created'
        WHERE
        li.UserRole = "Customer"
        AND
        ah.TimestampAction > ?
        GROUP BY c.CustomerID`; // Groups it into a bunch of groups of size 1 that let the function work -- added dynamically at the end of the query
    // First question mark: account creation date > time
    // Then it groups by customers having two criterium defined earlier 
    // If I get asked to explain this query, I will take 10 minutes but I will do it :')

// REPORT QUERY #3 -- report that gets the history of the mueseum - dynamic filtering
const change_history_report = `SELECT
            ah.HistoryID as TableKey,
            CONCAT(COALESCE(m.FirstName, e.FirstName, c.FirstName), ' ', COALESCE(m.LastName, e.LastName, c.LastName)) AS Action_Done_By,
            li.Email AS Email,
            ah.ActionType AS Type_Of_Action,
            ah.EffectedTable AS Table_Impacted,
            ah.EffectedEntry AS PK_Effected,
            ah.DescOfAction AS Description,
            ah.TimestampAction AS Date_Time_Happened
        FROM
            allhistory AS ah,
            logininfo AS li
        LEFT JOIN
            Managers AS m ON li.UserID = m.UserID
        LEFT JOIN
            Employees AS e ON li.Email = e.Email
        LEFT JOIN
            Customers AS c ON li.UserID = c.UserID
        WHERE
            ah.UserID = li.UserID`;


// REPORT QUERY #4 -- report that calculates how long exhibits have been running, how much the employees in that exhibit cost per week, and how many employees are in it
const weekly_exhibit_cost = `SELECT 
		ex.ExhibitID as Exhibit_ID,
		ex.ExhibitName as Exhibit_Name, 
	CASE
		WHEN se.ExhibitID IS NULL THEN FALSE
		ELSE TRUE
	END AS Is_Special_Exhibit,
    CASE 
		WHEN se.ExhibitID IS NOT NULL AND se.EndDate < CURDATE() THEN "Ended"
        WHEN se.ExhibitID IS NOT NULL AND se.StartDate > CURDATE() THEN "Has Not Started"
        WHEN se.ExhibitID IS NULL THEN "N/A"
        ELSE "Ongoing"
    END AS Running_Status,
    COUNT(em.EmployeeID) AS Total_Employees,
    SUM(em.HourlyWage * em.WeeklyHours) AS Weekly_Exhibit_Cost,
    CASE
		WHEN se.ExhibitID IS NULL THEN FLOOR((DATEDIFF(CURDATE(), ah.TimestampAction))/7)
        WHEN se.ExhibitID IS NOT NULL AND se.StartDate > CURDATE() THEN 0
        WHEN se.ExhibitID IS NOT NULL AND se.EndDate < CURDATE() THEN FLOOR(DATEDIFF(se.EndDate, se.StartDate)/7)
        ELSE FLOOR(DATEDIFF(CURDATE(), se.StartDate)/7)
	END AS Weeks_Active
FROM
	exhibits as ex
LEFT JOIN 
	specialexhibits as se
ON 
	ex.ExhibitID = se.ExhibitID
LEFT JOIN
	employees as em
ON 
	ex.ExhibitID = em.ExhibitID AND em.isDeleted = FALSE
LEFT JOIN
	allhistory as ah
ON
	ah.ActionType = "Created" AND ah.EffectedTable = "Exhibits" AND  ex.ExhibitID = CAST(ah.EffectedEntry AS SIGNED)`;

// all the queries exported out
module.exports = {
    user_exists_query,
    create_user_query,
    create_customer_acc,
    create_new_employee,
    downgrade_employee,
    get_artwork_query,
    get_specific_art,
    get_collection_art,
    get_name_specific_art,
    insert_art_piece,
    mark_art_for_deletion,
    update_art_piece,
    get_employee_query,
    get_email_specific_emp,
    mark_emp_for_deletion,
    get_manager_query,
    insert_employee_info,
    update_employee_info,
    check_employee_exist,
    reinstate_employee_info,
    remove_customer_profile,
    reinstate_customer_profile,
    get_collections_query,
    get_specific_collection,
    get_exhibit_collections,
    insert_new_collection,
    mark_collection_delete,
    update_collection_query,
    get_all_exhibits,
    get_specific_exhibit,
    create_exhibit,
    create_special_exhibit,
    update_exhibit,
    update_special_exhibit,
    get_all_donations,
    get_specific_dons,
    add_new_donation,
    get_all_normal_items,
    get_a_normal_item,
    get_all_tickets,
    get_specific_ticket,
    insert_new_item,
    delete_item,
    update_item,
    restock_item,
    new_transaction,
    specific_transaction,
    get_user_profile,
    update_user_profile,
    get_user_member_info,
    insert_new_member,
    renew_without_expire,
    renew_with_expire,
    cancel_membership,
    get_all_reviews,
    get_user_review,
    new_user_review,
    update_review,
    get_all_events,
    get_specific_event,
    get_event_employees,
    cancel_event,
    create_event,
    add_event_employee,
    update_event,
    remove_event_employee,
    new_history_log,
    all_sales_report,
    all_sales_aggregate,
    customer_report_info,
    change_history_report,
    weekly_exhibit_cost
};