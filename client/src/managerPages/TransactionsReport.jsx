import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios'; // API calls
import { useAuth } from '../utils/AuthContext';
import ManagerNav from './ManagerNav'

import './ManagerDashboard.css'
import './TransactionsReport.css'

const TransactionsReport = () => {
    console.log("TransactionsReport")
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();
    const token = user.token;
    console.log("token: " + token);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                console.log("GET Sent")
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/transactions/`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    },
                });
                console.log("GET Completed")
                console.log(res.data);
                setTransactions(res.data);
                console.log(transactions)
                
            } catch (err) {
                window.alert(err.response.data.error);
            }
        };
        fetchTransactions();
    }, [token]);
    

    return(
        
        <div className="transactions-report-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div className="transactions-report-section">
                <h1 className="transactions-report-header">Transactions Report</h1>
                <table className="transactions-report-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Final Price</th>
                            <th>Date of Sale</th>
                            <th>Sale ID</th>

                            
                            
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.TransactionID}>
                                <td>{transaction.CustomerName}</td>
                                <td>{transaction.ItemName}</td>
                                <td>{transaction.ItemQuantity}</td>
                                <td>{transaction.FinalPrice}</td>
                                <td>{new Date(transaction.DateofSale).toLocaleDateString()}</td>
                                <td>{transaction.TransactionID}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>    
        </div>
    )
}

export default TransactionsReport