import React from 'react'
import { FaStar, FaStarHalf, FaStarHalfAlt } from "react-icons/fa";
import { useState, useEffect } from 'react'
import axios from 'axios';
import './Reviews.css'

const Reviews = () => {
    console.log("Reviews")
    
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true); // Track loading status
    

    useEffect(()=>{
        const fetchAllReviews = async ()=>{
            try{
                const res = await axios.get("http://localhost:3002/reviews")
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
            <h1>Reviews</h1>
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
                    <p>No reviews found.</p>  // Handle case when reviews array is empty
                ))}


            
                       
            <a href = "/write-review">Review Us!</a>
        </div>
    )
}

export default Reviews