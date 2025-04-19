import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios' //api calls
import { useAuth } from '../utils/AuthContext'
import EmployeeNav from './EmployeeNav'
import './EmployeeNav.css'
import './AccountDetailsEmployee.css'
import { jwtDecode } from 'jwt-decode'

const AccountDetailsEmployee = () => {
    console.log("AccountDetailsEmployee")
    const { user } = useAuth()
    const token = user.token
    console.log(token)
    const decoded = jwtDecode(token)
    const email = decoded.email

    const [details, setDetails] = useState([])

    useEffect(()=>{
        const fetchAccount = async ()=>{
            try{
                const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/employees/ownacc/${encodeURIComponent(email)}`,
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

    
    
    return(
        <div className="account-details-employee-container">
        <div className="employeeView">
            <div className="navBar">
                <EmployeeNav/>
            </div>
            <div className="AccountDetails">
            
            <h1 className = "employee-account-details-header">Account Details</h1>

            <div className="employeeaccount-details-Box">
                <div className="detail"><strong>First Name:</strong> {details.FirstName}</div>
                <div className="detail"><strong>Last Name:</strong> {details.LastName}</div>
                <div className="detail"><strong>Position:</strong> {details.EPosition || "Not assigned"}</div>
                <div className="detail"><strong>Date of Birth:</strong> {details.BirthDate ? new Date(details.BirthDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "Not provided"}</div>
                <div className="detail"><strong>Gender:</strong> {details.Gender || "Not provided"}</div>
                <div className="detail"><strong>Weekly Hours:</strong> {details.WeeklyHours || "Not assigned"}</div>
                <div className="detail"><strong>Hourly Wage:</strong> {details.HourlyWage != null ? "$" + details.HourlyWage : "Not assigned"}</div>
                <div className="detail"><strong>Email:</strong> {details.Email}</div>
            </div>
            </div>
        </div>    
        </div>
    )
}

export default AccountDetailsEmployee