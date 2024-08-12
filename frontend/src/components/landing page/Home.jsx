import React, { useState, useEffect } from 'react';
import ImageCarousel from './Carousel';
import Welcome from './Welcome';
import './Home.css';
import Navbar from './Navbar'

const Home = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme'))
  useEffect(() => {
    // Apply the theme based on the state
    document.body.classList.toggle('dark-mode', darkMode);
    // Store the theme preference in localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };
  return (
    <div className={`home ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar toggleDarkMode={toggleDarkMode} />
      <ImageCarousel />
      <Welcome />
    </div>
  );
};

export default Home;
