import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Welcome.css';
import { FaUser, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
      <br/>
      <br/>
      <section id="home" className="welcome-section hero-section">
        <div className="hero-content">
          <h1><strong>Unlock Your Potential with Our Expert Education</strong></h1>
          <p>Join a community dedicated to fostering excellence and innovation. Our educational programs are designed to equip students and professionals with the skills needed to excel in today's competitive world.</p>
          <br/>
          <div className="cta-buttons">
            <a href="/students" className="cta-button student-btn">For Students</a>
            <a href="/tutors" className="cta-button tutor-btn">For Tutors</a>
          </div>
        </div>
      </section>

      <section id="about-us" className="welcome-section">
        <h2><strong>About Us</strong></h2>
        <div className="about-us-content">
          <div className="about-us-item">
            <i className="fas fa-users about-us-icon"></i>
            <h1><strong>1,200+</strong></h1>
            <p>Number of Students</p>
          </div>
          <div className="about-us-item">
            <i className="fas fa-chalkboard-teacher about-us-icon"></i>
            <h1><strong>50+</strong></h1>
            <p>Number of Tutors</p>
          </div>
          <div className="about-us-item">
            <i className="fas fa-book about-us-icon"></i>
            <h1><strong>20+</strong></h1>
            <p>Available Courses</p>
          </div>
          <div className="about-us-item">
            <i className="fas fa-archive about-us-icon"></i>
            <h1><strong>150+</strong></h1>
            <p>Available Materials</p>
          </div>
        </div>
      </section>
      <section id="downloads" className="welcome-section">
        <h2><strong>Downloads</strong></h2>
        <p>Download the past papers and model papers for your best practice.</p>
        <br/>
        <div className="downloads-preview">
          <div className="book-card">
            <img src="src/components/landing page/images/Englishp.png" alt="G.C.E O/L 2023 English" className="book-image" />
            <h3>G.C.E O/L 2023</h3>
            <p>English</p>
          </div>
          <div className="book-card">
            <img src="src/components/landing page/images/Mathsp.png" alt="G.C.E O/L 2023 Mathematics" className="book-image" />
            <h3>G.C.E O/L 2023</h3>
            <p>Mathematics</p>
          </div>
          <div className="book-card">
            <img src="src/components/landing page/images/Sciencep.png" alt="G.C.E O/L 2023 Science" className="book-image" />
            <h3>G.C.E O/L 2023</h3>
            <p>Science</p>
          </div>
        </div>
        <a href="/downloads" className="see-more-button">See More</a>
      </section>
      <section id="elibrary" className="welcome-section">
        <h2><strong>E-Library</strong></h2>
        <p>Access valuable reference materials for your studies.</p>
        <br/>
        <div className="downloads-preview">
          <div className="book-card">
            <img src="src/components/landing page/images/Science.png" alt="Social Studies" className="book-image" />
            <h3>Social Studies</h3>
            <p>Science</p>
            <p>Emily Brown</p>
            <p>4.8 ★</p>                
          </div>
          <div className="book-card">
            <img src="src/components/landing page/images/English.png" alt="Easy English" className="book-image" />
            <h3>Easy English</h3>
            <p>English</p>
            <p>John Doe</p>
            <p>4.5 ★</p>
          </div>
          <div className="book-card">
            <img src="src/components/landing page/images/Maths.png" alt="Numerical Tricks" className="book-image" />
            <h3>Numerical Tricks</h3>
            <p>Mathematics</p>
            <p>Jane Smith</p>
            <p>4.2 ★</p>
          </div>
        </div>
        <a href="/elibrary" className="see-more-button">See More</a>
      </section>
      <section id="success-stories" className="welcome-section">
        <h2>Success Stories</h2>
        <div className="stories-container">
          <div className="story-card">
            <img src="src/components/landing page/images/success1.png" alt="Success Story 1" />
            <div className="story-content">
              <h3><strong>Aman Sri</strong></h3>
              <p>"This institute transformed my life by providing quality education and guidance."</p>
            </div>
          </div>
          <div className="story-card">
            <img src="src/components/landing page/images/success2.png" alt="Success Story 2" />
            <div className="story-content">
              <h3><strong>Ravi Sarma</strong></h3>
              <p>"Thanks to the dedicated teachers, I was able to achieve my academic goals."</p>
            </div>
          </div>
          <div className="story-card">
            <img src="src/components/landing page/images/success3.png" alt="Success Story 3" />
            <div className="story-content">
              <h3><strong>Nimali Kumar</strong></h3>
              <p>"The resources and support here helped me excel in my exams."</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="welcome-section">
        <h2><strong>Contact Us</strong></h2>
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