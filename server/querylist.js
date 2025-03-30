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
const get_collection_art = "SELECT * FROM artworks WHERE Collection = ? AND isDeleted = false AND OnDisplay = true";
const get_name_specific_art = "SELECT * FROM artworks WHERE ArtName = ? AND isDeleted = false";
const insert_art_piece = "INSERT INTO artworks (ArtName, Artist, DateMade, ArtType, ArtVal, Collection, ArtDesc, ArtPic, OnDisplay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
const mark_art_for_deletion = "UPDATE artworks SET isDeleted = true WHERE ArtID = ? AND isDeleted = false";
const update_art_piece = "UPDATE artworks SET ArtName = ?, Artist = ?, DateMade = ?, ArtType = ?, ArtVal = ?, Collection = ?, ArtDesc = ?, ArtPic = ?, OnDisplay = ? WHERE ArtID = ? AND isDeleted = false";

// Employee Management Controller
const get_employee_query = "SELECT * FROM employees WHERE isDeleted = false";
const get_email_specific_emp = "SELECT * FROM employees WHERE Email = ? AND isDeleted = false";
const mark_emp_for_deletion = "UPDATE employees SET isDeleted = true WHERE Email = ? AND isDeleted = false";
const get_manager_query = "SELECT ManagerID FROM managers, logininfo WHERE logininfo.Email = ? AND logininfo.UserID = managers.UserID";
const insert_employee_info = "INSERT INTO employees (FirstName, LastName, EPosition, GiftShopName, ManagerID, Email) VALUES (?, ?, ?, ?, ?, ?)";
const update_employee_info = "UPDATE employees SET HourlyWage = ?, WeeklyHours = ?, FirstName = ?, LastName = ?, BirthDate = ?, EPosition = ?, ExhibitID = ?, GiftShopName = ?, ManagerID = ?, Gender = ? WHERE Email = ? AND isDeleted = false";
// if an employee is being reinstated, use these two commands
const check_employee_exist = "SELECT * FROM employees WHERE Email = ? AND isDeleted = TRUE";
const reinstate_employee_info = "UPDATE employees SET FirstName = ?, LastName = ?, EPosition = ?, GiftShopName = ?, ManagerID = ?, isDeleted = FALSE WHERE Email = ?";
// remove their customer profile on creation - I'm using delete here since the information is the same, it just moves tables entirely.
const remove_customer_profile = "DELETE FROM customers JOIN logininfo ON customers.UserID = logininfo.UserID WHERE logininfo.email = ?";

// REPORT QUERY - report that gets all employees that work in exhibits, which exhibits, and whether they're active or not
const employee_exhibit_report = `SELECT 
            e.EmployeeID as Employee_ID,
            CONCAT(e.FirstName, ' ', e.LastName) as Employee_Name,
            e.Email as Employee_Email,
            e.HourlyWage * e.WeeklyHours as Employee_Weekly_Wage,
            ex.ExhibitName as Exhibit_Name,
            CASE
                WHEN e.isDeleted = FALSE THEN TRUE
                WHEN e.isDeleted = TRUE THEN FALSE
            END AS Employee_Active
            FROM
            employees as e,
            exhibits as ex
            WHERE
            e.ExhibitID = ex.ExhibitID
            ORDER BY ex.ExhibitID ASC, e.isDeleted ASC`;

// Collections Management Controller
const get_collections_query = "SELECT * FROM collections WHERE isDeleted = false";
const get_specific_collection = "SELECT * FROM collections WHERE Title = ? AND isDeleted = false";
const get_exhibit_collections = "SELECT * FROM artworks WHERE ExhibitID = ? AND isDeleted = false";
const insert_new_collection = "INSERT INTO collections (Title, CollectDesc, CollectPic, ExhibitID) VALUES (?, ?, ?, ?)";
const mark_collection_delete = "UPDATE collections SET isDeleted = true WHERE Title = ? AND isDeleted = false";
const update_collection_query = "UPDATE collections SET CollectDesc = ?, CollectPic = ?, ExhibitID = ? WHERE Title = ? AND isDeleted = false";

// Exhibits Management Controller (very very long)
const get_all_exhibits = 
    `SELECT exhibits.ExhibitID, ExhibitName, ExhibitDesc, ExhibitPic, NULL as StartDate, NULL as EndDate, NULL as Fee, FALSE as IsSpecial
    FROM exhibits 
    LEFT JOIN specialexhibits ON exhibits.ExhibitID = specialexhibits.ExhibitID 
    WHERE specialexhibits.ExhibitID IS NULL

    UNION

    SELECT exhibits.ExhibitID, ExhibitName, ExhibitDesc, ExhibitPic, StartDate, EndDate, Fee, TRUE as IsSpecial
    FROM exhibits, specialexhibits 
    WHERE exhibits.ExhibitID = specialexhibits.ExhibitID AND specialexhibits.EndDate >= CURDATE()`;

const get_specific_exhibit = //coalesce checks to see if the value IS NOT null, and uses it if it is indeed not null
    `SELECT 
        exhibits.ExhibitID,
        ExhibitName,
        ExhibitDesc,
        ExhibitPic,
        COALESCE(specialexhibits.StartDate, NULL) AS StartDate,
        COALESCE(specialexhibits.EndDate, NULL) AS EndDate,
        COALESCE(specialexhibits.Fee, NULL) AS Fee,
        CASE
            WHEN specialexhibits.ExhibitID IS NULL THEN FALSE
            ELSE TRUE
        END AS IsSpecial
    FROM
        exhibits
    LEFT JOIN specialexhibits ON exhibits.ExhibitID = specialexhibits.ExhibitID
    WHERE
        exhibits.ExhibitID = ?`

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
const get_all_tickets = "SELECT ItemID, ItemName, ItemPrice, AmountInStock FROM items WHERE ItemID IN (1, 2, 3, 4)";
const get_specific_ticket = "SELECT * FROM items WHERE ItemID = ? AND ItemID IN (1, 2, 3, 4)";
const insert_new_item = "INSERT INTO items (ItemName, AmountSold, ItemPrice, AmountInStock, GiftShopName) VALUES (?, 0, ?, ?, 'Museum Gift Shop')";
const delete_item = "UPDATE items SET isDeleted = true WHERE ItemID = ? AND isDeleted = false AND ItemID NOT IN (1, 2, 3, 4)";
const update_item = "UPDATE items SET ItemName = ?, ItemPrice = ?, GiftShopName = ? WHERE ItemID = ? AND isDeleted = false";
const restock_item = "UPDATE items SET AmountInStock = AmountInStock + ? WHERE ItemID = ? AND isDeleted = false";

// Transaction Controller - one query to add a new transaction
const new_transaction = "INSERT INTO sales (ItemID, CustomerID, Quantity, FinalPrice, DatePurchased) VALUES (?, (SELECT CustomerID FROM logininfo JOIN customers ON logininfo.UserID = customers.UserID WHERE logininfo.Email = ?), ?, ?, ?)";

// REPORT QUERY -- gets all transactions, including tickets. 
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
            ORDER BY s.DatePurchased DESC`;


// User Profile Queries
const get_user_profile = "SELECT Membership, FirstName, LastName, BirthDate, Gender FROM customers, logininfo WHERE logininfo.Email = ? AND customers.UserID = logininfo.UserID";
const update_user_profile = "UPDATE customers INNER JOIN logininfo ON logininfo.UserID = customers.UserID SET customers.FirstName = ?, customers.LastName = ?, customers.BirthDate = ?, customers.Gender = ? WHERE logininfo.Email = ?";
const update_membership = "UPDATE customers JOIN logininfo ON logininfo.UserID = customers.UserID SET customers.Membership = NOT customers.Membership WHERE logininfo.Email = ?";

// All Review Queries
const get_all_reviews = "SELECT reviews.CustomerID, CONCAT(customers.FirstName, ' ', customers.LastName) as Name, reviews.StarCount, reviews.ReviewDesc, reviews.ReviewDate FROM reviews, customers WHERE customers.CustomerID = reviews.CustomerID";
const get_user_review = "SELECT reviews.StarCount, reviews.ReviewDesc, reviews.ReviewDate FROM reviews, logininfo, customers WHERE logininfo.Email = ? AND customers.UserID = logininfo.UserID AND customers.CustomerID = reviews.CustomerID"
const new_user_review = `INSERT INTO reviews (CustomerID, StarCount, ReviewDesc, ReviewDate) 
                            VALUES ((SELECT CustomerID FROM logininfo, customers WHERE logininfo.Email = ? AND logininfo.UserID = customers.UserID), ?, ?, ?)`;
const update_review = "UPDATE reviews INNER JOIN customers ON reviews.CustomerID = customers.CustomerID INNER JOIN logininfo ON logininfo.UserID = customers.UserID SET reviews.StarCount = ?, reviews.ReviewDesc = ?, reviews.ReviewDate = ? WHERE logininfo.Email = ?";

// A report that gets information on events
const get_all_events = "SELECT * FROM eventlist WHERE isDeleted = false AND EventDate >= CURDATE()"; 
const get_specific_event = "SELECT * FROM eventlist WHERE isDeleted = false AND EventID = ?";
const get_event_employees = "SELECT employees.EmployeeID, CONCAT(employees.FirstName, ' ', employees.LastName) AS EmployeeName, employees.Email, eventworkers.EventID FROM eventworkers, employees WHERE EventID = ? AND eventworkers.EmployeeID = employees.EmployeeID AND employees.isDeleted = FALSE";
const cancel_event = "UPDATE eventlist SET isDeleted = TRUE WHERE EventID = ?";
const create_event = "INSERT INTO eventlist (EventName, EventDesc, EventDate, MemberOnly) VALUES (?, ?, ?, ?)";
const add_event_employee = "INSERT INTO eventworkers (EventID, EmployeeID) VALUES (?, (SELECT EmployeeID FROM employees WHERE employees.Email = ? AND isDeleted = FALSE))";
const update_event = "UPDATE eventlist SET EventName = ?, EventDesc = ?, EventDate = ?, MemberOnly = ? WHERE EventID = ?";
// this is one of the only actual delete command in the whole DB - the history table will track when an employee gets unassigned, so no information is actually lost, but the table will actually remove things 
const remove_event_employee = "DELETE FROM eventworkers WHERE EventID = ? AND EmployeeID = (SELECT EmployeeID FROM employees WHERE employees.Email = ? AND isDeleted = FALSE)";

// history table command - incredibly important never touch these without asking Ash please!!
const new_history_log = "INESRT INTO allhistory (UserID, ActionType, EffectedTable, EffectedEntry, DescOfAction) VALUES ((SELECT UserID FROM logininfo WHERE Email = ?), ?, ?, ?, ?)";

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
    all_sales_report,
    get_user_profile,
    update_user_profile,
    update_membership,
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
    employee_exhibit_report,
};