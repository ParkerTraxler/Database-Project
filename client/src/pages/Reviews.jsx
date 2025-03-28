import React from 'react'
import { FaStar, FaStarHalf, FaStarHalfAlt } from "react-icons/fa";
import { useState } from 'react'
import './Reviews.css'

const Reviews = () => {
    console.log("Reviews")
    
    const [review, setReview] = useState({
        rating: 0,
        description: "",
        reviewDate: null,
    })
    
    const stars = Array(5).fill(0)
    
      
    return(
        <div>
            <div className="reviewsBanner">
                <h1>Reviews</h1>
            </div>
            <div>
                Reviews
                <div className='starReview'>
                    {stars.map((_, index) => {
                        let rating = 3.5;
                        return (
                            <div key={index} >
                                <FaStarHalf size={24} color={(rating) > index ? 'gold' : 'grey'} />
                                <FaStarHalf className="mirroredStar" size={24} color={(rating) > index + 0.5 ? 'gold' : 'grey'}/>
                            </div>   
                        );
                    })}
                </div>           
                <a href = "/write-review">Review Us!</a>
            </div>
        </div>
    )
}

export default Reviews