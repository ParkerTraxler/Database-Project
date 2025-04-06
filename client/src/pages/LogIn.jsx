import React from 'react'
import { useState } from 'react'
import axios from 'axios' //api calls
import { useAuth } from '../utils/AuthContext'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import './LogIn.css' // SignUp.jsx also uses LogIn.css


const LogIn = () => {
    console.log("LogIn")
    const { login } = useAuth()
    const invalidChars = /[+=*\/<>"'|~`()^_{}[\]?]/;

    const [userData, setLogin] = useState({ //login json inialized to be empty
        email:"",
        password:"",
    })

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) =>{ // given target to given value
        setLogin(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(userData)
    }

    const navigate = useNavigate()

    const handleClick = async (e) => {
        console.log(userData)
        if (invalidChars.test(userData.email)) {
            setErrorMessage("Email has invalid characters.");
            return;
        }
        else if (invalidChars.test(userData.password)) {
            setErrorMessage("Password has invalid characters.");
            return;
        }
        else{
            e.preventDefault()  //prevents page refresh on button click
            
            try{
                const res = await axios.post("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/auth/login", userData)
                const { message, token, error } = res.data
                console.log(res.data)
                console.log(message)
                const decoded = jwtDecode(token)
                const role = decoded.role
                console.log("Role: " + role)
                console.log(error)
                
                login(userData.email, role, token)
                navigate('/')
            }
            catch(err){
                console.log(err);
            }
        }
    }

    return(
        <div className="loginContainer">
            <div className="login-box">
                
                <h1>Log In</h1>
                <div className="error">{errorMessage}</div>
                <div className="input-groupLogin">
                    Email
                    <input className="loginInput" type="email" placeholder="Enter your email"  maxLength="30" onChange={handleChange} name="email"/>
                </div>

                <div className="input-groupLogin">
                    Password
                    <input className="loginInput" type="password" placeholder="Enter your password" maxLength="16" onChange={handleChange} name="password"/>
                </div>
                <div className="no-account">
                  <a href="/sign-up" style={{textDecoration: "none", color: "inherit"}}>Don't have an account? Sign Up</a>
                </div>
                <button onClick={handleClick} className="submit-buttonLogin">Log In</button> 
            </div>
        </div>
        
    )
}

export default LogIn