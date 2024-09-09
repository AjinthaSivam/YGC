import React, { useState, useEffect } from 'react';
import './Services.css';
import Navbar from './Navbar';
import Footer from './Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  return (
    <>
      <Navbar toggleDarkMode={toggleDarkMode} />
      <section className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className="context">
          <div className="service" data-aos="fade-up">
            <h2>Our Services</h2>
            <p>Explore our educational services designed to enhance your learning experience</p>
          </div>
          <div className="services-content">
            <div className="service-item" data-aos="fade-right">
              <div className="service-image-container">
                <img src="src/components/landing page/images/student.png" alt="Learn" className="service-image" />
              </div>
              <div className="service-text">
                <h3><b>1. Learning with Bot</b></h3>
                <p className="service-description">
                  Enhance your self-learning experience with our intelligent learning bot. This interactive AI-driven bot is designed to guide you through various subjects, providing instant responses to your queries, personalized learning paths, and engaging content.
                </p>
                <button className="login-btn">Login</button>
              </div>
            </div>
            <div className="service-item" data-aos="fade-left">
              <div className="service-image-container">
                <img src="src/components/landing page/images/teacher.png" alt="Tutor" className="service-image" />
              </div>
              <div className="service-text">
                <h3><b>2. Tutoring with Bot</b></h3>
                <p className="service-description">
                  Experience one-on-one tutoring with our advanced tutoring bot. This AI-powered tutor adapts to your learning pace, offering customized lessons, practice questions, and detailed explanations.
                </p>
                <button className="login-btn">Login</button>
              </div>
            </div>
          </div>
          
        <Footer />
        </div>
      </section>
    </>
  );
};

export default Services;
