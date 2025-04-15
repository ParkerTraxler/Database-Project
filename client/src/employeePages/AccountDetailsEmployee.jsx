import React from 'react'
import { useState } from 'react'
import axios from 'axios' //api calls
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import EmployeeNav from './EmployeeNav'
import './EmployeeNav.css'
import './AccountDetailsEmployee.css'

const AccountDetailsEmployee = () => {
    console.log("AccountDetailsEmployee")
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    })

    const [details, setDetails] = useState({
        membership: false,
        firstName: "",
        lastName: "",
        birthDate: null,
        gender: null,
        address: null,
        Eposition: null, 
    })

    const navigate = useNavigate()
    
    
    return(
        <div className="account-details-employee-container">
        <div className="employeeView">
            <div className="navBar">
                <EmployeeNav/>
            </div>
            <div className="AccountDetails">
            
            <h1 className = "employee-account-details-header">Account Details</h1>

            <div className="employeeaccount-details-Box">
                <div className="detail"><strong>First Name:</strong> {details.firstName}</div>
                <div className="detail"><strong>Last Name:</strong> {details.lastName}</div>
                <div className="detail"><strong>Position:</strong> {details.Eposition}</div>
                <div className="detail"><strong>Address:</strong> {details.address}</div>
                <div className="detail"><strong>Date of Birth:</strong> {details.birthDate ? new Date(details.birthDate).toLocaleDateString() : "Not provided"}</div>
                <div className="detail"><strong>Gender:</strong> {details.gender}</div>
                <div className="detail"><strong>Email:</strong> {details.email}</div>
                <div className="detail"><strong>Password:</strong> ********</div>
            </div>
            </div>
        </div>    
        </div>
    )
}

export default AccountDetailsEmployee