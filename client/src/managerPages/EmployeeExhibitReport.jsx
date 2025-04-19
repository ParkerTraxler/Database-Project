import React, { useState, useEffect } from 'react';
import ManagerNav from './ManagerNav';
import axios from 'axios'; // API calls
import { useAuth } from '../utils/AuthContext';
import { jwtDecode } from 'jwt-decode';
import './ManagerDashboard.css';
import './EmployeeExhibitReport.css';

const EmployeeExhibitReport = () => {
    console.log("EmployeeExhibitReport");
    const [report, setReport] = useState([]);
    const [exhibitTypeFilter, setExhibitTypeFilter] = useState("all")
    const [reportGenerated, setReportGenerated] = useState(false);
    const [costRange, setCostRange] = useState({
        upperCost: "all",
        lowerCost: "all"
    })
    const { user } = useAuth();
    const token = user.token; 
    console.log("token: " + token);
    const decoded = jwtDecode(token);
    const email = decoded.email;

    const fetchReport = async () => {
        console.log(email);
        const upper = costRange.upperCost === "" ? "all" : costRange.upperCost;
        const lower = costRange.lowerCost === "" ? "all" : costRange.lowerCost;

        console.log("upper cost: " + upper);
        console.log("lower cost: " + lower);
        console.log("exhibit filter: " + exhibitTypeFilter);

        
        try {
            console.log("GET Sent");
            const res = await axios.get(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/reports/exhibit-cost/${encodeURIComponent(email)}/${upper}/${lower}/${exhibitTypeFilter}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                },
            });
            console.log("GET Completed");
            
            console.log(res.data);
            setReport(res.data);
            setReportGenerated(true);
        } catch (err) {
            window.alert(err.response.data.error);
        }
    };

    

    
    return (
        <div className="container-exhibit-report">
        <div className="managerView">
            <div>
                <ManagerNav />
            </div>
            <div className = "report-section">
                <h1 className="header">Exhibit Spending Report</h1>

                

                <label>Lower Cost Range (no range by default): </label>
                <input type="number" value={costRange.lowerCost} onChange={(e) => setCostRange({...costRange, lowerCost: e.target.value})} />
                <label>Upper Cost Range (no range by default): </label>
                <input type="number" value={costRange.upperCost} onChange={(e) => setCostRange({...costRange, upperCost: e.target.value})} />

                {/* use filter-select or search-bar className*/}
                <label>Filter by exhibit type: </label>
                <select value={exhibitTypeFilter} onChange={(e) => setExhibitTypeFilter(e.target.value)} className="filter-select">
                    <option value="all">All Exhibits</option>
                    <option value="special">Special Exhibits</option>
                    <option value="normal">Main Exhibits</option>
                    
                </select>

                <div>
                    <button className="generate-report-button" onClick={fetchReport}>Generate Report</button>
                </div>
                <div className="disclaimer">Hover your mouse over column headers with * for more information.</div>
                <table className="info-table">
                    <thead>
                        <tr>
                            <th>Exhibit Name</th>
                            <th>Exhibit Type</th>
                            <th className="tooltip" title="N/A for Main Exhibits. For shows status of limited time Special Exhibits.">*Running Status</th>
                            <th>Total Employees</th>
                            <th className="tooltip" title="This is the total cost to pay all employees stationed at this exhibit per week.">*Weekly Cost</th>
                            <th>Weeks Active</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map(info => (
                            <tr key={info.Exhibit_ID}>
                                <td>{info.Exhibit_Name}</td>
                                <td>{info.Is_Special_Exhibit ? "Special Exhibit" : "Main Exhibit"}</td>
                                    <td>{info.Running_Status}</td>
                                    <td>{info.Total_Employees}</td>
                                    <td>${info.Weekly_Exhibit_Cost ? info.Weekly_Exhibit_Cost : 0}</td>
                                    <td>${info.Weeks_Active}</td>
                                    <td>{info.Exhibit_ID}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default EmployeeExhibitReport;