import React from 'react'
import "./FrontPage.css"
import { Link } from 'react-router-dom'
import floor1Image from "../assets/floor1.png"
import floor2Image from "../assets/floor2.png"
import floor3Image from "../assets/floor3.png"
import legendImage from "../assets/map_legend.png"


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
            

            <div className="rules-container">
                <div className="imageRules-section"></div>

                <div className="rules-section">
                    <h1>Museum Visitor Guidelines</h1>

                    <section>
                        <h2>General Behavior</h2>
                        <ul>
                            <li>No running around in the museum.</li>
                            <li>Please avoid yelling or creating loud noise to maintain a calm atmosphere.</li>
                            <li>Respect all art pieces; do not touch unless allowed.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Photography and Videography</h2>
                        <ul>
                            <li>Photography is allowed in most areas, but please refrain from using flash.</li>
                            <li>Video recording is restricted in some exhibitions. Please check signage at the exhibit.</li>
                            <li>Please keep in mind that other people might not want to be recorded, so please take caution.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Food and Drink</h2>
                        <ul>
                            <li>Food and drinks are not allowed inside the museum galleries.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Children and Supervision</h2>
                        <ul>
                            <li>Children must be accompanied by an adult at all times.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Accessibility</h2>
                        <ul>
                            <li>The museum is fully wheelchair accessible.</li>
                            <li>Service animals are welcome in all areas of the museum.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Ticketing and Admission</h2>
                        <ul>
                            <li>Tickets can be purchased at the front desk or online.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Bag Policy</h2>
                        <ul>
                            <li>Large bags and backpacks are not allowed since it can knock over displays.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>No Smoking</h2>
                        <ul>
                            <li>Smoking is not permitted within the museum or on the premises.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Emergency Protocols</h2>
                        <ul>
                            <li>In case of an emergency, please follow the designated evacuation routes and listen for announcements.</li>
                        </ul>
                    </section>

                </div>
            </div>




            <div className="map-container">
                <h1>Museum Floor Map</h1>

                <div className="floor-maps">
                    <div className="map-item">
                        <img
                            src={floor1Image}
                            alt="Floor 1"
                            className="floor-image"
                        />
                        <div className="description">
                            <h3>Floor 1</h3>
                            <p>This floor houses the museum's main entrance, the ticketing area, the permanent exhibits, and the gift shop.</p>
                        </div>
                    </div>

                    <div className="map-item">
                        <img
                            src={floor2Image}
                            alt="Floor 2"
                            className="floor-image"
                        />
                        <div className="description">
                            <h3>Floor 2</h3>
                            <p>This floor contains the permanent exhibits as well as some of the special exhibits that changes every month.</p>
                        </div>
                    </div>

                    <div className="map-item">
                        <img
                            src={floor3Image}
                            alt="Floor 3"
                            className="floor-image"
                        />
                        <div className="description">
                            <h3>Floor 3</h3>
                            <p>Floor 3 is dedicated to special exhibits and events such as workshops, performances, conferences and networking.</p>
                        </div>
                    </div>

                    <div className="map-item">
                        <img
                            src={legendImage}
                            alt="Floor 4"
                            className="floor-image"
                        />
                        <div className="description">
                            <h3>Legend</h3>
                            <p>Each room are color coded based on their purposes. Only employees and managers are allowed in the operational rooms.</p>
                        </div>
                    </div>
                </div>
            </div>

            


        </div>
    );
};

export default FrontPage