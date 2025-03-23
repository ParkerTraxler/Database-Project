// A list of all the queries we need and which controller file it's used in

// First up, login/auth-controller - user oriented queries
const user_exists_query = "SELECT UserPass, UserRole FROM logininfo WHERE Email = ?";
const create_user_query = "INSERT INTO logininfo (Email, UserPass, UserRole) VALUES (?, ?, ?)";
const create_new_employee = "UPDATE logininfo SET UserRole = 'Employee' WHERE Email = ? AND isDeleted = false";
const downgrade_employee = "UPDATE logininfo SET UserRole = 'Customer' WHERE Email = ? AND isDeleted = false";

// Artwork Management Controller - artwork oriented queries
const get_artwork_query = "SELECT * FROM artworks WHERE isDeleted = false";
const get_specific_art = "SELECT * FROM artworks WHERE ArtID = ? AND isDeleted = false";
const get_name_specific_art = "SELECT * FROM artworks WHERE ArtName = ? AND isDeleted = false";
const insert_art_piece = "INSERT INTO artworks (ArtName, Artist, DateMade, ArtRype, ArtVal, Collection, ArtDesc, ArtPic, OnDisplay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
const mark_art_for_deletion = "UPDATE artworks SET isDeleted = true WHERE ArtID = ? AND isDeleted = false";
const update_art_piece = "UPDATE artworks SET ArtName = ?, Artist = ?, DateMade = ?, ArtType = ?, ArtVal = ?, Collection = ?, ArtDesc = ?, ArtPic = ?, OnDisplay = ? WHERE ArtID = ? AND isDeleted = false";

// Employee Management Controller
const get_employee_query = "SELECT * FROM employees WHERE isDeleted = false";
const get_email_specific_emp = "SELECT * FROM employees WHERE Email = ? AND isDeleted = false";
const mark_emp_for_deletion = "UPDATE employees SET isDeleted = true WHERE Email = ? AND isDeleted = false";
const get_manager_query = "SELECT ManagerID FROM managers, logininfo WHERE logininfo.Email = ? AND logininfo.UserID = managers.UserID";
const insert_employee_info = "INSERT INTO employees (FirstName, LastName, EPosition, ManagerID, Email) VALUES (?, ?, ?, ?, ?)";
const update_employee_info = "UPDATE employees SET HourlyWage = ?, WeeklyHours = ?, FirstName = ?, LastName = ?, BirthDate = ?, EPosition = ?, ExhibitID = ?, GiftShopName = ?, ManagerID = ?, Gender = ? WHERE Email = ? AND isDeleted = false";

// all the queries exported out
module.exports = {
    user_exists_query,
    create_user_query,
    create_new_employee,
    downgrade_employee,
    get_artwork_query,
    get_specific_art,
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
};