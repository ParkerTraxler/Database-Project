import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './Tickets.css';

const Tickets = () => {
    const [tickets, setTickets] = useState([{ name: "Sample Ticket" }]);
    const [purchase, setPurchase] = useState({
        quantity1:"0",
        quantity2:"0",
        quantity3:"0",
        quantity4:"0"
    })
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [loading, setLoading] = useState(true);  // New loading state
    const [info, setInfo] = useState(null);
    const { user } = useAuth()
    const role = user?.role
    const token = user?.token;
    const decoded = token ? jwtDecode(token) : null; // Only decode if token exists
    const email = decoded ? decoded.email : "";

    useEffect(() => {
        const fetchAccount = async () => {
            console.log(encodeURIComponent(email));
            axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/profile/${encodeURIComponent(email)}`, 
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
                .then((res) => {
                    console.log(res.data);
                    setInfo(res.data);
                    
                })
                .catch((err) => {
                    console.log(err);
                    
                });
        };
        fetchAccount();
    }, [email]);
    

    const navigate = useNavigate()

    const handleChange = (e) =>{ // given target to given value
        if (e.target.value < 0) return;
        setPurchase(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(purchase)
    }

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/items/tickets`);
                console.log(res.data)
                setTickets(res.data);  // Store the data once fetched
                
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);  // Stop loading after request completes
            }
        };
        fetchTickets();
    }, [info]);

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
            const res = await axios.post(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/transactions/tickets`, {
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
            setReceiptData(res.data);
            setShowReceipt(true);
            
            navigate("/tickets")
        }
        catch(err){
            console.log(err)
        }
    }

    const hideReciept = () => {
        setShowReceipt(false);
        window.location.reload();
    };
    

    

    return (
        <div>
            <div className="ticketsBanner">
                <h1>Tickets</h1>
            </div>
            <div>
                <h1>Tickets</h1>
                <h3 className="ticketsCuPageh3">Members get a 10% discount on all tickets!</h3>
                {tickets[0].isPurchasable == '0' && (
                        <div>
                            Tickets are sold out. Check back tomorrow!
                        </div>
                    )}
                <div className="ticketsBody">
                    {loading ? (
                        <p>Loading tickets...</p>  // Show a loading message while waiting for data
                    ) : (
                        tickets.length > 0 ? (
                        
                        tickets.map(ticket=>(
                            
                            <div className="ticketCu" key={ticket.ItemID}>
                                <div>{ticket.ItemName}</div>
                                {!info && (
                                    <div>{"$" + ticket.ItemPrice}</div>
                                )}
                                {info?.isMember == '0' && (
                                    <div>{"$" + ticket.ItemPrice}</div>
                                )}
                                {info?.isMember == '1' && (
                                    <div>
                                        <div className="regularPriceTickets">{"$" + ticket.ItemPrice}</div>
                                        {"$" + (ticket.ItemPrice*0.9).toFixed(2)}
                                    </div>
                                )}
                                {role == 'Customer' && ticket.isPurchasable == '1' && (
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
                    
                    {role == 'Customer' && tickets[0].isPurchasable == '1' && (
                        <div className="purchaseTicketsButtonContainer">
                            <button className="puchaseTicketsButton" onClick={handleClick}>Purchase Tickets</button>
                        </div>
                        )}
                </div>
                {showReceipt && (
                    <div className="receiptPopUpBox">
                    <div className="receiptPopUpBoxInfo">
                        <span className="receiptCloseButton" onClick={hideReciept}>
                            &times;
                        </span>
                        <h2>Receipt</h2>
                        <p>Thank you for purchasing tickets!</p>
                        {receiptData[0] > '0' && (
                            <div>{tickets[0].ItemName + ": $" + receiptData[0]}</div>
                        )}
                        {receiptData[1] > '0' && (
                            <div>{tickets[1].ItemName + ": $" + receiptData[1]}</div>
                        )}
                        {receiptData[2] > '0' && (
                            <div>{tickets[2].ItemName + ": $" + receiptData[2]}</div>
                        )}
                        {receiptData[3] > '0' && (
                            <div>{tickets[3].ItemName + ": $" + receiptData[3]}</div>
                        )}
                        <div>Final Price: {"$" + (Number(receiptData[0]) + Number(receiptData[1]) + Number(receiptData[2]) + Number(receiptData[3])).toFixed(2)}</div>
                        
                        
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tickets;