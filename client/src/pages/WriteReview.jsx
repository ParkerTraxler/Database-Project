import React from 'react'
import { useState } from 'react'
import './WriteReview.css'

const WriteReview = () => {
    
    return(
        <div className="container">
            <div className="Review-box">
                
                <h1 className="Header">Write a Review</h1>
                <div className="input-group">
                    First Name:
                    <input type="First Name" placeholder="First Name"  maxLength="30" name="firstname"/>
                    Last Name:
                    <input type="Last Name" placeholder="Last Name"  maxLength="30" name="lastname"/>
                </div>

                <div className="no-account">
                    Don't have an account? <a href="/sign-up">Sign Up</a>
                </div>
            </div>
        </div>
    )
}

export default WriteReview