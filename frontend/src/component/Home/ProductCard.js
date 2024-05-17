import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { Rating } from "@material-ui/lab";
import NoAvailImg from '../../images/Not_Avilable_image.png';


const ProductCard = ({ product }) => {
    const options = {
        size: "small",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    }
    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            <img src={product.images.length !== 0 ? product.images[0].url : NoAvailImg} alt={product.name} />
            <div className="productDetails">
                <p>{product.name}</p>
                <div>
                    <Rating {...options} />
                    <span className="productCardSpan"> ({product.numOfReviews} Reviews)</span>
                </div>
                <span>{`₹${product.price}`}</span>
            </div>

        </Link>
    )
}

export default ProductCard;
