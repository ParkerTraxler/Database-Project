import React from 'react'
import { FaStar, FaStarHalf, FaStarHalfAlt } from "react-icons/fa";
import { useState, useEffect } from 'react'
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import './Reviews.css'

const Reviews = () => {
    console.log("Reviews")
    
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true); // Track loading status
    
    const { user } = useAuth()
    const role = user?.role

    useEffect(()=>{
        const fetchAllReviews = async ()=>{
            try{
                const res = await axios.get("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/reviews")
                console.log(res.data)
                setReviews(res.data)
                console.log(reviews)
            }catch(err){
                console.log(err)
            } finally {
                setLoading(false);  // Stop loading after request completes
            }
        }
        fetchAllReviews()
    },[])
    
    const stars = Array(5).fill(0)
    
      
    return(
        <div>
            <div className="reviewsBanner">
                <h1>Reviews</h1>
            </div>
            <div>
                <h1>Reviews</h1>
                <div className="reviewsContainer">
                    {loading ? (
                        <p>Loading reviews...</p>  // Show a loading message while waiting for data
                    ) : (
                        reviews.length > 0 ? (
                        
                        reviews.map(review=>(
                        
                            <div className="review" key={review.CustomerID}>
                                <div>{review.Name}</div>
                                <div>{new Date(review.ReviewDate).toLocaleDateString() || "Not provided"}</div>
                                <p>{review.ReviewDesc}</p>
                                <div className='starReview'>
                                {stars.map((_, index) => {
                                    return (
                                        <div key={index} >
                                            <FaStarHalf size={24} color={(review.StarCount) > index ? 'gold' : 'grey'} />
                                            <FaStarHalf className="mirroredStar" size={24} color={(review.StarCount) > index + 0.5 ? 'gold' : 'grey'}/>
                                        </div>   
                                    );
                                })}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Handle case when reviews array is empty
                        <div>
                            <p className="no-reviews-found">No reviews found!</p>
                            {role == 'Customer' && (
                            <a href="/write-review" className="be-the-first">Be the first!</a>
                            )}
                        </div>
                    ))}
                </div>

                <div className="reviewUsButtonContainer">
                    {role == 'Customer' && (
                        <a href={reviews.length > 0 ? "/write-review" : ""} className={reviews.length > 0 ? "review-us" : ""}>{reviews.length > 0 ? "Review Us!" : ""}</a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Reviews