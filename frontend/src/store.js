import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';

import {thunk} from "redux-thunk";

import { composeWithDevTools } from "@redux-devtools/extension";
import { productReducer, productDetailsReducer } from './reducers/productReducer';

const reducer = combineReducers({
    products: productReducer,
    productDetails: productDetailsReducer,
});

let inititalState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    inititalState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;