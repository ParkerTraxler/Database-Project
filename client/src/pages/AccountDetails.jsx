import React, { useState, useEffect } from 'react';
import axios from 'axios'; // API calls
import './Account.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { jwtDecode } from "jwt-decode";

const AccountDetails = () => {
    console.log("AccountDetails");
    const { user } = useAuth();
    const token = user.token;
    const decoded = jwtDecode(token);
    const email = decoded.email;

    const [info, setInfo] = useState({
        FirstName: null,
        LastName: "",
        Membership: "",
        BirthDate: "",
        Gender: "",
    });

    const [isLoading, setIsLoading] = useState(true); // Track loading status

    useEffect(() => {
        const fetchAccount = async () => {
            console.log(encodeURIComponent(email));
            axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/profile/${encodeURIComponent(email)}`, 
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

    const navigate = useNavigate();

    const handleClick = () => {
        try {
            navigate("/account-details/edit");
        } catch (err) {
            console.log(err);
        }
    };
    const subscribeNow = async e => {
        e.preventDefault()  //prevents page refresh on button click
        try{
            console.log("PUT Sent")
            const res2 = axios.put('https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/profile/membership', {
                email: email
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log(res2)
            console.log("PUT Completed")
            window.location.reload()
        } catch (err){
            console.log(err)
        }
        
    }

    if (isLoading) {
        return <div>Loading account details...</div>; // Display while loading
    }

    return (
        <div className="AccountPageC">
            <div className="AccountDetailsC">
                <h1>Account Details</h1>
                {!info.FirstName && (
                    <div>Loading Info...</div>
                )}
                <div className="detailsBoxC">
                    <div className="detailC"><strong>First Name:</strong> {info.FirstName}</div>
                    <div className="detailC"><strong>Last Name:</strong> {info.LastName}</div>
                    <div className="detailC"><strong>Date of Birth:</strong> {new Date(info.BirthDate).toLocaleDateString() || "Not provided"}</div>
                    <div className="detailC"><strong>Gender:</strong> {info.Gender || "Not provided"}</div>
                    <div className="detailC"><strong>Membership Status:</strong> {info.isMember ? "Member" : "Not a Member"}</div>
                    {info.isMember == "1" && (
                        <div className="detailC"><strong>Renewing Membership:</strong> {info.isRenewing ? "Yes" : "No"}</div>
                    )}
                    {info.isMember == "1" && (
                        <div className="detailC"><strong>Years as a Member:</strong> {info.YearsOfMembership}</div>
                    )}
                    {info.isMember == "1" && (
                        <div className="detailC"><strong>Membership End/Renewal Date:</strong> {new Date(info.DateOfExpiration).toLocaleDateString() || "Not provided"}</div>
                    )}
                    <div className="detailC"><strong>Email:</strong> {email}</div>
                    <div className="detailC"><strong>Password:</strong> ********</div>
                </div>
                <div>
                    <button className="saveButtonC" onClick={handleClick}>Edit Account</button>
                </div>
                
                <div className='accountMembershipDetailsContainer'>
                    {info.isMember == "0" &&(
                        <div className='accountMembershipDetailsArea'>
                            <p>Not a Member?</p>
                            <button className="membershipSubscribeButton" onClick={subscribeNow}>Subscribe Now</button>
                        </div>
                    )}
                </div>

            </div>
            
        </div>
    );
};

export default AccountDetails;
