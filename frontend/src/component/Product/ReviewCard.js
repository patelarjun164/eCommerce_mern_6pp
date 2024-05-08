import React from 'react';
import { Rating } from "@material-ui/lab";
import profilePng from '../../images/Profile.png'

const ReviewCard = ({ review }) => {
    const options = {
        value: review.rating,
        readOnly: true,
        precision: 0.5,
      }
    return (
        <div>
            <div className="reviewCard">
                <img src={ review.avatar ? review.avatar : profilePng} alt='User' />
                <p>{review.name}</p>
                <Rating {...options} />
                <span>{review.comment}</span>
            </div>
        </div>
    )
}

export default ReviewCard
