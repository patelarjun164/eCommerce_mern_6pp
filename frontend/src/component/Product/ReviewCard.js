import React from 'react';
import RatingStar from 'react-rating-stars-component';
import profilePng from '../../images/Profile.png'

const ReviewCard = ({ review }) => {
    const options = {
        edit: false,
        color: "rgba(20,20,20,.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: review.rating,
        isHalf: true,
    }
    return (
        <div>
            <div className="reviewCard">
                <img src={profilePng} alt='User' />
                <p>{review.name}</p>
                <RatingStar {...options} />
                <span>{review.comment}</span>
            </div>
        </div>
    )
}

export default ReviewCard
