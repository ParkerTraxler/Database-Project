import React from 'react'
import { useState } from 'react'
import axios from 'axios' //api calls
import './LogIn.css'

const SignUp = () => {
    console.log("SignUp")
    const invalidChars = /[+=*\/<>"'|~`()^_{}[\]?]/;

    const [signup, setSignUp] = useState({
        email: "",
        password1: "",
        password2: "",
    })

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
                await axios.post("http://localhost:3000/sign-up", signup)
            }
            catch(err){
                console.log(err);
            }
        }
    }

    return(
        <div className="container">
            <div className="login-box">
                
                <h1>Sign Up</h1>
                <div className="error">{errorMessage}</div>
                <div className="input-group">
                    Email
                    <input type="email" onChange={handleChange} maxLength="30" placeholder="Enter your email" name="email"/>
                </div>

                <div className="input-group">
                    Password (8-16 characters)
                    <input type="password" onChange={handleChange} maxLength="16" placeholder="Enter your password"  name="password1"/>
                </div>
                <div className="input-group">
                    Re-enter Password
                    <input type="password" onChange={handleChange} maxLength="16" placeholder="Re-enter your password"  name="password2"/>
                </div>
                <div className="no-account">
                    Already have an account? <a href="/log-in">Log In</a>
                </div>
                <button onClick={handleClick}>Sign Up</button> 
            </div>
        </div>
    )
}

export default SignUp