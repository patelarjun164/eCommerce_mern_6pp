import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/slices/userSlice';
import { productsReducer, productDetailsReducer, newReviewReducer, newProductReducer, productReducer, productReviewsReducer, reviewReducer } from './reducers/productReducer';
import { cartReducer } from './reducers/cartReducer';
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from './reducers/orderReducer';

const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        newReview: newReviewReducer,
        user: userReducer,
        cart: cartReducer,
        newOrder: newOrderReducer,
        myOrders: myOrdersReducer,
        orderDetails: orderDetailsReducer,
        newProduct: newProductReducer,
        product: productReducer,
        allOrders: allOrdersReducer,
        order: orderReducer,
        productReviews: productReviewsReducer,
        review: reviewReducer,
    },
    preloadedState: {
        cart: {
            cartItems: localStorage.getItem('cartItems')
                ? JSON.parse(localStorage.getItem('cartItems'))
                : [],
            shippingInfo: localStorage.getItem('shippingInfo')
                ? JSON.parse(localStorage.getItem('shippingInfo'))
                : {},
        },
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
