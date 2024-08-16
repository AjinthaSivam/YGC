import React from 'react';
import './Services.css';

const Services = () => {
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
      <div className="service">
        <h2>Our Services</h2>
        <p>Explore our educational services designed to enhance your learning experience.</p>
      </div>
      <div className="services-content">
        <div className="service-item">
          <div className="service-image-container">
            <img src="src/components/landing page/images/student.png" alt="Learn" className="service-image" />
          </div>
          <div className="service-text">
            <h3><b>1. Learning with Bot</b></h3>
            <p className="service-description">
              Enhance your self-learning experience with our intelligent learning bot. This interactive AI-driven bot is designed to guide you through various subjects, providing instant responses to your queries, personalized learning paths, and engaging content. Whether you're tackling new topics or revising for exams, learning with our bot makes education more accessible, efficient, and enjoyable.
            </p>
            <button className="login-btn">Login</button>
          </div>
        </div>
        <div className="service-item">
          <div className="service-image-container">
            <img src="src/components/landing page/images/teacher.png" alt="Tutor" className="service-image" />
          </div>
          <div className="service-text">
            <h3><b>2. Tutoring with Bot</b></h3>
            <p className="service-description">
              Experience one-on-one tutoring with our advanced tutoring bot. This AI-powered tutor adapts to your learning pace, offering customized lessons, practice questions, and detailed explanations. Perfect for those who need extra support, our tutoring bot ensures that you understand key concepts and excel in your studies.
            </p>
            <button className="login-btn">Login</button>
          </div>
        </div>
      </div>
     </div>
     </section>
  );
};

export default Services;
