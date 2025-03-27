import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tickets = () => {
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

    return (
        <div>
            <h1>Tickets</h1>
            {loading ? (
                <p>Loading tickets...</p>  // Show a loading message while waiting for data
            ) : (
            tickets.length > 0 ? (
                tickets.map(ticket=>(
                    <div className="ticket" key={ticket.ItemID}>
                        <div>{ticket.ItemName}</div>
                        <div>{"$" + ticket.ItemPrice}</div>
                        
                    
                    </div>
                ))
            ) : (
                <p>No tickets found.</p>  // Handle case when tickets array is empty
            ))}
        </div>
    );
};

export default Tickets;
