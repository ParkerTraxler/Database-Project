import React from 'react'
import { useState } from 'react'
import axios from 'axios' //api calls
import './Account.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const AccountDetails = () => {
    console.log("AccountDetails")
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
    })

    const navigate = useNavigate()

    const handleClick = e => {
        try{
            navigate("/account-details/edit");
        }
        catch(err){
            console.log(err);
        }

    }

    return(
        <div className="AccountPage">
        <div className="AccountDetails">
            
            <h1>Account Details</h1>

            <div className="detailsBox">
                <div className="detail"><strong>First Name:</strong> {details.firstName}</div>
                <div className="detail"><strong>Last Name:</strong> {details.lastName}</div>
                <div className="detail"><strong>Address:</strong> {details.address}</div>
                <div className="detail"><strong>Date of Birth:</strong> {details.birthDate}</div>
                <div className="detail"><strong>Gender:</strong> {details.gender}</div>
                <div className="detail"><strong>Email:</strong> {details.email}</div>
                <div className="detail"><strong>Password:</strong> ********</div>
            </div>
            <div>
                <button className="saveButton" onClick={handleClick}>Edit Account</button>
            </div>
        </div>
        </div>
    )
}

export default AccountDetails