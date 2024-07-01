import React, { useState } from "react";
import "./Header.css";

import { NavLink, Link} from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <Link to="/" className="title">
        Website
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <input type="text" placeholder="Search..." />
        </li>
        <li className="cart-profile">
          <NavLink to="/cart">Cart</NavLink>
        </li>
        <li className="cart-profile">
          <NavLink to="/account">Profile</NavLink>
        </li>
      </ul>
      <ul>
      <li>
          <NavLink to="/cart">Cart</NavLink>
        </li>
        <li>
          <NavLink to="/account">Profile</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Header;