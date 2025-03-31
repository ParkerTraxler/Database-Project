import React from 'react'
import "./FrontPage.css"
import { Link } from 'react-router-dom'
import floor1Image from "../assets/floor1.png"
import floor2Image from "../assets/floor2.png"
import floor3Image from "../assets/floor3.png"
import legendImage from "../assets/map_legend.png"
import FAQPage from './FAQPage'


const FrontPage = () => {


    return(
        <div className = "frontPageContainer">
            <div className="firstPageContainer">
                <div className="firstPageMessage">
                    <h1>WELCOME TO</h1>
                    <h1>SHASTA'S</h1>
                    <h1>FINE</h1>
                    <h1>ARTS</h1>
                    <h1>MUSEUM</h1>
                </div>
            </div>

            <div className="aboutPageContainer">
                <div className="aboutPageHeading">
                    About Us
                </div>
                <div className="aboutPageBox">
                    <h2>Our History</h2>
                    <p>Founded in 1978, Shasta’s Fine Arts Museum started as a small art room, but thanks to artists around the world and our donors, we have greatly scaled and became recognized as the largest cultural center.</p>
                    <h2>Our Vision</h2>
                    <p>Our vision is to educate and promote the appreciation of all forms of art. We believe that art has the ability to stimulate individuality and interpret the world around us differently.</p>
                    <h2>Visit Us</h2>
                    <p>Whether you're new to the fine arts realm or a local, Shasta's Fine Arts Museum is where creativity from different parts of the world gets recognized.</p>
                </div>
            </div>

            <div className="hoursPageContainer">
                <div className="hoursPageImage"></div>

                <div className="hoursPageInfo">
                    <h2>Operating Hours</h2>
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 6:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                </div>
            </div>
            

            <div className="rulesPageContainer">
                <div className="rulesPageImage"></div>

                <div className="rulesPageInfo">
                    <h1>Museum Visitor Guidelines</h1>

                    <section>
                        <h2>General Behavior</h2>
                        <ul>
                            <li>No running around in the museum.</li>
                            <li>No yelling or creating unwanted attention.</li>
                            <li>Do not touch the art pieces unless it's explicitly allowed.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Photography and Videography</h2>
                        <ul>
                            <li>Photography is allowed, but refrain from using flash feature.</li>
                            <li>Videography is allowed, but keep in mind of other people not wanting to be recorded.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Food and Drink</h2>
                        <ul>
                            <li>Food and drinks are not allowed inside the museum exhibits.</li>
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
                            <li>Sign language interpreters are available upon request.</li>
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
                            <li>Smoking is not allowed inside the museum.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Emergency Protocols</h2>
                        <ul>
                            <li>In the event of an emergency, please follow the designated evacuation routes.</li>
                        </ul>
                    </section>

                </div>
            </div>




            <div className="mapPageContainer">
                <h1>Museum Floor Map</h1>

                <div className="mapPageFloors">
                    <div className="mapFloorContainer">
                        <img
                            src={floor1Image}
                            alt="Floor 1"
                            className="mapFloorImage"
                        />
                        <div className="mapFloorDesc">
                            <h3>Floor 1</h3>
                            <p>This floor houses the museum's main entrance, the ticketing area, the permanent exhibits, and the gift shop.</p>
                        </div>
                    </div>

                    <div className="mapFloorContainer">
                        <img
                            src={floor2Image}
                            alt="Floor 2"
                            className="mapFloorImage"
                        />
                        <div className="mapFloorDesc">
                            <h3>Floor 2</h3>
                            <p>This floor contains the permanent exhibits as well as some of the special exhibits that changes frequently.</p>
                        </div>
                    </div>

                    <div className="mapFloorContainer">
                        <img
                            src={floor3Image}
                            alt="Floor 3"
                            className="mapFloorImage"
                        />
                        <div className="mapFloorDesc">
                            <h3>Floor 3</h3>
                            <p>Floor 3 is dedicated to special exhibits and events such as workshops, performances, conferences, and networking.</p>
                        </div>
                    </div>

                    <div className="mapFloorContainer">
                        <img
                            src={legendImage}
                            alt="Floor 4"
                            className="mapFloorImage"
                        />
                        <div className="mapFloorDesc">
                            <h3>Legend</h3>
                            <p>Each room are color coded based on their purposes. Only employees and managers are allowed in the operational rooms.</p>
                        </div>
                    </div>
                </div>
            </div>

            


            <div className="parkingPageContainer">
                <div className="parkingPageBox">
                    <h1>Parking Information</h1>
                    <ul>
                        <li>We offer a plethora of parking choices based on your preferences.</li>
                        <li>We accept: Credit/Debit cards, Cash, and Text to Pay.</li>
                    </ul>
                    <h2>Shasta's Parking Garage</h2>
                    <ul>
                        <li>Located to the left of the museum's main entrance.</li>
                        <li>Open Monday to Friday: 8:30 AM - 11 PM.</li>
                        <li>Open Saturday: 9:30 AM - 8 PM.</li>
                        <li>Rate: $3.99 per hour.</li>
                    </ul>
                    <h2>Parking Lots and Street Parking (Open 24/7)</h2>
                    <ul>
                        <li>Parking Lot Zone A (6 minute walk): $2.79 per hour.</li>
                        <li>Parking Lot Zone B (8 minute walk): $2.29 per hour.</li>
                        <li>Street Parking: Free from 5:00 PM - 7:00 AM, otherwise $1.89 per hour.</li>
                    </ul>
                </div>
            </div>
            


            <div className="contactPageContainer">
                <div className="contactPageImage"></div>

                <div className="contactPageInfo">
                    <h2>Contact Us</h2>
                    <p><strong>Address:</strong> 1008 Josie St, Houston, TX 77005</p>
                    <p><strong>Email:</strong> shastasfamuseum@gmail.com</p>
                    <p><strong>Phone:</strong> 281-529-3380</p>
                </div>
            </div>



            <FAQPage/>
            

        </div>
    );
};

export default FrontPage