import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios'; // API calls
import { useAuth } from '../utils/AuthContext';
import { jwtDecode } from 'jwt-decode';
import ManagerNav from './ManagerNav'

import './ManagerDashboard.css'

const CustomersReport = () => {
    console.log("CustomersReport")
    const [customers, setCustomers] = useState([]);
    const [timeRange, setTimeRange] = useState("alltime");
    const [memberFilter, setMemberFilter] = useState("all");
    const [promoFilter, setPromoFilter] = useState("all");
    const [reportGenerated, setReportGenerated] = useState(false);
    const { user } = useAuth();
    const token = user.token;
    console.log("token: " + token);
    const decoded = jwtDecode(token);
    const email = decoded.email;
    console.log(email)

    const fetchCustomers = async () => {
        console.log(email);
        console.log("Range: " + timeRange);
        console.log("Promo Filter: " + promoFilter);
        console.log("Member: " + memberFilter);
        try {
            console.log("GET Sent");
            const res = await axios.get(`http://localhost:3002/reports/customer-report/${encodeURIComponent(email)}/${timeRange}/${promoFilter}/${memberFilter}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                },
            });
            console.log("GET Completed");
            console.log(res.data);
            setCustomers(res.data);
            
            setReportGenerated(true);
        } catch (err) {
            console.log(err);
        }
    };
    

    return(
        
        
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
                <h1>Customer Report</h1>
                <label>Filter by time range: </label>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                    <option value="all-time">All Time</option>
                    <option value="last-day">Last Day</option>
                    <option value="last-week">Last Week</option>
                    <option value="last-month">Last Month</option>
                    <option value="last-quarter">Last Quarter</option>
                    <option value="last-year">Last Year</option>
                </select>
                <label>Filter by membership status:</label>
                <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}>
                    <option value="all">All Customers</option>
                    <option value="true">Members Only</option>
                    <option value="false">Non-Members Only</option>
                </select>
                <label>Filter by valid promotional targets:</label>
                <select value={promoFilter} onChange={(e) => setPromoFilter(e.target.value)}>
                    <option value="all">All Customers</option>
                    <option value="true">Valid Target</option>
                    <option value="false">Invalid Target</option>
                </select>
                <div>
                    <button onClick={fetchCustomers}>Generate Report</button>
                </div>
                {reportGenerated && (
                    <table>
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Customer Email</th>
                                <th>Amount Spent</th>
                                <th>Date of Last Visit</th>
                                <th>Membership Status</th>
                                <th>Date of Account Creation</th>
                                <th>Valid Promotional Target</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.Customer_ID}>
                                    <td>{customer.Customer_Name}</td>
                                    <td>{customer.Customer_Email}</td>
                                    <td>{"$" + customer.Total_Amount_Spent}</td>
                                    <td>{new Date(customer.Last_Visit_Date).toLocaleDateString()}</td>
                                    <td>{customer.Currently_Member ? "Member" : "Not a Member"}</td>
                                    <td>{new Date(customer.Account_Creation_Date).toLocaleDateString()}</td>
                                    <td>{customer.Good_Promotion ? "Valid Target" : "Invalid Target"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
        </div>
    )
}

export default CustomersReport