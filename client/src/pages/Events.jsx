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
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/events`)
                setEvents(res.data)
            }catch(err){
                window.alert(err.response.data.error);
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
                <div className="eventsCu">
                {events.map(event=>(
                        <div className="eventCu" key={event.EventID}>
                            {event.EventPic && <img src={event.EventPic} alt="" />}
                            <h2>{event.EventName}</h2>
                            <div>{new Date(event.EventDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) || "Not provided"}</div>
                            <p>{event.EventDesc}</p>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Events