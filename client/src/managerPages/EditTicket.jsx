import React from 'react'
import ManagerNav from './ManagerNav'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './ManagerDashboard.css'

const EditTicket = () => {
    console.log("EditTicket")

    const { user } = useAuth()
    const token = user.token
    const [ticket, setTicket] = useState({
        price:"",
        amounttoadd:""
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

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        console.log(ticketID)
        console.log(ticket.price)
        try{
            console.log("PUT Sent")
            const res = await axios.put("http://localhost:3002/items/", {
                itemid: ticketID,
                itemprice: ticket.price
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log("PUT Completed")
            console.log(res.data)
            console.log("PUT Sent")
            const res2 = await axios.put("http://localhost:3002/items/restock", {
                itemid: ticketID,
                amounttoadd: ticket.amounttoadd
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            
            
            navigate("/manage-tickets")
        }
        catch(err){
            console.log(err)
        }
    }

    return(
        
        
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
            <div className="form">
                <h1>Edit Ticket</h1>
                <input type="number" step="0.01" min="0" placeholder="price" onChange={handleChange} name="price"/>
                <input type="number" min="0" placeholder="amount to restock" onChange={handleChange} name="amounttoadd"/>
                <button className="formButton" onClick={handleClick} >Update</button>
                    
            </div>
            </div>
            
        </div>
    )
}

export default EditTicket