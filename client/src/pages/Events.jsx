import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import "./Events.css"

const Events = () => {
    console.log("Events")

    const [events, setEvents] = useState([]);

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

    return(
        <div>
            <div className="eventsBanner">
                <h1>Events</h1>
            </div>
            <div>
                <h1>Events</h1>
                <div className="eventsBody">
                {events.map(event=>(
                        <div className="eventC" key={event.EventID}>
                            
                            <h2>{event.EventName}</h2>
                            <div>{new Date(event.EventDate).toLocaleDateString() || "Not provided"}</div>
                            <p>{event.EventDesc}</p>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Events