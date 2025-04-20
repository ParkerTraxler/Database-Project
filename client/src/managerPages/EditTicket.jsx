import React from 'react'
import ManagerNav from './ManagerNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { jwtDecode } from 'jwt-decode'
import './ManagerDashboard.css'
import './EditTicket.css'

const EditTicket = () => {
    console.log("EditTicket")

    const { user } = useAuth()
    const token = user.token
    const decoded = jwtDecode(token)
    const email = decoded.email
    const [ticket, setTicket] = useState({
        ItemPrice:""
    })
    const navigate = useNavigate()
    const location = useLocation()
        
    const handleChange = (e) =>{ // given target to given value
        if (e.target.value < 0) return;
        setTicket(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(ticket)
    }
    const ticketID = location.pathname.split("/")[2]
    console.log("ID: " + ticketID)

    useEffect(()=>{
        const fetchTicket = async ()=>{
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/items/tickets/${ticketID}`,
                    {
                        headers: {
                            'authorization': `Bearer ${token}`
                        },
                    }
                )
                console.log(res.data)
                setTicket(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchTicket()
    },[])

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        console.log(ticketID)
        console.log(ticket.Price)
        try{
            console.log("PUT Sent")
            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/items/tickets/${ticketID}`, {
                itemid: ticketID,
                itemprice: ticket.ItemPrice,
                email: email
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log("PUT Completed")
            console.log(res.data)
            
            
            navigate("/manage-tickets")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }

    return(
        
        <div className="edit-ticket-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
            <div className="edit-ticket-form">
                <h1>Edit Ticket</h1>
                <input className="edit-ticket-input" type="number" value={ticket.ItemPrice} step="0.01" min="0" placeholder="price" onChange={handleChange} name="ItemPrice"/>
                <button className="edit-ticket-formButton" onClick={handleClick} >Update</button>
                    
            </div>
            </div>
        </div>    
        </div>
    )
}

export default EditTicket