import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Welcome.css';
import { FaUser, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Welcome = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_USER_ID')
      .then((result) => {
        alert('Message sent successfully');
        setFormData({ name: '', email: '', message: '' });
      }, (error) => {
        alert('Failed to send message');
      });
  };

  return (
    <div className="welcome-container">
      <section id="home" className="welcome-section">
        <h1>Welcome to My Educational Institute</h1>
        <p>Empowering students with knowledge and skills for a brighter future.</p>
      </section>
      <section id="services" className="welcome-section">
        <h2>Our Services</h2>
        <p>Explore the range of educational services we offer to enhance your learning experience.</p>
      </section>
      <section id="downloads" className="welcome-section">
        <h2>Downloads</h2>
        <p>Access valuable resources and materials for your studies.</p>
      </section>
      <section id="about" className="welcome-section">
        <h2>Our Team</h2>
        <div className="team-section">
          <div className="team-container">
            <div className="team-member">
              <img src="src/components/landing page/images/profile1.jpg" alt="Team Member 1" />
              <h4>John Doe</h4>
              <p>CEO & Founder</p>
            </div>
            <div className="team-member">
              <img src="src/components/landing page/images/profile2.jpg" alt="Team Member 2" />
              <h4>Jane Smith</h4>
              <p>Head of Education</p>
            </div>
            <div className="team-member">
              <img src="src/components/landing page/images/profile3.jpg" alt="Team Member 3" />
              <h4>Mark Johnson</h4>
              <p>Lead Developer</p>
            </div>
            <div className="team-member">
              <img src="src/components/landing page/images/profile4.jpg" alt="Team Member 4" />
              <h4>Emily Davis</h4>
              <p>Marketing Director</p>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="welcome-section">
        <h2>Contact Us</h2>
        <div className="contact-content">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="input-group">
              <FaUser />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaPaperPlane />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="contact-btn">Send Message</button>
          </form>
          <div className="contact-image">
            <img src="src/components/landing page/images/contact.jpg" alt="Contact Us" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
