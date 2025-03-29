import React, { useState, useEffect } from 'react';
import ManagerNav from './ManagerNav';
import axios from 'axios'; // API calls
import { useAuth } from '../utils/AuthContext';

import './ManagerDashboard.css';
import './EmployeeExhibitReport.css';

const EmployeeExhibitReport = () => {
    console.log("EmployeeExhibitReport");

    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [exhibitFilter, setExhibitFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const { user } = useAuth();
    const token = user.token;
    console.log("token: " + token);

    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                const res = await axios.get("http://localhost:3002/employees/report", {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    },
                });
                console.log(res.data);
                setEmployees(res.data);
                setFilteredEmployees(res.data); // Initialize with the full employee list
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllEmployees();
    }, [token]);

    const handleExhibitChange = (e) => {
        const selectedExhibit = e.target.value;
        setExhibitFilter(selectedExhibit);
        filterEmployees(selectedExhibit, searchTerm);
    };

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        filterEmployees(exhibitFilter, newSearchTerm);
    };

    const filterEmployees = (exhibit, name) => {
        let filteredList = employees;

        if (exhibit) {
            filteredList = filteredList.filter(employee => employee.Exhibit_Name === exhibit);
        }
        if (name) {
            filteredList = filteredList.filter(employee =>
                employee.Employee_Name.toLowerCase().includes(name.toLowerCase())
            );
        }
        setFilteredEmployees(filteredList);
    };

    // Extract unique exhibit names for the filter dropdown
    const exhibitNames = [...new Set(employees.map(employee => employee.Exhibit_Name))];

    return (
        <div className="managerView">
            <div>
                <ManagerNav />
            </div>
            <div className = "report-section">
                <h1 className="header">Employee Exhibit Report</h1>

                {/* Search Bar for Employee Name */}
                <input
                    type="text"
                    placeholder="Search by employee name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />

                {/* Exhibit Filter Dropdown */}
                <label htmlFor="exhibitFilter">Filter by Exhibit:</label>
                <select id="exhibitFilter" value={exhibitFilter} onChange={handleExhibitChange} className="filter-select">
                    <option value="">All Exhibits</option>
                    {exhibitNames.map(exhibit => (
                        <option key={exhibit} value={exhibit}>
                            {exhibit}
                        </option>
                    ))}
                </select>

                <table className="info-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>ID</th>
                            <th>Weekly Wage</th>
                            <th>Exhibit</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(employee => (
                            <tr key={employee.EmployeeID}>
                                <td>{employee.Employee_Name}</td>
                                <td>{employee.Employee_Email}</td>
                                <td>{employee.Employee_ID}</td>
                                <td>{employee.Employee_Weekly_Wage}</td>
                                <td>{employee.Exhibit_Name}</td>
                                <td>{employee.Employee_Active == "1" ? "True" : "False"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeExhibitReport;
