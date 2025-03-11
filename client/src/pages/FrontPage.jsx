import React from 'react'
import "./FrontPage.css"
import { Link } from 'react-router-dom'

const FrontPage = () => {


    return(
        <div className = "frontPageStyle">
            <div className="imageStyle">
                <div className="textStyle">
                    <h1>WELCOME TO</h1>
                    <h1>SHASTA'S</h1>
                    <h1>FINE</h1>
                    <h1>ARTS</h1>
                    <h1>MUSEUM</h1>
                </div>
            </div>

            <div className="aboutStyle">
                <div class="heading">
                    About Us
                </div>
                <div className="white-box">
                    <h2>Our History</h2>
                    <p>Founded in 1978, Shasta’s Fine Arts Museum began as a small collection of works. Over the years, it has grown into one of the most respected cultural institutions.</p>
                    <h2>Our Vision</h2>
                    <p>Our vision is to foster a deeper appreciation of art in all its forms. We believe that art has the power to inspire, provoke thought, and challenge perceptions.</p>
                    <h2>Visit Us</h2>
                    <p>Whether you’re an artist, a student, or someone with a passion for culture, Shasta's Fine Arts Museum is a space where imagination thrives.</p>
                </div>
            </div>

            <div className="home-container">
                <div className="image-section"></div>

                <div className="info-section">
                    <h2>Operating Hours</h2>
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 6:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                </div>
            </div>

            


        </div>
    );
};

export default FrontPage