import React from 'react';
import './Footer.css';
import { FaFacebook, FaYoutube, FaLinkedinIn } from 'react-icons/fa'; // Importing social media icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left side: Paragraph and Links */}
        <div className="footer-left">
          <p>© All rights reserved. Made with <span className="heart">❤</span> from EduTech</p>

          {/* Footer Links */}
          <div className="footer-links">
            <a href="/services">Services</a>
            <a href="/downloads">Downloads</a>
            <a href="/about">About Us</a>
            <a href="/elibrary">E-Library</a>
          </div>

          {/* Social Media Icons */}
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right side: QR Code and Blinking Text */}
        <div className="footer-right">
          <div className="footer-signin-text">
            <span>Click here to Sign in </span>
            <span role="img" aria-label="pointing-hand" className="blinking-hand">👉</span>
          </div>
          <a href="/signin" className="footer-qr-link">
            <div className="footer-qr">
              <img src="src/components/landing page/images/qrcode.png" alt="QR Code" />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
