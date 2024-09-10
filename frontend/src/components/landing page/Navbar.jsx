import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // On mount, check localStorage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    
    // Toggle the theme
    if (currentTheme === 'dark') {
      document.body.classList.remove('dark-mode');
      setIsDarkMode(false);
      localStorage.setItem('theme', 'light'); // Save light mode in localStorage
    } else {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
      localStorage.setItem('theme', 'dark'); // Save dark mode in localStorage
    }
  };

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
          {isDarkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
