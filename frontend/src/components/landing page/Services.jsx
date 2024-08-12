// src/Services.js

import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <><div className="services-container">
      <h2>Our Services</h2>
      <p>Details about services offered.</p>
    </div><div className="services-content">
        <div className="service-item">
          <img src="assets/images/light-theme-image-1.jpeg" alt="Service 1" className="service-image" />
          <h3>Service 1</h3>
          <p>Description of the first service offered.</p>
        </div>
        <div className="service-item">
          <img src="assets/images/light-theme-image-2.jpg" alt="Service 2" className="service-image" />
          <h3>Service 2</h3>
          <p>Description of the second service offered.</p>
        </div>
        <div className="service-item">
          <img src="assets/images/light-theme-image-3.jpg" alt="Service 3" className="service-image" />
          <h3>Service 3</h3>
          <p>Description of the third service offered.</p>
        </div>
      </div></>
  );
};

export default Services;
