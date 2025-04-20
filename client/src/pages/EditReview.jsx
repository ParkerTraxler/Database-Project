import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../utils/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditReview.css";

const EditReview = () => {
    const [review, setReview] = useState({
        StarCount: "",
        ReviewDesc: ""
    });
    const { user } = useAuth();
    const token = user.token;
    const decoded = jwtDecode(token);
    const email = decoded.email;
    

    const [hover, setHover] = useState(0);

    useEffect(()=>{
        const fetchReview = async ()=>{
            try{
                console.log("GET Sent")
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/reviews/${email}`)
                console.log(res.data)
                console.log("GET Completed")
                setReview(res.data)
                console.log(review)
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchReview()
    },[])

    const handleClick = (index, isHalf) => {
        setReview({ ...review, StarCount: isHalf ? index + 0.5 : index + 1 });
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
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/reviews/`, {
                email: email,
                starcount: review.StarCount, 
                reviewdesc: review.ReviewDesc
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            navigate("/reviews")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    };


    return (
        <div className="editReviewPage">
            <div className="editReview-box">
                <h1 className="Header">Edit your Review</h1>
                <div className="input-groupWriteReview">

                    {/* Star Rating Section */}
                    <div className="starReview" onMouseLeave={handleMouseLeave}>
                        {[...Array(5)].map((_, index) => {
                            const fullStar = (hover || review.StarCount) > index + 0.5;
                            const halfStar = (hover || review.StarCount) > index && (hover || review.StarCount) < index + 1;

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
                    <textarea className="writingReviewArea"
                        placeholder="What should other customers know?" 
                        maxLength="650"
                        name="review"
                        value={review.ReviewDesc}
                        onChange={(e) => setReview({ ...review, ReviewDesc: e.target.value })}
                    ></textarea>
                </div>
                <button className="submitWriteReviewButton" onClick={handleSubmit}>Submit Review</button> {/*TEMPORARY*/ }
            </div>
        </div>
    );
};

export default EditReview;
