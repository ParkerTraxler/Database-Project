const http = require('http');
const verifyToken = require('../middleware/authMiddleware');
const { getAllEmployees, getEmployee, deleteEmployee, createEmployee, updateEmployee, updateSelfEmployee, getExhibitEmployees } = require('../controllers/manageEmployeesController');
// Require controllers later...

const manageEmployeeRoutes = async (req, res) => {

    console.log(req.url);

    if (req.url === '/employees' && req.method === 'GET') {
        verifyToken('Manager', null)(req, res, () => {
            getAllEmployees(req, res);
        });
    } else if (req.url === '/employees' && req.method === 'POST') {
        verifyToken('Manager', null)(req, res, () => {
            createEmployee(req, res);
        });
    } else if (req.url.startsWith('/employees/report') && req.method === 'GET'){
        verifyToken('Manager', null)(req, res, () => {
            getExhibitEmployees(req, res);
        });
    } else if (req.url.startsWith('/employees/ownacc') && req.method === 'GET'){
        verifyToken('Employee', null)(req, res, () => {
            const urlParts = req.url.split('/');
            const empEmail = decodeURIComponent(urlParts[urlParts.length - 1]);
            getEmployee(req, res, empEmail);
        }); 
     } else if (req.url.startsWith('/employees/') && req.method === 'GET') {      
        verifyToken('Manager', null)(req, res, () => {
            const urlParts = req.url.split('/');
            const empEmail = decodeURIComponent(urlParts[urlParts.length - 1]);
            getEmployee(req, res, empEmail);
        });
    } else if(req.url.startsWith('/employees/editacc') && req.method === 'PUT'){
        verifyToken('Employee', null)(req, res, () => {
            updateSelfEmployee(req, res);
        });
    } else if (req.url.startsWith('/employees/') && req.method === 'PUT') {
        verifyToken('Manager', null)(req, res, () => {
            updateEmployee(req, res);
        });
    } else if (req.url.startsWith('/employees/') && req.method === 'DELETE') {
        verifyToken('Manager', null)(req, res, () => {
            deleteEmployee(req, res);
        });
    }
}

module.exports = manageEmployeeRoutes;