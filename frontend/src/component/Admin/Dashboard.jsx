import React, { useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import "./Dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderActions.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { orders, loading: ordersLoading } = useSelector(
    (state) => state.allOrders
  );
  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers
  );
  const { user, loading: userLoading } = useSelector((state) => state.user);
  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, user.totalEarningAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <>
      {(productsLoading && ordersLoading && usersLoading && userLoading) ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <Sidebar />

          <div className="dashboardContainer">
            <Typography component="h1">Dashboard</Typography>

            <div className="dashboardSummary">
              <div>
                <p>
                  Total Amount <br /> ₹{user.totalEarningAmount}
                </p>
              </div>
              <div className="dashboardSummaryBox2">
                <Link to="/admin/products">
                  <p>Product</p>
                  <p>{products && products.length}</p>
                </Link>
                <Link to="/admin/orders">
                  <p>Orders</p>
                  <p>{orders && orders.length}</p>
                </Link>
                <Link to="/admin/users">
                  <p>Users</p>
                  <p>{users.length}</p>
                </Link>
              </div>
            </div>

            <div className="lineChart">
              <Line data={{ ...lineState }} />
            </div>

            <div className="doughnutChart">
              <Doughnut data={{ ...doughnutState }} />
            </div>
          </div>
          <MetaData title="Dashboard - Admin Panel" />
        </div>
      )}
    </>
  );
};

export default Dashboard;
