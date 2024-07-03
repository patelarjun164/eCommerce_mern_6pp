import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import "./Products.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader.jsx";
import ProductCard from "../Home/ProductCard.js";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Metadata from "../layout/MetaData.js";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 50000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
  };

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [alert, dispatch, error, keyword, currentPage, price, category, ratings]);

  let count = filteredProductsCount;
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Metadata title="Products -- ECommerce" />
          <h2 className="productsHeading">Products</h2>

          {products.length !== 0 ? (
            <div className="products">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          ) : (
            <div className="na">
              <p>Products Not Available for combination!!</p>
            </div>
          )}

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              className="slider"
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={50000}
            />

            <Typography>Category</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>

              <Slider
                aria-label="Temperature"
                defaultValue={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                valueLabelDisplay="on"
                shiftStep={3}
                marks
                step={1}
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {
            //if only one page then not no display pagination
            resultPerPage < count && (
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  pageRangeDisplayed={5}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            )
          }
        </>
      )}
    </>
  );
};

export default Products;
