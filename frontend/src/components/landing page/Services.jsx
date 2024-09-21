import React, { useState, useEffect } from 'react';
import './Services.css';
import Navbar from './Navbar';
import Footer from './Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaRobot, FaFileAlt, FaGamepad, FaUpload, FaEye, FaMoneyBillWave } from 'react-icons/fa';
import { MdOutlineAutoAwesome } from 'react-icons/md'; // For a cool sparkle effect
import student from '../../assets/images/student.png'
import teacher from '../../assets/images/teacher.png'

const Services = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    AOS.init({ duration: 1000 });
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
            {/* Service Item 1 */}
            <div className="service-item" data-aos="fade-right">
              <div className="service-image-container">
                <img src={student} alt="Learn" className="service-image" />
              </div>
              <div className="service-text">
                <h3><b>1. Learning with Bot</b></h3>
                <p className="service-description">
                  Enhance your self-learning experience with our intelligent learning bot. This interactive AI-driven bot is designed to guide you through various subjects, providing instant responses to your queries, personalized learning paths, and engaging content.
                </p>
                <div className="sub-services">
                <br/>
                  <h4>Key Features:</h4>
                  <div className="sub-services-card-container">
                    <div className="sub-service-card" data-aos="zoom-in">
                      <MdOutlineAutoAwesome className="icon" style={{ color: '#FF6F61' }} />
                      <p>Chat with AI</p>
                    </div>
                    <div className="sub-service-card" data-aos="zoom-in" data-aos-delay="100">
                      <FaFileAlt className="icon" style={{ color: '#6A5ACD' }} />
                      <p>Access to Past Papers</p>
                    </div>
                    <div className="sub-service-card" data-aos="zoom-in" data-aos-delay="200">
                      <FaGamepad className="icon" style={{ color: '#FFD700' }} />
                      <p>Gamified Learning Experience</p>
                    </div>
                  </div>
                </div>

                <button className="login-btn">Login</button>
              </div>
            </div>
            {/* Service Item 2 */}
            <div className="service-item" data-aos="fade-left">
              <div className="service-image-container">
                <img src={teacher} alt="Tutor" className="service-image" />
              </div>
              <div className="service-text">
                <h3><b>2. Tutoring with Bot</b></h3>
                <p className="service-description">
                  Experience one-on-one tutoring with our advanced tutoring bot. This AI-powered tutor adapts to your learning pace, offering customized lessons, practice questions, and detailed explanations.
                </p>
                <div className="sub-services">
                  <br/>
                  <h4>Key Features:</h4>
                  <div className="sub-services-card-container">
                    <div className="sub-service-card" data-aos="zoom-in">
                      <FaUpload className="icon" style={{ color: '#FF6347' }} />
                      <p>Material Upload</p>
                    </div>
                    <div className="sub-service-card" data-aos="zoom-in" data-aos-delay="100">
                      <FaEye className="icon" style={{ color: '#4682B4' }} />
                      <p>Monitor Student's Works</p>
                    </div>
                    <div className="sub-service-card" data-aos="zoom-in" data-aos-delay="200">
                      <FaMoneyBillWave className="icon" style={{ color: '#32CD32' }} />
                      <p>Earn Money</p>
                    </div>
                  </div>
                </div>
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
