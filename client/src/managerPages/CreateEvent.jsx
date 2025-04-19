import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerDashboard from './ManagerNav';
import './ManagerDashboard.css';
import './CreateEvent.css';

const CreateEvent = () => {
    console.log("CreateEvent");
    const [event, setEvent] = useState({
        eventname: "", 
        eventdesc: "", 
        eventdate: "",
        memberonly: false, 
        eventpic: "",
    });
    const [employeeEmail, setEmployeeEmail] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    
    const { user } = useAuth();
    const token = user.token;
    console.log("token: " + token);
    const decoded = jwtDecode(token);
    const managerEmail = decoded.email;

    const navigate = useNavigate()
    

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setEvent(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleEmployeeChange = (e) => {
        setEmployeeEmail(e.target.value);
    };

    const addEmployee = () => {
        if (employeeEmail && employeeList.length < 3) {
            setEmployeeList(prev => [...prev, employeeEmail]);
            setEmployeeEmail("");
        }
    };

    const removeEmployee = (index) => {
        setEmployeeList(prev => prev.filter((_, i) => i !== index));
    };

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        console.log(employeeList)
        try{
            const res = await axios.post(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/events`, {
                eventname: event.eventname, 
                eventdesc: event.eventdesc, 
                eventdate: event.eventdate,
                memberonly: event.memberonly, 
                employeelist: employeeList,
                email: managerEmail,
                eventpic: event.eventpic
                
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


    return (
        <div className="create-event-container">
        <div className="managerView">
            <div>
                <ManagerDashboard />
            </div>
            <div>
                <div className="create-event-form">
                    <h1>Create Event</h1>
                    <input className="create-event-input" type="text" placeholder="Event Name" onChange={handleChange} name="eventname" />
                    <input className="create-event-input" type="text" placeholder="Event Description" onChange={handleChange} name="eventdesc" />
                    <input className="create-event-input" type="text" placeholder="Image URL" onChange={handleChange} name="eventpic" />
                    <input className="create-event-input" type="date" onChange={handleChange} name="eventdate" />
                    <div>
                        <label>
                            Member Only
                            <input className="create-event-checkbox"  type="checkbox" onChange={handleChange} name="memberonly" checked={event.memberonly} />
                        </label>
                    </div>

                    <div className="create-event-employeeSection">
                        <h3>Assign Employees (Max 3)</h3>
                        <input 
                            type="email" 
                            placeholder="Employee Email" 
                            value={employeeEmail} 
                            onChange={handleEmployeeChange} 
                        />
                        <button className = "add-employee-button-events" onClick={addEmployee} disabled={employeeList.length >= 3}>Add Employee</button>
                        <ul>
                            {employeeList.map((email, index) => (
                                <li key={index}>
                                    {email} <button  className="remove-employee-button-add-events" onClick={() => removeEmployee(index)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={handleClick} className="create-event-formButton">Add Event</button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default CreateEvent;