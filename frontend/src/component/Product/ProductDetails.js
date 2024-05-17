/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './ProductDetails.css';
import Carousel from 'react-material-ui-carousel';
import NoAvailImg from '../../images/Not_Avilable_image.png'
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import ReviewCard from './ReviewCard.js';
import Loader from '../layout/Loader/Loader.jsx';
import { useAlert } from 'react-alert'
import Metadata from '../layout/MetaData.js';
import { addItemsToCart } from '../../actions/cartAction.js';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from '../../constants/productConstants.js';

const ProductDetails = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { product, loading, error } = useSelector((state) => state.productDetails);

  const { success, error: reviewError } = useSelector((state) => state.newReview);
  
  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  }

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReviewToggle = () => {
    setOpen(!open);
  }

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    setQuantity(quantity + 1);
  }

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item added to Cart");
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if(success) {
      alert.success("Review Submitted Successfully")
      dispatch({type: NEW_REVIEW_RESET});
    }
    dispatch(getProductDetails(id));
  }, [alert, dispatch, error, id, reviewError, success])

  return (
    <>
      {loading ? <Loader /> : (
        <>
          <Metadata title={`${product.name}`} />
          <div className="ProductDetails">
            <div>
              <Carousel className='carousel'>
                {product.images === undefined || product.images.length === 0 ?<img className="CarouselImage" src={ NoAvailImg } alt={product.name} /> :
                  product.images.map((item, index) => {
                    return (
                      <img
                        className="CarouselImage"
                        key={item.url}
                        src={item.url}
                        alt={`${index} Slide`}
                      />
                    )
                  })
                }
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    <span> </span>
                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview" onClick={submitReviewToggle}>
                Submit Review
              </button>
            </div>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </>
      )}
    </>
  )
}

export default ProductDetails
