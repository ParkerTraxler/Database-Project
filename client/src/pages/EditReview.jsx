import React, { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import "./WriteReview.css";

const WriteReview = () => {
    const [review, setReview] = useState({
        rating: 0,
        description: "",
        reviewDate: null,
    });

    const [hover, setHover] = useState(0);

    const handleClick = (index, isHalf) => {
        setReview({ ...review, rating: isHalf ? index + 0.5 : index + 1 });
    };

    const handleHover = (index, isHalf) => {
        setHover(isHalf ? index + 0.5 : index + 1);
    };

    const handleMouseLeave = () => {
        setHover(0);
    };

    return (
        <div className="container">
            <div className="Review-box">
                <h1 className="Header">Edit your Review</h1>
                <div className="input-group">
                    First Name:
                    <input className="names" type="text" placeholder="First Name" maxLength="30" name="firstname" />
                    Last Name:
                    <input className="names" type="text" placeholder="Last Name" maxLength="30" name="lastname" />

                    {/* Star Rating Section */}
                    <div className="starReview" onMouseLeave={handleMouseLeave}>
                        {[...Array(5)].map((_, index) => {
                            const fullStar = (hover || review.rating) > index + 0.5;
                            const halfStar = (hover || review.rating) > index && (hover || review.rating) < index + 1;

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
                    Write a Review:
                    <textarea className="Review"
                        placeholder="What should other customers know?" 
                        maxLength="300"
                        name="review"
                        onChange={(e) => setReview({ ...review, description: e.target.value })}
                    ></textarea>
                </div>
                <button onClick={handleClick}>Submit Review</button> {/*TEMPORARY*/ }
            </div>
        </div>
    );
};

export default WriteReview;
