/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { CgMouse } from 'react-icons/cg';
import Product from './Product.js';
import './Home.css';
import MetaData from '../layout/MetaData.js';
import { getProduct } from '../../actions/productAction.js';
// eslint-disable-next-line no-unused-vars
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader.jsx';

const product = {
    _id: "Arjun",
    name: "Blue Shirt",
    images: [{
        url: "https://cdn.pixabay.com/photo/2017/08/17/10/23/shirt-2650677_1280.jpg",
    }],
    price: 1200,
};

const Home = () => {
    const dispatch = useDispatch();

    const { loading, error, products, productsCount } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch])

    return (
        <>
            {loading ? 
                <Loader />
             :
                <>
                    <MetaData title="ECommerce" />
                    <div className="banner">
                        <p>Welocme to E-commerce</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>

                        <a href="#container">
                            <button>
                                Scroll <CgMouse />
                            </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>

                    <div className="container" id="container">
                        {products && products.map(product => {
                            return (
                                <Product product={product} />
                            );
                        })}
                    </div>
                </>}
        </>
    )
}

export default Home
