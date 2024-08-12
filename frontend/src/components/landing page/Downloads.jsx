import React, { useState } from 'react';
import './Downloads.css';

const books = [
  { id: 1, title: 'Introduction to Quantum Physics', category: 'Science', link: '#', image: 'path/to/quantum-physics.jpg' },
  { id: 2, title: 'Advanced Algorithms and Data Structures', category: 'Technology', link: '#', image: 'path/to/algorithms.jpg' },
  { id: 3, title: 'Modern Art History', category: 'Arts', link: '#', image: 'path/to/art-history.jpg' },
  { id: 4, title: 'Shakespeare\'s Complete Works', category: 'Literature', link: '#', image: 'path/to/shakespeare.jpg' },
  { id: 5, title: 'Artificial Intelligence: A Modern Approach', category: 'Technology', link: '#', image: 'path/to/ai.jpg' },
  { id: 6, title: 'Calculus and Its Applications', category: 'Mathematics', link: '#', image: 'path/to/calculus.jpg' },
];

const Downloads = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBooks = selectedCategory === 'All'
    ? books
    : books.filter(book => book.category === selectedCategory);

  return (
    <div className="downloads-container">
      <h2>Downloads</h2>
      <p>Links to downloadable content.</p>
      <div className="filters">
        <button onClick={() => setSelectedCategory('All')}>All</button>
        <button onClick={() => setSelectedCategory('Science')}>Science</button>
        <button onClick={() => setSelectedCategory('Technology')}>Technology</button>
        <button onClick={() => setSelectedCategory('Arts')}>Arts</button>
        <button onClick={() => setSelectedCategory('Literature')}>Literature</button>
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
    </div>
  );
};

export default Downloads;

