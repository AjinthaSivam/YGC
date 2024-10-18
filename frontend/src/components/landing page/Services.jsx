import React, { useState, useEffect } from 'react';
import './Services.css';
import Navbar from './Navbar';
import Footer from './Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaRobot, FaFileAlt, FaGamepad, FaUpload, FaEye, FaMoneyBillWave } from 'react-icons/fa';
import { MdOutlineAutoAwesome } from 'react-icons/md';
import student from '../../assets/images/student.png';
import teacher from '../../assets/images/teacher.png';


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

  const services = [
    {
      image: student,
      title: "Learning with Bot",
      description: "Enhance your self-learning experience with our intelligent learning bot. This interactive AI-driven bot is designed to guide you through various subjects, providing instant responses to your queries, personalized learning paths, and engaging content.",
      features: [
        { icon: <MdOutlineAutoAwesome />, text: "Chat with AI" },
        { icon: <FaFileAlt />, text: "Access Past Papers" },
        { icon: <FaGamepad />, text: "Gamified Learning" }
      ],
      buttonLink: "/signin"
    },
    {
      image: teacher,
      title: "Tutoring with Bot",
      description: "Experience one-on-one tutoring with our advanced tutoring bot. This AI-powered tutor adapts to your learning pace, offering customized lessons, practice questions, and detailed explanations.",
      features: [
        { icon: <FaUpload />, text: "Upload Materials" },
        { icon: <FaEye />, text: "Monitor Progress" },
        { icon: <FaMoneyBillWave />, text: "Earn Money" }
      ],
      buttonLink: "/signin/teacher"
    }
  ];

  return (
    <><Navbar toggleDarkMode={toggleDarkMode} />
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
    
      <main className="context">
        <div className="service" data-aos="fade-down">
          <h2>Our Services</h2>
          <p>Explore our innovative educational solutions</p>
        </div>
        
          <div className="services-container">
          <div className="services-content">
            {services.map((service, index) => (
              <div key={index} className="service-item" data-aos="fade-up">
                <div className="service-image-container">
                  <img src={service.image} alt={service.title} className="service-image" />
                </div>
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="feature-list">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="feature-item">
                        {feature.icon}
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  <a href={service.buttonLink} className="signing-button">Sign In</a>
                 </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </main>
      </section>
      
      </>
  );
};

export default Services;
