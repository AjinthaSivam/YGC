import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './About.css';
import Navbar from './Navbar';
import Footer from './Footer';
import {  FaLightbulb,  FaHistory, FaBullseye, FaEnvelope, FaUsers, FaCogs } from 'react-icons/fa';
import profile1 from '../../assets/images/profile1.jpg'
import profile2 from '../../assets/images/profile2.jpg'
import profile3 from '../../assets/images/profile3.jpg'
import profile4 from '../../assets/images/profile4.jpg'
import integrity from '../../assets/images/integrity.svg'
import innovation from '../../assets/images/innovation.svg'
import excellence from '../../assets/images/excellence.svg'

const About = ({ toggleDarkMode }) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
    <Navbar toggleDarkMode={toggleDarkMode} />
      <section className="area">
        <ul className="circles">
          {[...Array(10)].map((_, index) => (
            <li key={index}></li>
          ))}
        </ul>
        <div className="context">
          <div className="about" data-aos="fade-down">
            <h2>About Us</h2>
            <p>Information about the website or company</p>
          </div>
      <div className="about-container">
          <div className="about-card" data-aos="fade-up">
            <FaBullseye className="about-icon" />
            <h3>Our Mission</h3>
            <p>To empower learners through interactive and engaging educational content, making learning accessible and enjoyable for everyone.</p>
          </div>
          <div className="about-card" data-aos="fade-up" data-aos-delay="100">
            <FaLightbulb className="about-icon" />
            <h3>Our Vision</h3>
            <p>A world where education is universally accessible and personalized, transforming the educational landscape through technology.</p>
          </div>
          <div className="about-card" data-aos="fade-up" data-aos-delay="200">
            <FaHistory className="about-icon" />
            <h3>Our History</h3>
            <p>Founded in 2020, EduTech has grown from a small startup to a leading provider of educational technology, helping thousands of students achieve their goals.</p>
          </div>


        <section className="about-card values-section" data-aos="fade-up">
        <FaCogs className="about-icon" />
          <h3>Our Values</h3>
          <div className="values-grid">
            <div className="value-card" data-aos="fade-up">
              <img src={integrity} alt="Integrity" />
              <h3>Integrity</h3>
              <p>Upholding the highest standards in all our actions</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="100">
              <img src={innovation} alt="Innovation" />
              <h3>Innovation</h3>
              <p>Constantly seeking new solutions to improve learning</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
              <img src={excellence} alt="Excellence" />
              <h3>Excellence</h3>
              <p>Striving for excellence in everything we do</p>
            </div>
          </div>
        </section>
        <section className="about-card team-section" data-aos="fade-up">
          <FaUsers className="about-icon" />
          <h3>Our Team</h3>
          <div className="team-grid">
            {[
              { name: "Jane Doe", role: "CEO & Founder", img: profile1 },
              { name: "John Smith", role: "Chief Technology Officer", img: profile2 },
              { name: "Emily Johnson", role: "Head of Curriculum", img: profile3 },
              { name: "Michael Brown", role: "Marketing Director", img: profile4 }
            ].map((member, index) => (
              <div className="team-member" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <img src={member.img} alt={member.name} />
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-card contact-section" data-aos="fade-up">
          <FaEnvelope className="about-icon" />
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
