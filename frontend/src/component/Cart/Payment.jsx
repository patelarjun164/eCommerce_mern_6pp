import React, { Fragment, useEffect} from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import "./Payment.css";
import { createOrder, clearErrors } from "../../actions/orderActions";
import CompanyLogo from "../../images/ShoppyNexxa Logo.png";
import api from "../../api";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);
  const { user } = useSelector((state) => state.user);

  const orderData = {
    shippingInfo,
    orderItems: cartItems,
    itemPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const amount = Math.round(orderInfo.totalPrice);

  const handlePayment = async () => {
    const {
      data: { key },
    } = await api.get("/api/v1/payment/getRzpKey");

    const {
      data: { order },
    } = await api.post("/api/v1/payment/process", {
      amount,
    });

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "ShoppyNexxa",
      description: "Payment of your purchases at ShoppyNexxa.com",
      image: CompanyLogo,
      order_id: order.id,
      handler: async function (response) {
        const body = { ...response };
        // console.log("response", body);
        const {
          data: { success, status, razorpay_order_id, razorpay_payment_id },
        } = await api.post("/api/v1/payment/validate", body);

        // console.log(success, razorpay_payment_id, razorpay_order_id);

        if (success) {
          orderData.paymentInfo = {
            id: razorpay_order_id,
            status: status,
            paymentId: razorpay_payment_id,
          };

          // console.log(orderData);
          dispatch(createOrder(orderData));

          navigate(`/success`);
        } else {
          alert.error("There's some issue while processing payment ");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: "90******26",
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
          <button onClick={handlePayment}>Proceed to Payment Gateway</button>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
