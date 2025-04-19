import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'
import { useState, useEffect } from 'react'
import axios from 'axios' //api calls
import { useAuth } from '../utils/AuthContext'
import './ManagerAccountDetails.css'
import { jwtDecode } from 'jwt-decode'

const ManagerAccountDetails = () => {
    console.log("ManagerAccountDetails")
    const { user } = useAuth()
    const token = user.token
    console.log(token)
    const decoded = jwtDecode(token)
    const email = decoded.email

    const [details, setDetails] = useState([])

    useEffect(()=>{
        const fetchAccount = async ()=>{
            try{
                const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/manager/${encodeURIComponent(email)}`,
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
        <div className="account-details-manager-container">
        <div className="managerView">
            <div className="navBar">
                <ManagerDashboard/>
            </div>
            <div className="AccountDetails-manager-section">
           
            <h1 className = "manager-account-details-header">Account Details</h1>


            <div className="manageraccount-details-Box">
                <div className="manageraccount-details-detail"><strong>First Name:</strong> {details.FirstName}</div>
                <div className="manageraccount-details-detail"><strong>Last Name:</strong> {details.LastName}</div>
                <div className="manageraccount-details-detail"><strong>Date of Birth:</strong> {details.BirthDate ? new Date(details.BirthDate).toLocaleDateString() : "Not provided"}</div>
                <div className="manageraccount-details-detail"><strong>Gender:</strong> {details.Gender || "Not provided"}</div>
                <div className="manageraccount-details-detail"><strong>Salary:</strong> {details.Salary || "Not assigned"}</div>
                <div className="manageraccount-details-detail"><strong>Email:</strong> {email}</div>
            </div>
            </div>
        </div>    
        </div>
    )
}

export default ManagerAccountDetails