import React, { useState, useEffect } from 'react';
import './ELibrary.css';
import Navbar from './Navbar';
import Footer from './Footer';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import englishImage from '../../assets/images/English.png';
import mathsImage from '../../assets/images/Maths.png';
import scienceImage from '../../assets/images/Science.png';
import ictImage from '../../assets/images/ICT.png';

const books = [
  { id: 1, title: 'General English', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 3.5 },
  { id: 2, title: 'Easy Maths', category: 'Mathematics', link: '#', image: mathsImage, author: 'Jane Smith', rating: 5 },
  { id: 3, title: 'Social Studies', category: 'Science', link: '#', image: scienceImage, author: 'Emily Brown', rating: 4.8 },
  { id: 4, title: 'Introduction to ICT', category: 'ICT', link: '#', image: ictImage, author: 'Michael Johnson', rating: 3.0 },
  { id: 5, title: 'Easy English', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 4.5 },
  { id: 6, title: 'Numerical Tricks', category: 'Mathematics', link: '#', image: mathsImage, author: 'Jane Smith', rating: 4.2 },
  { id: 7, title: 'Grammar', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 2.5 },
  { id: 8, title: 'General English', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 3.5 },
  { id: 9, title: 'Easy Maths', category: 'Mathematics', link: '#', image: mathsImage, author: 'Jane Smith', rating: 5 },
  { id: 10, title: 'Social Studies', category: 'Science', link: '#', image: scienceImage, author: 'Emily Brown', rating: 4.8 },
  { id: 11, title: 'Introduction to ICT', category: 'ICT', link: '#', image: ictImage, author: 'Michael Johnson', rating: 3.0 },
  { id: 12, title: 'Easy English', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 4.5 },
  { id: 13, title: 'Numerical Tricks', category: 'Mathematics', link: '#', image: mathsImage, author: 'Jane Smith', rating: 4.2 },
  { id: 14, title: 'Grammar', category: 'English', link: '#', image: englishImage, author: 'John Doe', rating: 2.5 },
];

const ITEMS_PER_PAGE = 7; // Number of items per page

const Elibrary = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    AOS.init({ duration: 1000 }); // Initialize AOS
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const filteredBooks = books.filter(book =>
    (selectedCategory === 'All' || book.category === selectedCategory) &&
    (selectedAuthor === 'All' || book.author === selectedAuthor) &&
    book.rating >= minRating
  );

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          <div className="library" data-aos="fade-down">
            <h2>E-Library</h2>
            <p>Access to online resources</p>
          </div>
          <div className="library-container">
            <div className="filters" data-aos="fade-up" data-aos-delay="200">
              {['All', 'Science', 'ICT', 'English', 'Mathematics'].map(category => (
                <button key={category} onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1); // Reset to first page on category change
                }}>{category}</button>
              ))}
            </div>
            <div className="filters" data-aos="fade-up" data-aos-delay="400">
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
              {paginatedBooks.map(book => (
                <div key={book.id} className="book-card" data-aos="fade-up" data-aos-delay={`${book.id * 100}`}>
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
                  <br />
                  <a href={book.link} className="view-button">View</a>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default Elibrary;
