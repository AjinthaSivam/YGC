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
    <><section className="area">
      <ul className="circles">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li>
      </ul>
      <div className="context">
        <div className={`home ${darkMode ? 'dark-mode' : ''}`}>
          <Navbar toggleDarkMode={toggleDarkMode} />
          <div className="content-wrapper">
            <br /><br />
            <ImageCarousel />
            <Welcome />
          </div>
        </div>
      </div>
    </section><Footer /></>

  );
};

export default Home;
