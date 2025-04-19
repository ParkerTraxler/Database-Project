import React, { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../utils/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./WriteReview.css";

const WriteReview = () => {
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

    const navigate = useNavigate()

    const handleClick = (index, isHalf) => {
        setReview({ ...review, starcount: isHalf ? index + 0.5 : index + 1 });
        console.log(review)
    };

    const handleHover = (index, isHalf) => {
        setHover(isHalf ? index + 0.5 : index + 1);
    };

    const handleMouseLeave = () => {
        setHover(0);
    };

    const handleSubmit = async e => {
        e.preventDefault()  //prevents page refresh on button click
        try{
            console.log("POST Sent")
            const res = await axios.post(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/reviews`, {
                email: email,
                starcount: review.starcount, 
                reviewdesc: review.reviewdesc
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log("POST Completed")
            console.log(res.end)
            
            navigate("/reviews")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    };

    return (
        <div className="writeReviewPage">
            <div className="writeReview-box">
                <h1 className="Header">Write a Review</h1>
                <div className="input-groupWriteReview">

                    {/* Star Rating Section */}
                    <div className="starReview" onMouseLeave={handleMouseLeave}>
                        {[...Array(5)].map((_, index) => {
                            const fullStar = (hover || review.starcount) > index + 0.5;
                            const halfStar = (hover || review.starcount) > index && (hover || review.starcount) < index + 1;

                            return (
                                <span key={index} style={{ cursor: "pointer", position: "relative" }}>
                                    {/* left half star, click for half rating */}
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

                                    {/* right half star, click for full rating */}
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

                                    {/* render full/half star */}
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
                    <textarea className="writingReviewArea"
                        placeholder="What should other customers know?" 
                        maxLength="650"
                        name="review"
                        onChange={(e) => setReview({ ...review, reviewdesc: e.target.value })}
                    ></textarea>
                </div>
                <button className="submitWriteReviewButton" onClick={handleSubmit}>Submit Review</button> {/*TEMPORARY*/ }

                <a href = "/edit-review">Edit a Review</a>
            </div>
        </div>
    );
};

export default WriteReview;
