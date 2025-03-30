import React from 'react'
import ManagerNav from './ManagerNav'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './ManagerDashboard.css'
import './ManageTickets.css'

const ManageTickets = () => {
    console.log("ManageTickets")
    const [tickets, setTickets] = useState([{ name: "Sample Ticket" }]);
    const [loading, setLoading] = useState(true);  // New loading state
    

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get("http://localhost:3002/items/tickets");
                console.log(res.data)
                setTickets(res.data);  // Store the data once fetched
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);  // Stop loading after request completes
            }
        };
        fetchTickets();
    }, []);

    
    return(
        
        <div className="manage-tickets-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div className="manage-tickets-section">
            <h1 className="manage-tickets-header">Manage Tickets</h1>
                {loading ? (
                    <p>Loading tickets...</p>  // Show a loading message while waiting for data
                ) : (
                    tickets.length > 0 ? (
                    tickets.map(ticket=>(
                    <div className="ticket" key={ticket.ItemID}>
                        <div>{ticket.ItemName}</div>
                        <div>{"$" + ticket.ItemPrice}</div>
                        <div>Quantity: {ticket.AmountInStock}</div>
                        <button className="update"><Link to={`/edit-ticket/${ticket.ItemID}`}>Update</Link></button>
                    </div>
                ))
            ) : (
                <p>No tickets found.</p>  // Handle case when tickets array is empty
            ))}
            </div>
        </div>
        </div>
    )
}

export default ManageTickets