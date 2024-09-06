import React, { useState, useEffect } from 'react';
import './ELibrary.css';
import Navbar from './Navbar';
import Footer from './Footer';
import englishImage from './images/English.png'; // Example import for images
import mathsImage from './images/Maths.png';
import scienceImage from './images/Science.png';
import ictImage from './images/ICT.png';

const books = [
  { id: 1, title: 'General English', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 3.5 },
  { id: 2, title: 'Easy Maths', category: 'Mathematics', link: '#', image: mathsImage, author: 'Jane Smith', rating: 5 },
  { id: 3, title: 'Social Studies', category: 'Science', link: '#', image: scienceImage, author: 'Emily Brown', rating: 4.8 },
  { id: 4, title: 'Introduction to ICT', category: 'ICT', link: '#', image: ictImage, author: 'Michael Johnson', rating: 3.0 },
  { id: 5, title: 'Easy English', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 4.5 },
  { id: 6, title: 'Numerical Tricks', category: 'Mathematics', link: '#', image: mathsImage, author: 'Jane Smith', rating: 4.2 },
  { id: 7, title: 'Grammar', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 2.5 },
];

const Elibrary = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const filteredBooks = books.filter(book =>
    (selectedCategory === 'All' || book.category === selectedCategory) &&
    (selectedAuthor === 'All' || book.author === selectedAuthor) &&
    book.rating >= minRating
  );

  // Get unique authors
  const authors = Array.from(new Set(books.map(book => book.author)));

  return (
    <>
      <Navbar toggleDarkMode={toggleDarkMode} />
      <section className="area">
        <ul className="circles">
          {Array(10).fill().map((_, i) => <li key={i}></li>)}
        </ul>
        <div className="context">
          <div className="library">
            <h2>E-Library</h2>
            <p>Access to online resources</p>
          </div>
          <div className="library-container">
            <div className="filters">
              {['All', 'Science', 'ICT', 'English', 'Mathematics'].map(category => (
                <button key={category} onClick={() => setSelectedCategory(category)}>{category}</button>
              ))}
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
                {[1, 2, 3, 4, 4.5, 5].map(rating => (
                  <option key={rating} value={rating}>{rating} ★</option>
                ))}
              </select>
            </div>
            <div className="book-cards">
              {filteredBooks.map(book => (
                <div key={book.id} className="book-card">
                  <img src={book.image} alt={book.title} className="book-image" />
                  <h3>{book.title}</h3>
                  <p>{book.category}</p>
                  <p className="author">Author: {book.author}</p>
                  <p className="rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className="star">{i < Math.floor(book.rating) ? '★' : '☆'}</span>
                    ))}
                    {book.rating % 1 !== 0 && <span className="half-star"></span>}
                  </p>
                  <a href={book.link} className="view-button">View</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Elibrary;