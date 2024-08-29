import React, { useState, useEffect } from 'react';
import './Downloads.css';
import Navbar from './Navbar';
import Footer from './Footer';

const books = [
  { id: 1, title: 'G.C.E O/L 2023 ', category: 'English', link: '#', image: 'src/components/landing page/images/Englishp.png'},
  { id: 2, title: 'G.C.E O/L 2023', category: 'Mathematics', link: '#', image: 'src/components/landing page/images/Mathsp.png' },
  { id: 3, title: 'G.C.E O/L 2023', category: 'Science', link: '#', image: 'src/components/landing page/images/Sciencep.png' },
  { id: 4, title: 'G.C.E O/L 2023', category: 'ICT', link: '#', image: 'src/components/landing page/images/ICTp.png' },
  { id: 5, title: 'G.C.E O/L 2022', category: 'English', link: '#', image: 'src/components/landing page/images/Englishp.png' },
  { id: 6, title: 'G.C.E O/L 2022', category: 'Mathematics', link: 'https://www.digitalarchives.online/2024/05/gce-ol-2023-english-language-past-paper.html', image: 'src/components/landing page/images/Mathsp.png' },
  { id: 7, title: 'G.C.E O/L 2021', category: 'English', link: '#', image: 'src/components/landing page/images/Englishp.png' },
];

const Downloads = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBooks = selectedCategory === 'All'
    ? books
    : books.filter(book => book.category === selectedCategory);

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
      <div className="downloads">
        <h2>Downloads</h2>
        <p>Links to downloadable content.</p>
      </div>
      <div className="downloads-container">
        <div className="filters">
          <button onClick={() => setSelectedCategory('All')}>All</button>
          <button onClick={() => setSelectedCategory('Science')}>Science</button>
          <button onClick={() => setSelectedCategory('ICT')}>ICT</button>
          <button onClick={() => setSelectedCategory('English')}>English</button>
          <button onClick={() => setSelectedCategory('Mathematics')}>Mathematics</button>
        </div>
        <div className="book-cards">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.image} alt={book.title} className="book-image" />
              <h3>{book.title}</h3>
              <p>{book.category}</p>
              <a href={book.link} download className="download-button">Download</a>
            </div>
          ))}
        </div>
        <Footer/>
      </div>
    </div>
  </section>
  </>
  );
};

export default Downloads;