import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import './MakeDonation.css'

const MakeDonation = () => {
    console.log("MakeDonation")
    const { user } = useAuth()
    const token = user.token
    console.log(token)

    const decoded = jwtDecode(token)
    const email = decoded.email



    const [donation, setDonation] = useState({
        donatedate:"", 
        donateamt:"", 
        donatedesc:"",
    })

    const handleChange = (e) =>{ // given target to given value
        setDonation(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const now = new Date();

    const year = now.getFullYear();            // e.g., 2025
    const month = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-based, add 1 and pad with 0
    const day = String(now.getDate()).padStart(2, '0');         // Pad with 0 to ensure two digits

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);  // e.g., "2025-03-24"

    const navigate = useNavigate()

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.post(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/donations`, {
                donatedate: formattedDate, 
                donateamt: donation.donateamt, 
                donatedesc: donation.donatedesc,
                email: email,
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            
            navigate("/")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }


    return(
        <div>
            <div className="donationBanner">
                <h1>Want to Donate?</h1>
            </div>
            <div className="donationPage">
                <div className="donationForm">
                    <h1>Make a Donation</h1>
                    <input type="number" step="0.01" placeholder="amount" onChange={handleChange} name="donateamt"/>
                    <input type="text" maxLength="650" placeholder="desc" onChange={handleChange} name="donatedesc"/>
                    <button className="donationButton" onClick={handleClick} >Donate</button>
                </div>
            </div>
        </div>
    )
}

export default MakeDonation