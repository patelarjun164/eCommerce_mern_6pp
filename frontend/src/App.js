import './App.css';
import Header from './component/layout/Header/Header';
import UserOptions from './component/layout/Header/UserOptions.jsx';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import WebFont from 'webfontloader';
import React from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.jsx';
import Search from './component/Product/Search.jsx';
import LoginSignUp from './component/User/LoginSignUp.jsx';
import store from './store.js';
import { loadUser } from './actions/userAction.js';
import { useSelector } from 'react-redux';

function App() {
  const { user, isAuthenticated } = useSelector(state => state.user);

  React.useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans", "Chilanka"],
      },
    });

    
    store.dispatch(loadUser());
  }, [])

  return (
    <div className="App">
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route extact path='/' Component={Home} />
        <Route extact path='/product/:id' Component={ProductDetails} />
        <Route extact path='/products' Component={Products} />
        <Route path='/products/:keyword' Component={Products} />
        <Route extact path='/search' Component={Search} />
        <Route extact path='/login' Component={LoginSignUp} />
      </Routes>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
