import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import ManagerNav from './ManagerNav';
import { jwtDecode } from 'jwt-decode';
import './ManagerDashboard.css';
import './GiftShopSalesReport.css';

const GiftShopSalesReport = () => {
    console.log("GiftShopSalesReport");
    const [sales, setSales] = useState([]);
    const [timeRange, setTimeRange] = useState("alltime");
    const [reportGenerated, setReportGenerated] = useState(false);
    const [reportValues, setReportValues] = useState(null);
    const [customerFilter, setCustomerFilter] = useState("");
    const { user } = useAuth();
    const token = user.token;
    const decoded = jwtDecode(token);
    const email = decoded.email;

    const fetchSales = async () => {
        console.log(email);
        console.log("Range: " + timeRange);
        try {
            console.log("GET Sent");
            const res = await axios.get(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/reports/giftshop-sales/${encodeURIComponent(email)}/${timeRange}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                },
            });
            console.log("GET Completed");
            console.log("GET Sent");
            const res2 = await axios.get(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/reports/giftshop-aggregate/${timeRange}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                },
            });
            console.log("GET Completed");
            console.log(res.data);
            console.log(res2.data);
            setSales(res.data);
            setReportValues(res2.data);
            setReportGenerated(true);
        } catch (err) {
            window.alert(err.response.data.error);
        }
    };

    const filteredSales = sales.filter(sale => 
        sale.CustomerName.toLowerCase().includes(customerFilter.toLowerCase())
    );

    return (
        <div className="gift-shop-report-container">
        <div className="managerView">
            <div>
                <ManagerNav />
            </div>
            <div className="gift-shop-report-section">
                <h1 className="gift-shop-report-header" >Gift Shop Sales Report</h1>
                <label>Filter by time range: </label>
                <select className="gift-shop-report-input" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                    <option value="all-time">All Time</option>
                    <option value="last-day">Last Day</option>
                    <option value="last-week">Last Week</option>
                    <option value="last-month">Last Month</option>
                    <option value="last-quarter">Last Quarter</option>
                    <option value="last-year">Last Year</option>
                </select>
                <div>
                        <label>Filter by Customer Name: </label>
                        <input type="text" className="gift-shop-report-input" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}placeholder="Enter customer name"/>
                </div>
                <div>
                    <button className="generate-gift-shop-report-button" onClick={fetchSales}>Generate Report</button>
                </div>
                <div className="disclaimer">Hover your mouse over column headers with * for more information.</div>
                {/* render report values */}
                {reportGenerated && reportValues && (
                    <div>
                        <div>{"Number of Sales: " + (reportValues[0].TransactionCount || 0)}</div>
                        <div>{"Total Revenue: $" + (reportValues[0].TotalPrice || 0)}</div>
                        <div>{"Amount of Items Sold: " + (reportValues[0].TotalQuantity || 0)}</div>
                    </div>
                )}
                {reportGenerated && (
                    <table className="gift-shop-report-table">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th className="tooltip" title="Quantity x Item Price">*Final Price</th>
                                <th>Date of Sale</th>
                                <th>Sale ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map(sale => (
                                <tr key={sale.TransactionID}>
                                    <td>{sale.CustomerName}</td>
                                    <td>{sale.ItemName}</td>
                                    <td>{sale.ItemQuantity}</td>
                                    <td>{sale.FinalPrice}</td>
                                    <td>{new Date(sale.DateofSale).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                    <td>{sale.TransactionID}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        </div>
    );
};

export default GiftShopSalesReport;