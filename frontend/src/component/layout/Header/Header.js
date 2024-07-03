import { useRef, useState, useEffect } from "react";
import { FaBars, FaBuilding, FaHouseUser, FaMailBulk, FaProductHunt, FaShoppingCart, FaTimes, FaUser } from "react-icons/fa";
import "./Header.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../images/ShoppyNexxa Logo.png"

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const navRef = useRef();
  const searchRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle(
      "responsive_nav"
    );
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navRef.current.classList.toggle("responsive_nav");
    const searchedKeyword = keyword;
    setKeyword("");
    searchRef.current.placeholder = `Results for ${searchedKeyword}`;
    if (keyword.trim) {
      navigate(`/products/${keyword}`);
    }
    else {
      navigate("/products");
    }
  }

  useEffect(() => {
    if(!location.pathname.includes("/products/")) {
      searchRef.current.placeholder = "Type and press Enter to search...";
    }
}, [location]);

  return (
    <header>
      <Link to="/" onClick={showNavbar}>
        <img alt="Logo" src={Logo} className="brand-logo" />
      </Link>
      <nav ref={navRef}>
        <div className="searchBar">
          <form onSubmit={handleSearchSubmit}>
            <input
              ref={searchRef}
              value={keyword}
              type="search"
              placeholder="Type and press Enter to search..."
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>

        </div>
        <Link to="/" onClick={showNavbar}>
          <FaHouseUser className="mobile-nav-icon" />Home
        </Link>
        <Link to="/products" onClick={showNavbar}>
          <FaProductHunt className="mobile-nav-icon" />Products
        </Link>
        <Link to="/contact" onClick={showNavbar}>
          <FaMailBulk className="mobile-nav-icon" />Contact
        </Link>
        <Link to="/about" onClick={showNavbar}>
          <FaBuilding className="mobile-nav-icon" />About
        </Link>
        <Link to="/cart" className="cart-profile-mobile" onClick={showNavbar}>
          <FaShoppingCart className="mobile-nav-icon" />Cart
        </Link>

        <Link to="/account" className="cart-profile-mobile" onClick={showNavbar}>
          <FaUser className="mobile-nav-icon" />Profile
        </Link>

        <button
          className="nav-btn nav-close-btn"
          onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <div >
        <Link
          to="/cart"
          className="cart-profile-desktop"
          onClick={showNavbar}
          title="Cart"
        >
          <FaShoppingCart />
        </Link>

        <Link
          to="/account"
          className="cart-profile-desktop"
          onClick={showNavbar}
          title="Profile"
        >
          <FaUser />
        </Link>
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