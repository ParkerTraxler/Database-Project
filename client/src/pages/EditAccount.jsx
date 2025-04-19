import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css'

const EditAccount = () => {
    console.log("EditAccount")

    const { user } = useAuth();
    const token = user.token;
    const decoded = jwtDecode(token);
    const email = decoded.email;

    const [info, setInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true); // Track loading status

    const [details, setDetails] = useState({
        firstname:"", 
        lastname:"", 
        birthdate:"", 
        gender:"", 
        email:""
    })

    useEffect(() => {
        const fetchAccount = async () => {
            console.log(encodeURIComponent(email));
            axios.get(`${process.env.REACT_APP_API}/profile/${encodeURIComponent(email)}`, 
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
                .then((res) => {
                    console.log(res.data);
                    setInfo(res.data);
                    setIsLoading(false); // Set loading to false when done
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false); // Even on error, stop loading
                });
        };
            fetchAccount();
    }, [email]);

    const handleChange = (e) =>{ // given target to given value  
        setInfo(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(details)
    }

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // Add leading zero if month is a single digit
        const day = String(d.getUTCDate()).padStart(2, '0'); // Add leading zero if day is a single digit
        return `${year}-${month}-${day}`;
    };

    
    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`${process.env.REACT_APP_API}/profile/`, {
                firstname: info.FirstName, 
                lastname: info.LastName, 
                birthdate: formatDate(info.BirthDate), 
                gender: info.Gender,
                email: email
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })

            if(info.cancelMembership === "on"){
                console.log("PUT Sent")
                const res2 = axios.put(`${process.env.REACT_APP_API}/profile/membership`, {
                    email: email
                },
                {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
            }
            
            navigate("/account-details")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }


    const navigate = useNavigate()
    
    if (isLoading) {
        return <div>Loading account details...</div>; // Display while loading
    }

    return(
        <div className='AccountPageC'>
        <div className="AccountDetailsC">
            <h1>Edit Account</h1>
            <div className="detailsBoxC">
                <div className="detailC">
                    <strong>First Name:</strong>
                    <input type="text"  value={info.FirstName} maxLength="28" onChange={handleChange} name="FirstName"></input>
                </div>
                <div className="detailC">
                    <strong>Last Name:</strong>
                    <input type="text" value={info.LastName} maxLength="28" onChange={handleChange} name="LastName"></input>
                </div>
                <div className="detailC">
                    <strong>Date of Birth:</strong>
                    <input type="date" value={info.BirthDate} onChange={handleChange} name="BirthDate"></input>
                </div>
                <div className="detailC">
                    <strong>Gender:  </strong>
                    <select onChange={handleChange} name="Gender" value={info.Gender}>
                        <option value="">---Choose an option---</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {info.isMember == "1" && info.isRenewing == "1" && (
                    <div className="detailC">
                        <strong>Cancel Membership:</strong>
                        <input type="checkbox" onChange={handleChange} name="cancelMembership" />
                    </div>
                )}
                {info.isMember == "1" && info.isRenewing == "0" && (
                    <div className="detailC">
                        <strong>Renew Membership:</strong>
                        <input type="checkbox" onChange={handleChange} name="cancelMembership" />
                    </div>
                )}
            </div>
            <div>
                <button onClick={handleClick} className="saveButtonC">Save Changes</button>
            </div>
        </div>
        </div>
    )
}

export default EditAccount