const http = require('http');
const verifyToken = require('../middleware/authMiddleware');
const { getAllEmployees, getEmployee, deleteEmployee, createEmployee, updateEmployee } = require('../controllers/manageEmployeesController');
// Require controllers later...

const manageEmployeeRoutes = async (req, res) => {

    const email = req.url.split('/')[2];
    console.log(req.url);

    if (req.url === '/employees' && req.method === 'GET') {
        verifyToken('Manager')(req, res, () => {
            getAllEmployees(req, res);
        });
    } else if (req.url === '/employees' && req.method === 'POST') {
        verifyToken('Manager')(req, res, () => {
            createEmployee(req, res);
        });
    } else if (req.url.startsWith('/employees/') && req.method === 'GET' && email) {      
        verifyToken('Manager')(req, res, () => {
            getEmployee(req, res, email);
        }); 
    } else if (req.url.startsWith('/employees/') && req.method === 'PUT' && email) {
        verifyToken('Manager')(req, res, () => {
            updateEmployee(req, res);
        });
    } else if (req.url.startsWith('/employees/') && req.method === 'DELETE' && email) {
        verifyToken('Manager')(req, res, () => {
            deleteEmployee(req, res, email);
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found.' }));
    }
}

module.exports = manageEmployeeRoutes;