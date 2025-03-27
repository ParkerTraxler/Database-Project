import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { jwtDecode } from "jwt-decode";
import { useState } from 'react';
import axios from 'axios';
import './Account.css'

const EditAccount = () => {
    console.log("EditAccount")

    const { user } = useAuth();
    const token = user.token;
    const decoded = jwtDecode(token);
    const email = decoded.email;

    const [details, setDetails] = useState({
        firstname:"", 
        lastname:"", 
        birthdate:"", 
        gender:"", 
        email:""
    })

    const handleChange = (e) =>{ // given target to given value  
        setDetails(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(details)
    }
    
    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put("http://localhost:3002/profile/", {
                firstname: details.firstname, 
                lastname: details.lastname, 
                birthdate: details.birthdate, 
                gender: details.gender,
                email: email
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log(res.end)
            
            navigate("/manage-employees")
        }
        catch(err){
            console.log(err)
        }
    }


    const navigate = useNavigate()
    

    return(
        <div className='AccountPage'>
        <div className="AccountDetails">
            <h1>Edit Account</h1>
            <div className="detailsBox">
                <div className="detail">
                    <strong>First Name:</strong>
                    <input type="text" maxLength="28" onChange={handleChange} name="firstname"></input>
                </div>
                <div className="detail">
                    <strong>Last Name:</strong>
                    <input type="text" maxLength="28" onChange={handleChange} name="lastname"></input>
                </div>
                <div className="detail">
                    <strong>Date of Birth:</strong>
                    <input type="date" onChange={handleChange} name="birthdate"></input>
                </div>
                <div className="detail">
                    <strong>Gender:  </strong>
                    <select onChange={handleChange} name="gender">
                        <option value="">---Choose an option---</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <div>
                <button onClick={handleClick} className="saveButton">Save Changes</button>
            </div>
        </div>
        </div>
    )
}

export default EditAccount