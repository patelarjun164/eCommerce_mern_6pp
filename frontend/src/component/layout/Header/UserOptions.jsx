import React, { useState } from 'react';
import "./UserOptions.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { FaShoppingCart } from "react-icons/fa";
// import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useNavigate } from 'react-router-dom';
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import ProfileImg from '../../../images/Profile.png'


const UserOptions = ({ user }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    const { cartItems } = useSelector((state) => state.cart);
    const [open, setOpen] = useState(false);
    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <FaShoppingCart style={{ color: cartItems.length > 0 ? "tomato" : "unset" }} />
        , name: `Cart(${cartItems.length})`
        , func: cart },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ]

    if (user && user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />, name: "Dashboard", func: dashboard
        })
    }

    function orders() {
        navigate("/orders");
    }
    function account() {
        navigate("/account");
    }
    function cart() {
        navigate("/cart");
    }
    function logoutUser() {
        dispatch(logout());
        alert.success("LogOut Successfully...!");
        navigate("/");
    }
    function dashboard() {
        navigate("/admin/dashboard");
    }

    return (
        <>
            
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                className="speedDial"
                ariaLabel="SpeedDial basic example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                style={{ zIndex: "11" }}
                direction={window.innerWidth <= 600 ? 'up' : 'down'}
                icon={
                    <img
                        className='speedDialIcon'
                        src={user.avatar.url ? user.avatar.url : ProfileImg}
                        alt="Profle"
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
            
        </>
    )
}

export default UserOptions;
