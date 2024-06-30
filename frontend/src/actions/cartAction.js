import axios from 'axios';
import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";

//Add To Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            seller: data.product.user,
            quantity,
        }
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}

//Remove Cart Item
export const removeCartItem = (id) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
        type: REMOVE_CART_ITEM,
        payload:  data.product._id, 
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}


//Save Shipping Info
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });
  
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };
// export const saveShippingInfo = (data) => async (dispatch, getState) => {
//     dispatch({
//         type: SAVE_SHIPPING_INFO,
//         payload:  {
//             address:data.address,
//             city:data.city,
//             state:data.state,
//             country:data.country,
//             pinCode:data.pinCode,
//             phoneNo:data.phoneNo,
//         }
//     });

//     localStorage.setItem("shippingInfo", JSON.stringify(getState().cart.shippingInfo));
// }
