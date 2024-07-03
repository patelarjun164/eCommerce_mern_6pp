import React from 'react';
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/Appstore.png'
import './Footer.css'

const Footer = () => {
  return (
    <div id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and ios phones</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="appstore" />
      </div>
      <div className="midFooter">
        <h1>ShoppyNexxa.com</h1>
        <p>High quality is our first priority</p>

        <p>Copyrights 2024 &copy; Arjun Patel</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/_.arjunpatel?igsh=ZWI2YzEzYmMxYg==">Instagram</a>
        <a href="https://www.linkedin.com/in/arjun-patel-0558b6183">LinkedIn</a>
        <a href="https://github.com/patelarjun164">Github</a>
      </div>
    </div>
  )
}

export default Footer
