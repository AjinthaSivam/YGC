import React from 'react';
import './ELibrary.css';

const ELibrary = () => {
  return (
    <>
      <div className="eLibrary-container">
        <h2>E-library</h2>
        <p>Access to online resources.</p>
      </div>
      <div className="eLibrary-container">
        <div className="search-bar">
          <input type="text" placeholder="Search for books, articles, etc." />
          <button type="button">Search</button>
        </div>
        <div className="categories">
          <h3>Categories</h3>
          <ul>
            <li>Science</li>
            <li>Technology</li>
            <li>Engineering</li>
            <li>Mathematics</li>
            <li>Arts</li>
            <li>Literature</li>
          </ul>
        </div>
        <div className="resources">
          <h3>Available Resources</h3>
          <ul>
            <li><button className="link-button" onClick={() => alert('Introduction to Quantum Physics')}>Introduction to Quantum Physics</button></li>
            <li><button className="link-button" onClick={() => alert('Advanced Algorithms and Data Structures')}>Advanced Algorithms and Data Structures</button></li>
            <li><button className="link-button" onClick={() => alert('Modern Art History')}>Modern Art History</button></li>
            <li><button className="link-button" onClick={() => alert('Shakespeare\'s Complete Works')}>Shakespeare's Complete Works</button></li>
            <li><button className="link-button" onClick={() => alert('Artificial Intelligence: A Modern Approach')}>Artificial Intelligence: A Modern Approach</button></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ELibrary;
