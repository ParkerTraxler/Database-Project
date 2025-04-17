import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'
import "./ManageEvents.css"

const ManageEvents = () => {
    console.log("ManageEvents")
    const { user } = useAuth()
        const token = user.token
        console.log("token: " + token)

    const [events, setEvents] = useState([]);

    useEffect(()=>{
        const fetchAllEvents = async ()=>{
            try{
                console.log("GET Sent")
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/events`)
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

    const handleDelete = async (eventid)=>{
        console.log(eventid)
        const confirmed = window.confirm("Are you sure you want to delete this event?");
        if (!confirmed) return;
        else{
            try{
                const res = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/events/`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    data: {eventid: eventid}
                })
                console.log(res.data)
                window.location.reload() //refreshes the page
            }
            catch(err){
                window.alert(err.response.data.error);
            }
        }
        
    }

    return(
        <div className="manage-events-container">
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div className="manageEventsSectionM">
                <h1>Events</h1>
                <div>
                    <div className="eventsM">
                    {events.map(event=>(
                        <div className="eventM" key={event.EventID}>
                            {event.EventPic && <img src={event.EventPic} alt="" />}
                            <h2>{event.EventName}</h2>
                            <div>{new Date(event.EventDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) || "Not provided"}</div>
                            <p>{event.EventDesc}</p>
                            <button className="update"><Link to={`/edit-event/${event.EventID}`}>Update</Link></button>
                            <button className="delete" onClick={()=>handleDelete(event.EventID)}>Delete</button>
                        </div>
                    ))}
                    </div>
                    <div>
                    <button className="manage-events-create-button">
                        <Link to="/add-event">Create Event</Link>
                    </button>
                    </div>
                </div>         
            </div>
            </div>
            
        </div>
    )
}

export default ManageEvents