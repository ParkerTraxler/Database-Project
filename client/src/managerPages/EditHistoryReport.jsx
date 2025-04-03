import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios'; // API calls
import { useAuth } from '../utils/AuthContext';
import { jwtDecode } from 'jwt-decode';
import ManagerNav from './ManagerNav'

import './ManagerDashboard.css'

const EditHistoryReport = () => {
    console.log("EditHistoryReport")
    const [history, setHistory] = useState([]);
    const [timeRange, setTimeRange] = useState({
        startDate: "all",
        endDate: "all"
    });
    const [effectedTable, setEffectedTable] = useState("all");
    const [actionType, setActionType] = useState("any");
    const [reportGenerated, setReportGenerated] = useState(false);
    const { user } = useAuth();
    const token = user.token;
    console.log("token: " + token);
    const decoded = jwtDecode(token);
    const email = decoded.email;
    console.log(email)

    const fetchReport = async () => {
        console.log(email);
        console.log("Start Date: " + timeRange.startDate);
        console.log("End Date: " + timeRange.endDate);
        console.log("Table: " + effectedTable);
        console.log("Action: " + actionType);
        try {
            console.log("GET Sent");
            const res = await axios.get(`http://localhost:3002/reports/change-history/${encodeURIComponent(email)}/${timeRange.startDate}/${timeRange.endDate}/${actionType}/${effectedTable}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                },
            });
            console.log("GET Completed");
            console.log(res.data);
            setHistory(res.data);
            
            setReportGenerated(true);
        } catch (err) {
            console.log(err);
        }
    };
    

    return(
        
        <div className="customer-report-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div className="report-form">
                <h1 className="report-header">Edit History Report</h1>
                <label>Filter by start date: </label>
                <input type="date" value={timeRange.startDate} onChange={(e) => setTimeRange({...timeRange, startDate: e.target.value})} />
                <label>Filter by end date: </label>
                <input type="date" value={timeRange.endDate} onChange={(e) => setTimeRange({...timeRange, endDate: e.target.value})} />
                <label>Filter by action type: </label>
                <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
                    <option value="any">Any Action</option>
                    <option value="Created">Created</option>
                    <option value="Updated">Updated</option>
                    <option value="Deleted">Deleted</option>
                    <option value="ReportGenerated">Report Generated</option>
                </select>
                <label>Filter by table: </label>
                <select value={effectedTable} onChange={(e) => setEffectedTable(e.target.value)}>
                    <option value="all">All Tables</option>
                    <option value="AllHistory">Reports</option>
                    <option value="Artworks">Artwork</option>
                    <option value="Collections">Collections</option>
                    <option value="Customers">Customers</option>
                    <option value="Donations">Donations</option>
                    <option value="Employees">Employees</option>
                    <option value="EventList">Event List</option>
                    <option value="EventWorkers">Event Workers</option>
                    <option value="Exhibits">Exhibits</option>
                    <option value="Items">Items</option>
                    <option value="LoginInfo">Login Info</option>
                    <option value="Reviews">Reviews</option>
                    <option value="Sales">Sales</option>
                    <option value="SpecialExhibits">Special Exhibits</option>
                </select>
                <div>
                    <button className="generate-report-button" onClick={fetchReport}>Generate Report</button>
                </div>
                {reportGenerated && (
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>User Email</th>
                                <th>Action Type</th>
                                <th>Effected Table</th>
                                <th>Description</th>
                                <th>Date of Action</th>
                                <th>Time of Action</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(hist => (
                                <tr key={hist.TableKey}>
                                    <td>{hist.Action_Done_By}</td>
                                    <td>{hist.Email}</td>
                                    <td>{hist.Type_Of_Action}</td>
                                    <td>{hist.Table_Impacted}</td>
                                    <td>{hist.Description}</td>
                                    <td>{new Date(hist.Date_Time_Happened).toLocaleDateString()}</td>
                                    <td>{new Date(hist.Date_Time_Happened).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            </div>   
        </div>
    )
}

export default EditHistoryReport