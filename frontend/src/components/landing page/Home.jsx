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

  const toggleDarkMode = () => setDarkMode(prevDarkMode => !prevDarkMode);

  return (
    <>
      <Navbar toggleDarkMode={toggleDarkMode} />
      <section className="area">
        <ul className="circles">
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>
        <div className="context">
          <div className={`home ${darkMode ? 'dark-mode' : ''}`}>
            <div className="content-wrapper">
              <ImageCarousel />
              <Welcome />
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default Home;
