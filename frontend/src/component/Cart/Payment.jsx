import React, { Fragment, useEffect, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import "./Payment.css";
import axios from "axios";
// import { createOrder, clearErrors } from "../../actions/orderActions";
import { clearErrors } from "../../actions/orderActions";
import CompanyLogo from "../../images/logo.png";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
    const navigate = useNavigate();

  //   const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);
  const { user } = useSelector((state) => state.user)
  // eslint-disable-next-line no-unused-vars
  const [orderId, setOrderId] = useState("");

  //   const order = {
  //     shippingInfo,
  //     orderItems: cartItems,
  //     itemsPrice: orderInfo.subtotal,
  //     taxPrice: orderInfo.tax,
  //     shippingPrice: orderInfo.shippingCharges,
  //     totalPrice: orderInfo.totalPrice,
  //   };

  const amount = Math.round(orderInfo.totalPrice);

  const handlePayment = async () => {

    const { data: { key } } = await axios.get("/api/v1/payment/getRzpKey");

    const {
      data: { order },
    } = await axios.post("/api/v1/payment/process", {
      amount,
    });

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "ShoppyNexa",
      description: "Payment of your purchases at ShoppyNexa.com",
      image: CompanyLogo,
      order_id: order.id,
      handler: async function(response) {
        const body = {...response}
        const {data: {success, razorpay_order_id }} = await axios.post("/api/v1/payment/validate", body);

        // console.log(success, razorpay_payment_id, razorpay_order_id);

        if(success){
          navigate(`/success?reference=${razorpay_order_id}`);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#FF6347",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="container">
        <div className="paymentContainer">
          <button onClick={handlePayment} className="buy_btn">
            Pay
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
