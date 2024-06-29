import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const showSidebar = () => {
    setSidebarVisible(true);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <nav>
      <ul className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <li onClick={hideSidebar}>
          <Link to="#">
            <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 96 960 960" width="26">
              <path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
            </svg>
          </Link>
        </li>
        <li><Link to="#">Blog</Link></li>
        <li><Link to="#">Products</Link></li>
        <li><Link to="#">About</Link></li>
        <li><Link to="#">Forum</Link></li>
        <li><Link to="#">Login</Link></li>
      </ul>
      <ul>
        <li><Link to="#">Coding2go</Link></li>
        <li className="hideOnMobile"><Link to="#">Blog</Link></li>
        <li className="hideOnMobile"><Link to="#">Products</Link></li>
        <li className="hideOnMobile"><Link to="#">About</Link></li>
        <li className="hideOnMobile"><Link to="#">Forum</Link></li>
        <li className="hideOnMobile"><Link to="#">Login</Link></li>
        <li className="menu-button" onClick={showSidebar}>
          <Link to="#">
            <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 96 960 960" width="26">
              <path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
            </svg>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
