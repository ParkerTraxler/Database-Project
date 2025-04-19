import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../utils/AuthContext'
import React from 'react'
import ManagerNav from './ManagerNav'
import './ManagerDashboard.css'
import './EditEvent.css'
import { jwtDecode } from 'jwt-decode'

const EditEvent = () => {
    console.log("EditEvent")
    const [prevEvent, setPrevEvent] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [employeeEmail, setEmployeeEmail] = useState("");
    const [removedemployees, setRemovedEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({
        eventid:"", 
        eventname:"", 
        eventdesc:"", 
        eventdate:"", 
        memberonly:"", 
        addedemployees:"", 
        removedemployees:"",
        eventpic: ""
    });
    const { user } = useAuth()
    const token = user.token
    const decoded = jwtDecode(token)
    const email = decoded.email

    const navigate = useNavigate()
    const location = useLocation()

    const EventID = location.pathname.split("/")[2]

    useEffect(()=>{
        const fetchPrevEvent = async ()=>{
            try{
                console.log("GET Sent")
                const res = await axios.get(`${process.env.REACT_APP_API}/events/${EventID}`)
                console.log("GET Completed")
                console.log(res.data)
                setPrevEvent(res.data)
                console.log(event)

                console.log("GET Sent")
                const res2 = await axios.get(`${process.env.REACT_APP_API}/events/employees/${EventID}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
                console.log("GET Completed")
                console.log(res2.data)
                const emails = res2.data.map(employee => employee.Email);
                setEmployeeList(emails);
                setLoading(false);

            }catch(err){
                console.log(err)
                setLoading(false);
            }
        }
        fetchPrevEvent()
    },[EventID])

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        console.log(employeeList)
        try{
            console.log("PUT Sent")
            const res = await axios.put(`${process.env.REACT_APP_API}/events/`, {
                eventid: EventID, 
                eventname: prevEvent.EventName, 
                eventdesc: prevEvent.EventDesc, 
                eventdate: new Date(prevEvent.EventDate).toISOString().split("T")[0], 
                memberonly: prevEvent.MemberOnly, 
                addedemployees: employeeList, 
                removedemployees: removedemployees,
                email: email,
                eventpic: prevEvent.eventpic
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log(res.end)
            
            navigate("/manage-events")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setPrevEvent(prev => ({...prev, [name]: type === "checkbox" ? (checked ? "1" : "0") : value}));
        console.log(prevEvent)
    };

    const addEmployee = () => {
        if (employeeEmail && employeeList.length < 3) {
            setEmployeeList(prev => [...prev, employeeEmail]);
            setEmployeeEmail("");
        }
    };

    const removeEmployee = (index) => {
        setEmployeeList((prev) => {
            const removedEmployee = prev[index];
            return prev.filter((_, i) => i !== index);
        });
    
        setRemovedEmployees((prevRemoved) => [...prevRemoved, employeeList[index]]);
    };

    const restoreEmployee = (index) => {
        setRemovedEmployees((prev) => {
            const restoredEmployee = prev[index];
            return prev.filter((_, i) => i !== index);
        });
    
        setEmployeeList((prevEmployees) => [...prevEmployees, removedemployees[index]]);
    };
    

    const handleEmployeeChange = (e) => {
        setEmployeeEmail(e.target.value);
    };
    
    if (loading) {
        return <div>Loading...</div>;  // Display loading message while waiting for data
    }

    return(
        <div className="edit-event-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
                
                <div className="edit-event-form">
                    <h1>Edit Event</h1>
                    <input className="edit-event-input" type="text" value={prevEvent?.EventName || ""} placeholder="Event Name" onChange={handleChange} name="EventName" />
                    <input className="edit-event-input" type="text" value={prevEvent?.EventDesc || ""} placeholder="Event Description" onChange={handleChange} name="EventDesc" />
                    <input className="edit-event-input" type="text" placeholder="Image URL" onChange={handleChange} name="eventpic" />
                    <input className="edit-event-input" type="date" value={prevEvent?.EventDate ? new Date(prevEvent.EventDate).toISOString().split("T")[0] : ""} onChange={handleChange} name="EventDate" />
                    <div>
                        <label>
                            Member Only
                            <input className="edit-event-checkbox" type="checkbox" onChange={handleChange} name="MemberOnly" checked={prevEvent?.MemberOnly == "1"} />
                        </label>
                    </div>

                    <div className="edit-event-employeeSection">
                        <h3>Assign Employees (Max 3)</h3>
                        <input className="edit-event-input" type="email" placeholder="Employee Email" value={employeeEmail} onChange={handleEmployeeChange} />
                        <button className="edit-event-add-employee-button" onClick={addEmployee} disabled={employeeList.length >= 3}>Add Employee</button>
                        <ul>
                        {employeeList.map((email, index) => (
                            <li key={index}>
                                {email} <button className="remove-employee-button-edit-events" onClick={() => removeEmployee(index)}>Remove</button>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div className="removedEmployees">
                        <h3>Removed Employees</h3>
                        <ul>
                        {removedemployees.map((email, index) => (
                            <li key={index}>
                                {email} <button className="re-add-employee-button-edit-events" onClick={() => restoreEmployee(index)}>Re-add</button>
                            </li>
                        ))}
                        </ul>
                    </div>

                    


                    <button onClick={handleClick} className="edit-event-formButton">Save Changes</button>
                </div>
                </div>        
            </div>
        </div>
    )
}

export default EditEvent