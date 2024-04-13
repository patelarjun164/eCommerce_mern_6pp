import React, { useState } from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom';
import Metadata from '../layout/MetaData';

const Search = () => {

    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim){
            navigate(`/products/${keyword}`);
        }
        else {
            navigate("/products");
        }
    }

  return (
    <>
    <Metadata title={`Search A Product`} />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input 
            type="text"
            placeholder='Search a Product...'
            onChange={(e) => setKeyword(e.target.value)}
        />
        <input type='submit' value="Search"/>
      </form>
    </>
  )
}

export default Search
