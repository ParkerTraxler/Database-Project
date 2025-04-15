import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios' //api calls
import { useAuth } from '../utils/AuthContext'
import EmployeeNav from './EmployeeNav'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import './EmployeeNav.css'
import './EditAccountEmployee.css'

const EditAccountEmployee = () => {
    console.log("EditAccountEmployee")
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
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/employees/ownacc/${encodeURIComponent(email)}`,
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

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/employees/editacc`, {
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
            
            navigate("/employee-account-details")
        }
        catch(err){
            console.error(err); // Always good to log
            if (err.response && err.response.data && err.response.data.error) {
                window.alert(err.response.data.error);
            } else {
                window.alert("An unexpected error occurred.");
            }
        }
    }

    return(
        <div className="edit-account-employee-container">
        <div className="employeeView">
            <div className="navBar">
                <EmployeeNav/>
            </div>
            <div className="editAccount-section">
            <h1>Edit Account</h1>
            <div className="edit-account-details-box">
                <div className="detail">
                    <strong>First Name:</strong>
                    <input type="text" onChange={handleChange} value={details.FirstName} maxLength="28" name="FirstName"></input>
                </div>
                <div className="detail">
                    <strong>Last Name:</strong>
                    <input type="text" onChange={handleChange} value={details.LastName} maxLength="28" name="LastName"></input>
                </div>
                
                <div className="detail">
                    <strong>Date of Birth:</strong>
                    <input type="date" onChange={handleChange} value={details?.BirthDate ? new Date(details.BirthDate).toISOString().split("T")[0] : ""} name="BirthDate"></input>
                </div>
                <div className="detail">
                    <strong>Gender:  </strong>
                    <select value={details.Gender} name='Gender' onChange={handleChange}>
                        <option value="">---Choose an option---</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
                <div className="detail">
                <button className="saveButton" onClick={handleClick}>Save Changes</button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default EditAccountEmployee