// src/About.js
import React from 'react';
import './About.css';

const About = () => {
  return (
    <section class="area">
    <ul class="circles">
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
    <div class="context">
      <div className="about">
        <h2>About Us</h2>
        <p>Information about the website or company.</p>
      </div>
      <div className="about-container">
          <section className="about-card">
            <p>Welcome to EduTech, where we are dedicated to providing top-quality educational resources and innovative learning solutions.</p>
          </section>

          <section className="about-card">
            <h3>Our Mission</h3>
            <p>At EduTech, our mission is to empower learners through interactive and engaging educational content. We strive to make learning accessible and enjoyable for everyone.</p>
          </section>

          <section className="about-card">
            <h3>Our Vision</h3>
            <p>We envision a world where education is universally accessible and personalized to meet the needs of every learner. Our commitment is to harness the power of technology to transform the educational landscape.</p>
          </section>

          <section className="about-card">
            <h3>Our History</h3>
            <p>EduTech was founded in 2020 by Jane Doe and John Smith. Since then, we have grown from a small startup to a leading provider of educational technology, helping thousands of students achieve their academic goals.</p>
          </section>

          <section className="about-card team-section">
            <h3>Our Team</h3>
            <p>Meet the people who make it all happen:</p>
            <div className="team-members">
              <div className="team-member">
                <img src="src/components/landing page/images/profile1.jpg" alt="Jane Doe" />
                <p><strong>Jane Doe</strong> - CEO & Founder</p>
              </div>
              <div className="team-member">
                <img src="src/components/landing page/images/profile2.jpg" alt="John Smith" />
                <p><strong>John Smith</strong> - Chief Technology Officer</p>
              </div>
              <div className="team-member">
                <img src="src/components/landing page/images/profile3.jpg" alt="Emily Johnson" />
                <p><strong>Emily Johnson</strong> - Head of Curriculum Development</p>
              </div>
              <div className="team-member">
                <img src="src/components/landing page/images/profile4.jpg" alt="Team Member 4" />
                <p><strong>Emily Davis</strong> - Marketing Director</p>
              </div>
            </div>
          </section>

          <section className="about-card values-section">
            <h3>Our Values</h3>
            <p>We believe in:</p>
            <div className="values">
              <div className="value">
                <img src="src\components\landing page\images\integrity.svg" alt="Integrity" />
                <p><strong>Integrity</strong> - We uphold the highest standards of integrity in all of our actions.</p>
              </div>
              <div className="value">
                <img src="src\components\landing page\images\innovation.svg" alt="Innovation" />
                <p><strong>Innovation</strong> - We constantly seek innovative solutions to improve the learning experience.</p>
              </div>
              <div className="value">
                <img src="src\components\landing page\images\excellence.svg" alt="Excellence" />
                <p><strong>Excellence</strong> - We strive for excellence in everything we do.</p>
              </div>
            </div>
          </section>

          <section className="about-card">
            <h3>Contact Us</h3>
            <p>We'd love to hear from you! Reach out to us at contact@edutech.com or call us at (123) 456-7890.</p>
          </section>
      </div>
    </div>
    </section>
  );
};

export default About;
