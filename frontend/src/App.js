import './App.css';
import Header from './component/layout/Header/Header';
import UserOptions from './component/layout/Header/UserOptions.jsx';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from 'webfontloader';
import React from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.jsx';
import Search from './component/Product/Search.jsx';
import Profile from './component/User/Profile.jsx';
import LoginSignUp from './component/User/LoginSignUp.jsx';
import ProtectedRoute from './component/Route/ProtectedRoute.jsx';
import UpdateProfile from './component/User/UpdateProfile.jsx';
import UpdatePassword from './component/User/UpdatePassword.jsx';
import ForgotPassword from './component/User/ForgotPassword.jsx';
import ResetPassword from './component/User/ResetPassword.jsx';
import Cart from './component/Cart/Cart.jsx';
import store from './store.js';
import { loadUser } from './actions/userAction.js';
import { useSelector } from 'react-redux';

function App() {
  const { user, isAuthenticated } = useSelector(state => state.user);

  React.useEffect(() => {
    
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
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
          <Route extact path='/' element={<Home />} />
          <Route extact path='/product/:id' element={<ProductDetails />} />
          <Route extact path='/products' element={<Products />} />
          <Route path='/products/:keyword' element={<Products />} />
          <Route extact path='/search' element={<Search />} />
          <Route exact path="/account"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route exact path="/me/update"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route exact path="/password/update"
            element={
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route exact path="/password/forgot" element={<ForgotPassword />} />
          <Route exact path="/password/reset/:token" 
              element={<ResetPassword />} />
          <Route extact path='/login' element={<LoginSignUp />} />
          <Route extact path='/cart' element={<Cart />} />

        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
