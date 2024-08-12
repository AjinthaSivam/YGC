import React, { useState } from 'react';
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

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
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/downloads">Downloads</a>
        <a href="/about">About Us</a>
        <a href="/elibrary">E-library</a>
      </div>
      <button onClick={toggleDarkMode} className="theme-toggle">
        <i className={document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon'}></i>
      </button>
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
      </button>
    </nav>
  );
};

export default Navbar;
