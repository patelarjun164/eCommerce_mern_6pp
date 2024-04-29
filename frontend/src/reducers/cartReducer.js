import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;

            const isItemExist = state.cartItems.find(
                (i) => i.product === item.product
            );

            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(
                        (i) => i.product === isItemExist.product ? item : i
                    ),
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                }
            }

        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (i) => i.product !== action.payload
                )
            }

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload,
            };

        // case SAVE_SHIPPING_INFO:
        //     const address = action.payload;
        //     const isAddressExist = state.shippingInfo.find(
        //         (i) => i === address);

        //     if (isAddressExist) {
        //         return {
        //             ...state,
        //             shippingInfo: state.shippingInfo.map(
        //                 (i) => i === isItemExist ? address : i
        //             ),
        //         }
        //     } else {
        //         return {
        //             ...state,
        //             shippingInfo: [...state.cart.shippingInfo, address],
        //         }
        //     }
        
        default:
            return state;
    }
}