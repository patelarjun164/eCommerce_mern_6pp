import './App.css';
import Header from './component/layout/Header/Header';
import UserOptions from './component/layout/Header/UserOptions';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from 'webfontloader';
import React, { useEffect } from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products';
import Search from './component/Product/Search';
import Profile from './component/User/Profile';
import LoginSignUp from './component/User/LoginSignUp';
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Shipping from './component/cart/Shipping';
import Cart from './component/cart/Cart'
import ConfirmOrder from './component/cart/ConfirmOrder';
import OrderSuccess from './component/cart/OrderSuccess';
import Payment from './component/cart/Payment';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetails';
import Dashboard from './component/Admin/Dashboard';
import ProductList from './component/Admin/ProductList';
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct';
import OrderList from './component/Admin/OrderList';
import ProcessOrder from './component/Admin/ProcessOrder';
import UsersList from './component/Admin/UsersList';
import UpdateUser from './component/Admin/UpdateUser';
import ProductReviews from './component/Admin/ProductReviews';
import NotFound from './component/layout/NotFound/NotFound';
import { loadUser } from './actions/userAction.js';
import { useSelector } from 'react-redux';
import store from './store.js';
import ScrollToTop from './component/Hooks/ScrollToTop.js';
import About from './component/layout/About/About';
import Contact from './component/layout/Contact/Conatct'
import EmailVerify from './component/EmailVerify/EmailVerify';
import Tribute from './component/Route/Tribute/Tribute';

function App() {
  const { user, isAuthenticated, loading } = useSelector(state => state.user);

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
      {isAuthenticated && !loading && <UserOptions user={user} />}
      <Routes>
        <Route extact path='/' element={<Home />} />
        <Route extact path='/product/:id' element={<ProductDetails />} />
        <Route extact path='/products' element={<Products />} />
        <Route path='/products/:keyword' element={<Products />} />

        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/aashish' element={<Tribute />} />

        <Route extact path='/search' element={<Search />} />
        <Route extact path='/login' element={<LoginSignUp />} />
        <Route extact path='/cart' element={<Cart />} />

        <Route exact path='/password/forgot' element={<ForgotPassword />} />
        <Route exact path='/password/reset/:token' element={<ResetPassword />} />
        <Route exact path='/user/:id/verify/:verificationToken' element={<EmailVerify />} />

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
