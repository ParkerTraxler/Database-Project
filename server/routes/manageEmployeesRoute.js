const http = require('http');
const verifyToken = require('../middleware/authMiddleware');
const { getAllEmployees, getEmployee, deleteEmployee, createEmployee, updateEmployee } = require('../controllers/manageEmployeesController');
// Require controllers later...

const manageEmployeeRoutes = async (req, res) => {

    console.log(req.url);

    if (req.url === '/employees' && req.method === 'GET') {
        verifyToken('Manager')(req, res, () => {
            getAllEmployees(req, res);
        });
    } else if (req.url === '/employees' && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            createEmployee(req, res);
        });
    } else if (req.url.startsWith('/employees/') && req.method === 'GET') {      
        verifyToken('Manager')(req, res, () => {
            getEmployee(req, res);
        }); 
    } else if (req.url.startsWith('/employees/') && req.method === 'PUT') {
        verifyToken('Manager')(req, res, () => {
            updateEmployee(req, res);
        });
    } else if (req.url.startsWith('/employees/') && req.method === 'DELETE') {
        verifyToken('Manager')(req, res, () => {
            deleteEmployee(req, res);
        });
    }
}

module.exports = manageEmployeeRoutes;