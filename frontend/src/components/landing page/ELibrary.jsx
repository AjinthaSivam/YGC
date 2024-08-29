import React, { useState, useEffect } from 'react';
import './ELibrary.css';
import Navbar from './Navbar';
import Footer from './Footer';

const books = [
  { id: 1, title: 'General English', category: 'English', link: '#', image: 'src/components/landing page/images/English.png', author: 'John Doe', rating: 3.5 },
  { id: 2, title: 'Easy Maths', category: 'Mathematics', link: '#', image: 'src/components/landing page/images/Maths.png', author: 'Jane Smith', rating: 4.2 },
  { id: 3, title: 'Social Studies', category: 'Science', link: '#', image: 'src/components/landing page/images/Science.png', author: 'Emily Brown', rating: 4.8 },
  { id: 4, title: 'Introduction to ICT', category: 'ICT', link: '#', image: 'src/components/landing page/images/ICT.png', author: 'Michael Johnson', rating: 3.0 },
  { id: 5, title: 'Easy English', category: 'English', link: '#', image: 'src/components/landing page/images/English.png', author: 'John Doe', rating: 4.5 },
  { id: 6, title: 'Numerical Tricks', category: 'Mathematics', link: '#', image: 'src/components/landing page/images/Maths.png', author: 'Jane Smith', rating: 4.2 },
  { id: 7, title: 'Grammar', category: 'English', link: '#', image: 'src/components/landing page/images/English.png', author: 'John Doe', rating: 2.5 },
];

const Elibrary = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [minRating, setMinRating] = useState(0);

  const filteredBooks = books.filter(book => 
    (selectedCategory === 'All' || book.category === selectedCategory) &&
    (selectedAuthor === 'All' || book.author === selectedAuthor) &&
    book.rating >= minRating
  );

  // Create a list of unique authors
  const authors = [...new Set(books.map(book => book.author))];

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
        <div className="library">
          <h2>E-Library</h2>
          <p>Access to online resources.</p>
        </div>
        <div className="library-container">
          <div className="filters">
            <button onClick={() => setSelectedCategory('All')}>All</button>
            <button onClick={() => setSelectedCategory('Science')}>Science</button>
            <button onClick={() => setSelectedCategory('ICT')}>ICT</button>
            <button onClick={() => setSelectedCategory('English')}>English</button>
            <button onClick={() => setSelectedCategory('Mathematics')}>Mathematics</button>
          </div>
          <div className="filters">
            <select onChange={(e) => setSelectedAuthor(e.target.value)} value={selectedAuthor}>
              <option value="All">All Authors</option>
              {authors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
            <select onChange={(e) => setMinRating(Number(e.target.value))} value={minRating}>
              <option value={0}>All Ratings</option>
              <option value={1}>1 ★</option>
              <option value={2}>2 ★</option>
              <option value={3}>3 ★</option>
              <option value={4}>4 ★</option>
              <option value={4.5}>4.5 ★</option>
              <option value={5}>5 ★</option>
            </select>
          </div>
          <div className="book-cards">
            {filteredBooks.map(book => (
              <div key={book.id} className="book-card">
                <img src={book.image} alt={book.title} className="book-image" />
                <h3>{book.title}</h3>
                <p>{book.category}</p>
                <p className="author">Author: {book.author}</p>
                <p className="rating">{Array.from({ length: 5 }, (_, i) => i < book.rating ? '★' : '☆').join(' ')}</p>
                <a href={book.link} download className="view-button">View</a>
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

export default Elibrary;
