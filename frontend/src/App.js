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
import Shipping from './component/Cart/Shipping.jsx';
import Cart from './component/Cart/Cart.jsx';
import ConfirmOrder from './component/Cart/ConfirmOrder.jsx';
import OrderSuccess from './component/Cart/OrderSuccess.jsx';
import Payment from './component/Cart/Payment.jsx';
import MyOrders from './component/Order/MyOrders.jsx';
import OrderDetails from './component/Order/OrderDetails.jsx';
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

          <Route path="/shipping"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />

          <Route path="/order/confirm"
            element={
              <ProtectedRoute>
                <ConfirmOrder />
              </ProtectedRoute>
            }
          />

          <Route path="/process/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route path="/success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          <Route path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route path="/order/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
