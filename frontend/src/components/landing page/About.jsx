import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import './About.css';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with 1000ms animation duration
  }, []);

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
          <div className="about" data-aos="fade-down">
            <h2>About Us</h2>
            <p>Information about the website or company</p>
          </div>
          <div className="about-container">
            <section className="about-card" data-aos="fade-up">
              <p>Welcome to EduTech, where we are dedicated to providing top-quality educational resources and innovative learning solutions.</p>
            </section>

            <section className="about-card" data-aos="fade-up">
              <h3>Our Mission</h3>
              <p>At EduTech, our mission is to empower learners through interactive and engaging educational content. We strive to make learning accessible and enjoyable for everyone.</p>
            </section>

            <section className="about-card" data-aos="fade-up">
              <h3>Our Vision</h3>
              <p>We envision a world where education is universally accessible and personalized to meet the needs of every learner. Our commitment is to harness the power of technology to transform the educational landscape.</p>
            </section>

            <section className="about-card" data-aos="fade-up">
              <h3>Our History</h3>
              <p>EduTech was founded in 2020 by Jane Doe and John Smith. Since then, we have grown from a small startup to a leading provider of educational technology, helping thousands of students achieve their academic goals.</p>
            </section>

            <section className="about-card team-section" data-aos="fade-up">
              <h3>Our Team</h3>
              <p>Meet the people who make it all happen:</p>
              <div className="team-members">
                <div className="team-member" data-aos="fade-right">
                  <img src="src/components/landing page/images/profile1.jpg" alt="Jane Doe" />
                  <p><strong>Jane Doe</strong> - CEO & Founder</p>
                </div>
                <div className="team-member" data-aos="fade-left">
                  <img src="src/components/landing page/images/profile2.jpg" alt="John Smith" />
                  <p><strong>John Smith</strong> - Chief Technology Officer</p>
                </div>
                <div className="team-member" data-aos="fade-right">
                  <img src="src/components/landing page/images/profile3.jpg" alt="Emily Johnson" />
                  <p><strong>Emily Johnson</strong> - Head of Curriculum Development</p>
                </div>
                <div className="team-member" data-aos="fade-left">
                  <img src="src/components/landing page/images/profile4.jpg" alt="Emily Davis" />
                  <p><strong>Emily Davis</strong> - Marketing Director</p>
                </div>
              </div>
            </section>

            <section className="about-card values-section" data-aos="fade-up">
              <h3>Our Values</h3>
              <p>We believe in:</p>
              <div className="values">
                <div className="value" data-aos="fade-right">
                  <img src="src/components/landing page/images/integrity.svg" alt="Integrity" />
                  <p><strong>Integrity</strong> - We uphold the highest standards of integrity in all of our actions.</p>
                </div>
                <div className="value" data-aos="fade-left">
                  <img src="src/components/landing page/images/innovation.svg" alt="Innovation" />
                  <p><strong>Innovation</strong> - We constantly seek innovative solutions to improve the learning experience.</p>
                </div>
                <div className="value" data-aos="fade-right">
                  <img src="src/components/landing page/images/excellence.svg" alt="Excellence" />
                  <p><strong>Excellence</strong> - We strive for excellence in everything we do.</p>
                </div>
              </div>
            </section>

            <section className="about-card" data-aos="fade-up">
              <h3>Contact Us</h3>
              <p>We'd love to hear from you! Reach out to us at contact@edutech.com or call us at (123) 456-7890.</p>
            </section>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default About;
