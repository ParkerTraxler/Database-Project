import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios' //api calls
import './LogIn.css'

const SignUp = () => {
    console.log("SignUp")
    const invalidChars = /[+=*\/<>"'|~`()^_{}[\]?]/;
    const { login } = useAuth()

    const [signup, setSignUp] = useState({
        firstName:"",
        lastName:"",
        email: "",
        password1: "",
        password2: "",
    })
    
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState("");
    
    const handleChange = (e) =>{ // given target to given value
        setSignUp(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(signup)
    }

    

    const handleClick = async (e) => {
        console.log(signup)
        if(signup.password1 !== signup.password2){
            setErrorMessage("Passwords don't match.");
            return;
        }
        else if (invalidChars.test(signup.email)) {
            setErrorMessage("Email has invalid characters.");
            return;
        }
        else if (invalidChars.test(signup.password1)) {
            setErrorMessage("Password has invalid characters.");
            return;
        }
        else if (signup.password1.length < 8){
            setErrorMessage("Password is too short.");
            return;
        }
        else{
            e.preventDefault()  //prevents page refresh on button click
            try{
                const res = await axios.post("http://localhost:3002/auth/register", {
                    firstname: signup.firstName,
                    lastname: signup.lastName,
                    email: signup.email,
                    password1: signup.password1
                })

                const { message, token } = res.data

                console.log(res.data)
                console.log(message)
                console.log("token: "+token)

                login(signup.email, 'Customer', token)
                navigate("/")
            }
            catch(err){
                console.log(err);
            }
        }
    }

    return(
        <div className="loginContainer">
            <div className="login-box">
                
                <h1>Sign Up</h1>
                <div className="error">{errorMessage}</div>
                <div className="input-groupLogin">
                    First Name
                    <input className="loginInput" type="text" onChange={handleChange} maxLength="30" placeholder="First Name" name="firstName"/>
                </div>
                <div className="input-groupLogin">
                    Last Name
                    <input className="loginInput" type="text" onChange={handleChange} maxLength="30" placeholder="Last Name" name="lastName"/>
                </div>
                <div className="input-groupLogin">
                    Email
                    <input className="loginInput" type="email" onChange={handleChange} maxLength="30" placeholder="Enter your email" name="email"/>
                </div>

                <div className="input-groupLogin">
                    Password (8-16 characters)
                    <input className="loginInput" type="password" onChange={handleChange} maxLength="16" placeholder="Enter your password"  name="password1"/>
                </div>
                <div className="input-groupLogin">
                    Re-enter Password
                    <input className="loginInput" type="password" onChange={handleChange} maxLength="16" placeholder="Re-enter your password"  name="password2"/>
                </div>
                <div className="no-account">
                    <a href="/log-in" style={{textDecoration: "none", color: "inherit"}}>Already have an account? Log In</a>
                </div>
                <button onClick={handleClick} className="submit-buttonLogin">Sign up</button> 
            </div>
        </div>
    )
}

export default SignUp