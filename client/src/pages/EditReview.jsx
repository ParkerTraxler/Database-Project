import React, { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../utils/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditReview.css";

const EditReview = () => {
    const [review, setReview] = useState({
        email:"",
        starcount:"", 
        reviewdesc:""
    });
    const { user } = useAuth();
    const token = user.token;
    const decoded = jwtDecode(token);
    const email = decoded.email;
    console.log(email)
    

    const [hover, setHover] = useState(0);

    const handleClick = (index, isHalf) => {
        setReview({ ...review, starcount: isHalf ? index + 0.5 : index + 1 });
    };

    const handleHover = (index, isHalf) => {
        setHover(isHalf ? index + 0.5 : index + 1);
    };

    const handleMouseLeave = () => {
        setHover(0);
    };

    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()  //prevents page refresh on button click
        console.log(review)
        try{
            console.log("PUT Sent")
            const res = await axios.put("http://localhost:3002/reviews/", {
                email: email,
                starcount: review.starcount, 
                reviewdesc: review.reviewdesc
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log("PUT Completed")
            console.log(res.end)
            
            navigate("/reviews")
        }
        catch(err){
            console.log(err)
        }
    };


    return (
        <div className="container">
            <div className="Review-box">
                <h1 className="Header">Edit your Review</h1>
                <div className="input-group">

                    {/* Star Rating Section */}
                    <div className="starReview" onMouseLeave={handleMouseLeave}>
                        {[...Array(5)].map((_, index) => {
                            const fullStar = (hover || review.starcount) > index + 0.5;
                            const halfStar = (hover || review.starcount) > index && (hover || review.starcount) < index + 1;

                            return (
                                <span key={index} style={{ cursor: "pointer", position: "relative" }}>
                                    {/* Left Half Star, Click for half rating */}
                                    <span
                                        style={{
                                            position: "absolute",
                                            width: "50%",
                                            height: "100%",
                                            left: 0,
                                            zIndex: 2,
                                        }}
                                        onClick={() => handleClick(index, true)}
                                        onMouseEnter={() => handleHover(index, true)}
                                    />

                                    {/* Right Half Star, Click for full rating */}
                                    <span
                                        style={{
                                            position: "absolute",
                                            width: "50%",
                                            height: "100%",
                                            right: 0,
                                            zIndex: 2,
                                        }}
                                        onClick={() => handleClick(index, false)}
                                        onMouseEnter={() => handleHover(index, false)}
                                    />

                                    {/* Render full or half-star */}
                                    {fullStar ? (
                                        <FaStar size={24} color="gold" />
                                    ) : halfStar ? (
                                        <FaStarHalfAlt size={24} color="gold" />
                                    ) : (
                                        <FaStar size={24} color="grey" />
                                    )}
                                </span>
                            );
                        })}
                    </div>

                    {/* Review Input */}
                    <label>Write a Review:</label>
                    <textarea className="Review"
                        placeholder="What should other customers know?" 
                        maxLength="300"
                        name="review"
                        onChange={(e) => setReview({ ...review, reviewdesc: e.target.value })}
                    ></textarea>
                </div>
                <button onClick={handleSubmit}>Submit Review</button> {/*TEMPORARY*/ }
            </div>
        </div>
    );
};

export default EditReview;
