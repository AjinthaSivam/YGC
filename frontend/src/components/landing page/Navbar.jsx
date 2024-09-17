import React, { useState } from 'react';
import './Navbar.css';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';

const Navbar = ({ toggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>EDUTECH</h1>
      </div>
      
      <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <a href="/land">Home</a>
        <a href="/services">Services</a>
        <a href="/downloads">Downloads</a>
        <a href="/about">About Us</a>
        <a href="/elibrary">E-Library</a>
      </div>

      {/* Register Now Button */}
      <a href="http://localhost:5173/signup" className="register-button">
        Sign Up
      </a>

      <div className="navbar-menu-container">
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FaBars size={20} />
        </button>
        <button onClick={toggleDarkMode} className="theme-toggle-button">
          {document.body.classList.contains('dark-mode') ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
