import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import { Link } from "react-router-dom";

function Navbar() {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle(
      "responsive_nav"
    );
  };

  return (
    <header>
      <h3>LOGO</h3>
      <nav ref={navRef}>
        <Link to="/" onClick={showNavbar}>Home</Link>
        <Link to="/products" onClick={showNavbar}>Products</Link>
        <Link to="/contact" onClick={showNavbar}>Contact</Link>
        <Link to="/about" onClick={showNavbar}>About</Link>
        <Link to="/account" onClick={showNavbar}>Profile</Link>
        <div className="searchBar">
          <input type="text" placeholder="Search..." />
        </div>
        <button
          className="nav-btn nav-close-btn"
          onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <div >
      <Link className="cart-profile" to="/cart" onClick={showNavbar}>Cart</Link>
      <Link className="cart-profile" to="/account" onClick={showNavbar}>Profile</Link>
      <input className="searchBar2" type="text" placeholder="Search..." />
      </div>
      <button
        className="nav-btn"
        onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;