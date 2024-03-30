import React from 'react';
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png"
import {FaSearch, FaShoppingCart} from "react-icons/fa";
// import {MdAddShoppingCart } from "react-icons/md";
import {MdAccountCircle } from "react-icons/md";

const options = {
burgerColorHover: "#eb4034",
logo,
searchIcon: true,
SearchIconElement: FaSearch,
profileIcon: true,
ProfileIconElement: MdAccountCircle,
cartIcon: true,
CartIconElement: FaShoppingCart,
logoWidth: "20vmax",
navColor1: "white",
logoHoverSize: "10px",
logoHoverColor: "#eb4034",
link1Text: "Home",
link2Text: "Products",
link3Text: "Contact",
link4Text: "About",
link1Url: "/",
link2Url: "/products",
link3Url: "/contact",
link4Url: "/about",
link1Size: "1.3vmax",
link1Color: "#232323cc",
nav1justifyContent: "flex-end",
nav2justifyContent: "flex-end",
nav3justifyContent: "flex-start",
nav4justifyContent: "flex-start",
link1ColorHover: "#eb4034",
link1Margin: "1vmax",
profileIconUrl: "/login",
profileIconColor: "#232323cc",
searchIconColor: "#232323cc",
cartIconColor: "#232323cc",
profileIconColorHover: "#eb4034",
searchIconColorHover: "#eb4034",
cartIconColorHover: "#eb4034",
cartIconMargin: "1vmax",
};

const Header = () => {
    return (
        <div>
            <ReactNavbar {...options} />
        </div>
    )
}

export default Header
