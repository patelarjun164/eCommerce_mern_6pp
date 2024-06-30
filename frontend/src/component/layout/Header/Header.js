import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import Logo from '../../../images/ShoppyNexxa-Logo.png'
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/"><img alt='logo' src={Logo} /></Link>
      </div>
      {window.innerWidth <= 748 && (
        <>
          <div className="search-bar-mobile">
            <input type="text" placeholder="Search..." />
            <FaSearch />
          </div>
        </>
      )}
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={handleToggle}>Home</Link></li>
        <li><Link to="/products" onClick={handleToggle}>Products</Link></li>
        <li><Link to="/contact" onClick={handleToggle}>Contact</Link></li>
        <li><Link to="/about" onClick={handleToggle}>About</Link></li>
        {window.innerWidth <= 748 && (
          <>
            <li><Link to="/cart" onClick={handleToggle}>Cart</Link></li>
            <li><Link to="/acoount" onClick={handleToggle}>Account</Link></li>
          </>
        )}
        {!(window.innerWidth <= 748) && (<>
          <li>
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
              <FaSearch />
            </div>
          </li>
        </>)}
      </ul>
      {!(window.innerWidth <= 748) && (<>
        <div className="nav-icons">
          <Link to='/cart' aria-label="Cart"><FaShoppingCart className="icon" /></Link>
          <Link to='/account' aria-label="Account"><FaUser className="icon" /></Link>
        </div>
      </>)}
      <div className="nav-toggle" onClick={handleToggle} aria-label="Menu Toggle">
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Header;
