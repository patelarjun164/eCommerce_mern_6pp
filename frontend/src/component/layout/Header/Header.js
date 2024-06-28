import React, { useState } from 'react';
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Ecommerce
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-links">
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links">
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">
              About
            </Link>
          </li>
          <li className="nav-item">
            <input type="text" className="search-bar" placeholder="Search..." />
          </li>
          <li className="nav-item">
            <Link to="/account" className="nav-links">
              <FaUserCircle className="nav-icon" />
              <span className="nav-text">Account</span>
            </Link>
          </li>
        </ul>
          <div className="nav-item">
            <Link to="/cart" className="nav-links">
              <FaShoppingCart className="nav-icon" />
              <span className="nav-text">Shopping Cart</span>
            </Link>
          </div>
      </div>
    </nav>
  );
};

export default Header;
