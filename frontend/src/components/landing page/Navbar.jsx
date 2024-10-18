import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaMoon, FaSun, FaBars, FaYoutube, FaFacebook, FaLinkedinIn } from 'react-icons/fa';

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
        <br/><br/><br/>
        <a href="/land">Home</a>
        <a href="/services">Services</a>
        <a href="/downloads">Downloads</a>
        <a href="/about">About Us</a>
        <a href="/elibrary">E-Library</a><br/>
        <div className="side-info">
          <button className='regbtn' rel='/signup'>Sign Up Now</button>
          <br/><br/>
          <hr className="hr"  />
          <br/><br/>
          <h4 className="hero-cta" >Connect with us</h4>        
          <div className="social-icons">
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="social-icons"/>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="social-icons"/>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn className="social-icons"/>
              </a>
          </div>
        </div>
      </div>
      

      

      <div className="navbar-menu-container">
        {/* Register Now Button */}
        <a href="/signup" className="register-button">
          Sign Up
        </a>
        <button onClick={toggleDarkMode} className="theme-toggle-button">
          {isDarkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FaBars size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
