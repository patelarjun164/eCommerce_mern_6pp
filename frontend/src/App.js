import './App.css';
import Header from './component/layout/Header/Header';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import WebFont from 'webfontloader';
import React from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.jsx';
import Search from './component/Product/Search.jsx';

function App() {

  React.useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans", "Chilanka"],
      },
    });
  }, [])

  return (
    <div className="App">
    <Router>
      <Header />
      <Routes>
        <Route extact path='/' Component={Home} />
        <Route extact path='/product/:id' Component={ProductDetails} />
        <Route extact path='/products' Component={Products} />
        <Route path='/products/:keyword' Component={Products} />
        <Route extact path='/search' Component={Search} />
      </Routes>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
