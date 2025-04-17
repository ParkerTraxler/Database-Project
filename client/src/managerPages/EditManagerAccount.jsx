import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios' //api calls
import { useAuth } from '../utils/AuthContext'
import './EditManagerAccount.css'

const EditManagerAccount = () => {
    console.log("EditManagerAccount")
     const { user } = useAuth()
    const token = user.token
    console.log(token)
    const decoded = jwtDecode(token)
    const email = decoded.email

    const [details, setDetails] = useState({
        FirstName:"",
        LastName:"", 
        BirthDate:"", 
        Gender:"", 
        Email:""
    })

    useEffect(()=>{
        const fetchAccount = async ()=>{
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/manager/${encodeURIComponent(email)}`,
                    {
                        headers: {
                            'authorization': `Bearer ${token}`
                        },
                    }
                )
                console.log(res.data)
                setDetails(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchAccount()
    },[])

    
    const navigate = useNavigate()

    const handleChange = (e) =>{ // given target to given value
        setDetails(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(details)
    }

    const handleClick = async e =>{ 
        
        e.preventDefault()  //prevents page refresh
        try{
            console.log("email:",details.Email);
            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/manager`, {
                firstname: details.FirstName, 
                lastname: details.LastName, 
                birthdate: details.BirthDate ? details.BirthDate.split("T")[0] : null, 
                gender: details.Gender, 
                email: details.Email
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log(res.end)
            
            navigate("/manager-account-details")
        }
        catch(err){
            console.error(err); 
            if (err.response && err.response.data && err.response.data.error) {
                window.alert(err.response.data.error);
            } else {
                window.alert("An unexpected error occurred.");
            }
        }
            
    }


    
    return(
        <div className="edit-account-manager-container">
        <div className="managerView">
            <div className="navBar">
                <ManagerDashboard/>
            </div>
            <div className="manager-editAccount-section">
            <h1>Edit Account</h1>
            <div className="manager-edit-account-details-box">
                <div className="manager-edit-account-detail">
                    <strong>First Name:</strong>
                    <input type="text" onChange={handleChange} value={details.FirstName} maxLength="28" name="FirstName"></input>
                </div>
                <div className="manager-edit-account-detail">
                    <strong>Last Name:</strong>
                    <input type="text" onChange={handleChange} value={details.LastName} maxLength="28" name="LastName"></input>
                </div>
               
                <div className="manager-edit-account-detail">
                    <strong>Date of Birth:</strong>
                    <input type="date" onChange={handleChange} value={details?.BirthDate ? new Date(details.BirthDate).toISOString().split("T")[0] : ""} name="BirthDate"></input>
                </div>
                <div className="manager-edit-account-detail">
                    <strong>Gender:  </strong>
                    <select value={details.Gender} name='Gender' onChange={handleChange}>
                        <option value="">---Choose an option---</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
                <div className="manager-edit-account-detail">
                <button className="manager-edit-account-saveButton" onClick={handleClick}>Save Changes</button>
                </div>
            </div>
        </div>
        </div>

    )
}

export default EditManagerAccount