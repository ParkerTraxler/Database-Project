import React from 'react'
import { useState } from 'react'
import axios from 'axios' //api calls
import './LogIn.css' // SignUp.jsx also uses LogIn.css


const LogIn = () => {
    console.log("LogIn")
    const invalidChars = /[+=*\/<>"'|~`()^_{}[\]?]/;

    const [login, setLogin] = useState({ //login json inialized to be empty
        email:"",
        password:"",
    })

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) =>{ // given target to given value
        setLogin(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(login)
    }

    const handleClick = async (e) => {
        console.log(login)
        if (invalidChars.test(login.email)) {
            setErrorMessage("Email has invalid characters.");
            return;
        }
        else if (invalidChars.test(login.password)) {
            setErrorMessage("Password has invalid characters.");
            return;
        }
        else{
            e.preventDefault()  //prevents page refresh on button click
            try{
                await axios.post("http://localhost:3000/log-in", login)
            }
            catch(err){
                console.log(err);
            }
        }
    }

    return(
        <div className="container">
            <div className="login-box">
                
                <h1>Log In</h1>
                <div className="error">{errorMessage}</div>
                <div className="input-group">
                    Email
                    <input type="email" placeholder="Enter your email"  maxLength="30" onChange={handleChange} name="email"/>
                </div>

                <div className="input-group">
                    Password
                    <input type="password" placeholder="Enter your password" maxLength="16" onChange={handleChange} name="password"/>
                </div>
                <div className="no-account">
                    Don't have an account? <a href="/sign-up">Sign Up</a>
                </div>
                <button onClick={handleClick}>Log In</button> 
            </div>
        </div>
        
    )
}

export default LogIn