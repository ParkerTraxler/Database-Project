import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";

const Tickets = () => {
    const [tickets, setTickets] = useState([{ name: "Sample Ticket" }]);
    const [purchase, setPurchase] = useState({
        quantity1:"0",
        quantity2:"0",
        quantity3:"0",
        quantity4:"0"
    })
    const [loading, setLoading] = useState(true);  // New loading state
    const { user } = useAuth()
    const role = user?.role
    const token = user?.token;
    const decoded = token ? jwtDecode(token) : null; // Only decode if token exists
    const email = decoded ? decoded.email : "";
    

    const navigate = useNavigate()

    const handleChange = (e) =>{ // given target to given value
        if (e.target.value < 0) return;
        setPurchase(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(purchase)
    }

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

    const now = new Date();

    const year = now.getFullYear();            // e.g., 2025
    const month = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-based, add 1 and pad with 0
    const day = String(now.getDate()).padStart(2, '0');         // Pad with 0 to ensure two digits

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);  // e.g., "2025-03-24"

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        const ticketArray = [purchase.quantity1, purchase.quantity2,  purchase.quantity3,  purchase.quantity4]
        console.log(ticketArray)
        console.log(email)
        
        try{
            console.log("POST Sent")
            const res = await axios.post("http://localhost:3002/transactions/tickets", {
                ticketArray: ticketArray, 
                email: email, 
                datepurchased: formattedDate
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log("POST Completed")
            console.log(res.data)
            
            
            navigate("/tickets")
        }
        catch(err){
            console.log(err)
        }
    }


    return (
        <div>
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
                            {role == 'Customer' && (
                                <div>
                                    Quantity:
                                    <input type="number" min="0" placeholder="amount to buy" onChange={handleChange} name={"quantity" + ticket.ItemID}/>

                                </div>
                            )}
                            
                        </div>
                        
                    
                    ))
                ) : (
                    <p>No tickets found.</p>  // Handle case when tickets array is empty
                ))}
            </div>
            <div>
                {role == 'Customer' && (
                    <div>
                        <button className="formButton" onClick={handleClick}>Purchase Tickets</button>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default Tickets;
