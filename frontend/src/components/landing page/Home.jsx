import React, { useState, useEffect } from 'react';
import ImageCarousel from './Carousel';
import Welcome from './Welcome';
import './Home.css';
import Navbar from './Navbar';
import Footer from './Footer';

const Home = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  return (
    <div className={`home ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar toggleDarkMode={toggleDarkMode} />
      <div className="content-wrapper">
      <br/><br/>
        <ImageCarousel />
        <Welcome />
      </div>
      <Footer/>
    </div>

  );
};

export default Home;
