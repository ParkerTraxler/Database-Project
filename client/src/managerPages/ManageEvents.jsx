import React from 'react'
import ManagerDashboard from './ManagerNav'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { jwtDecode } from 'jwt-decode'
import './ManagerDashboard.css'

const ManageEvents = () => {
    console.log("ManageEvents")
    const [events, setEvents] = useState([]);
    const { user } = useAuth()
    const token = user.token
    const decoded = jwtDecode(token)
    const email = decoded.email

    useEffect(()=>{
        const fetchAllEvents = async ()=>{
            try{
                console.log("GET Sent")
                const res = await axios.get("http://localhost:3002/events")
                console.log("GET Completed")
                console.log(res.data)
                setEvents(res.data)
                console.log(events)
            }catch(err){
                console.log(err)
            }
        }
        fetchAllEvents()
    },[])

    const handleDelete = async (event)=>{
        console.log(event)
        try{
            const res = await axios.delete("http://localhost:3002/events/", {
                headers: {
                    'authorization': `Bearer ${token}`
                },
                data: {
                    eventid: event,
                    email: email
                }
            })
            console.log(res.data)
            window.location.reload() //refreshes the page
        }
        catch(err){
            console.log(err)
        }
    }

    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manage Events
                <div className="eventsBody">
                {events.map(event=>(
                        <div className="eventC" key={event.EventID}>
                            
                            <h2>{event.EventName}</h2>
                            <div>{new Date(event.EventDate).toLocaleDateString() || "Not provided"}</div>
                            <p>{event.EventDesc}</p>
                            <button className="delete" onClick={()=>handleDelete(event.EventID)}>Delete</button>
                            <button className="update"><Link to={`/edit-event/${event.EventID}`}>Update</Link></button>
                        </div>
                    ))}
                </div>
                <button>
                    <Link to="/add-event">Create Event</Link>
                </button>
            </div>
            
        </div>
    )
}

export default ManageEvents