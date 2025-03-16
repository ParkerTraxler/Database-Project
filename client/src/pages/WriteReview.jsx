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

    const handleSubmit = () => {

    };

    return (
        <div className="container">
            <div className="Review-box">
                <h1 className="Header">Write a Review</h1>
                <div className="input-group">
                    <label>First Name:</label>
                    <input className="names" type="text" placeholder="First Name" maxLength="30" name="firstname" />
                    <label>Last Name:</label>
                    <input className="names" type="text" placeholder="Last Name" maxLength="30" name="lastname" />

                    {/* Star Rating Section */}
                    <div className="starReview" onMouseLeave={handleMouseLeave}>
                        {[...Array(5)].map((_, index) => {
                            const fullStar = (hover || review.rating) > index + 0.5;
                            const halfStar = (hover || review.rating) > index && (hover || review.rating) < index + 1;

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
                    <textarea className="Review"
                        placeholder="What should other customers know?" 
                        maxLength="300"
                        name="review"
                        onChange={(e) => setReview({ ...review, description: e.target.value })}
                    ></textarea>
                </div>
                <button onClick={handleClick}>Submit Review</button> {/*TEMPORARY*/ }

                <div className="no-account">
                    Don't have an account? <a href="/sign-up">Sign Up</a>
                </div>
                <a href = "/edit-review">Edit a Review</a>
            </div>
        </div>
    );
};

export default WriteReview;
