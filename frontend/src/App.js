import './App.css';
import Header from './component/layout/Header/Header';
import UserOptions from './component/layout/Header/UserOptions.jsx';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from 'webfontloader';
import React, { useEffect } from 'react';
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
import Dashboard from './component/Admin/Dashboard.jsx';
import ProductList from './component/Admin/ProductList.jsx';
import NewProduct from './component/Admin/NewProduct.jsx';
import UpdateProduct from './component/Admin/UpdateProduct.jsx';
import OrderList from './component/Admin/OrderList.jsx';
import ProcessOrder from './component/Admin/ProcessOrder.jsx';
import UsersList from './component/Admin/UsersList.jsx';
import UpdateUser from './component/Admin/UpdateUser.jsx';
import ProductReviews from './component/Admin/ProductReviews.jsx';
import NotFound from './component/layout/NotFound/NotFound.jsx';
import { loadUser } from './actions/userAction.js';
import { useSelector } from 'react-redux';
import store from './store.js';
import ScrollToTop from './component/Hooks/ScrollToTop.js';
import About from './component/layout/About/About.jsx';
import Contact from './component/layout/Contact/Conatct.jsx'

function App() {
  const { user, isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {


    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

  }, [])

  return (
    <Router>
      <ScrollToTop />
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route extact path='/' element={<Home />} />
        <Route extact path='/product/:id' element={<ProductDetails />} />
        <Route extact path='/products' element={<Products />} />
        <Route path='/products/:keyword' element={<Products />} />

        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />

        <Route extact path='/search' element={<Search />} />
        <Route extact path='/login' element={<LoginSignUp />} />
        <Route extact path='/cart' element={<Cart />} />

        <Route exact path='/password/forgot' element={<ForgotPassword />} />
        <Route exact path='/password/reset/:token' element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route exact path='/account' element={<Profile />} />
          <Route exact path='/me/update' element={<UpdateProfile />} />
          <Route exact path='/password/update' element={<UpdatePassword />} />

          <Route path='/shipping' element={<Shipping />} />
          <Route path='/order/confirm' element={<ConfirmOrder />} />
          <Route path='/process/payment' element={<Payment />} />
          <Route path='/success' element={<OrderSuccess />} />
          <Route path='/orders' element={<MyOrders />} />
          <Route path='/order/:orderId' element={<OrderDetails />} />
        </Route>

        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/products' element={<ProductList />} />
          <Route path='/admin/product/:id' element={<UpdateProduct />} />
          <Route path='/admin/product' element={<NewProduct />} />
          <Route path='/admin/orders' element={<OrderList />} />
          <Route path='/admin/order/:id' element={<ProcessOrder />} />
          <Route path='/admin/users' element={<UsersList />} />
          <Route path='/admin/user/:id' element={<UpdateUser />} />
          <Route path='/admin/reviews' element={<ProductReviews />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
