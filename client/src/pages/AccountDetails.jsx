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
            axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/profile/${encodeURIComponent(email)}`)
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

    if (isLoading) {
        return <div>Loading account details...</div>; // Display while loading
    }

    return (
        <div className="AccountPage">
            <div className="AccountDetails">
                <h1>Account Details</h1>
                {!info.FirstName && (
                    <div>Loading Info...</div>
                )}
                <div className="detailsBox">
                    <div className="detail"><strong>First Name:</strong> {info.FirstName}</div>
                    <div className="detail"><strong>Last Name:</strong> {info.LastName}</div>
                    <div className="detail"><strong>Date of Birth:</strong> {info.BirthDate || "Not provided"}</div>
                    <div className="detail"><strong>Gender:</strong> {info.Gender || "Not provided"}</div>
                    <div className="detail"><strong>Email:</strong> {email}</div>
                    <div className="detail"><strong>Password:</strong> ********</div>
                </div>
                <div>
                    <button className="saveButton" onClick={handleClick}>Edit Account</button>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
