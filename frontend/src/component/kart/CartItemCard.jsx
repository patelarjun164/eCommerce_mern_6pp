import React from 'react';
import { Link } from 'react-router-dom';
import "./CartItemCard.css";
import { useDispatch } from "react-redux";
import { removeCartItem } from "../../actions/cartAction.js";
import { useAlert } from 'react-alert';

const CartItemCard = ({ item }) => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const removeItemHandler = () => {
        dispatch(removeCartItem(item.product));
        alert.success(`${item.name} Successfully Removed From Cart`);
    }

    return (
        <div className='CartItemCard'>
            <img src={item.image} alt='cartimg' />
            <div>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <span>{`Price: ₹${item.price}`}</span>
                <p onClick={removeItemHandler}>Remove</p>
            </div>
        </div>
    )
}

export default CartItemCard;
