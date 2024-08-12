import React, { useState } from 'react';
import './Navbar.css';
import { FaMoon, FaSun } from 'react-icons/fa';

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
        <a href="/elibrary">E-library</a>
      </div>
      <button onClick={toggleDarkMode} className="theme-toggle-button">
        {document.body.classList.contains('dark-mode') ? <FaSun /> : <FaMoon />}
      </button>
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? 'Close' : 'Menu'}
      </button>
    </nav>
  );
};

export default Navbar;
