import React, { useState, useEffect } from 'react';
import './Downloads.css';
import Navbar from './Navbar';
import Footer from './Footer';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import Englishp from '../../assets/images/Englishp.png'
import Mathsp from '../../assets/images/Mathsp.png'
import Sciencep from '../../assets/images/Sciencep.png'
import ICTp from '../../assets/images/ICTp.png'
const books = [
  { id: 1, title: 'G.C.E O/L 2023', category: 'English', link: '#', image: `${Englishp}` },
  { id: 2, title: 'G.C.E O/L 2023', category: 'Mathematics', link: '#', image: `${Mathsp}` },
  { id: 3, title: 'G.C.E O/L 2023', category: 'Science', link: '#', image: `${Sciencep}` },
  { id: 4, title: 'G.C.E O/L 2023', category: 'ICT', link: '#', image: `${ICTp}` },
  { id: 5, title: 'G.C.E O/L 2022', category: 'English', link: '#', image: `${Englishp}` },
  { id: 6, title: 'G.C.E O/L 2022', category: 'Mathematics', link: 'https://www.digitalarchives.online/2024/05/gce-ol-2023-english-language-past-paper.html', image: `${Mathsp}` },
  { id: 7, title: 'G.C.E O/L 2021', category: 'English', link: '#', image: `${Englishp}` },
  { id: 10, title: 'G.C.E O/L 2023', category: 'Science', link: '#', image: `${Sciencep}` },
  { id: 11, title: 'G.C.E O/L 2023', category: 'ICT', link: '#', image: `${ICTp}` },
  { id: 12, title: 'G.C.E O/L 2022', category: 'English', link: '#', image: `${Englishp}` },
  { id: 13, title: 'G.C.E O/L 2022', category: 'Mathematics', link: 'https://www.digitalarchives.online/2024/05/gce-ol-2023-english-language-past-paper.html', image: `${Mathsp}` },
  { id: 14, title: 'G.C.E O/L 2021', category: 'English', link: '#', image: `${Englishp}` },
];

const ITEMS_PER_PAGE = 7; // Number of items per page

const Downloads = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  const filteredBooks = selectedCategory === 'All'
    ? books
    : books.filter(book => book.category === selectedCategory);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <Navbar toggleDarkMode={toggleDarkMode} />
      <section className="area">
        <ul className="circles">
          {Array(10).fill().map((_, i) => <li key={i}></li>)}
        </ul>
        <div className="context">
          <div className="downloads" data-aos="fade-down">
            <h2>Downloads</h2>
            <p>Links to downloadable content</p>
          </div>
          <div className="downloads-container">
            <div className="filters" data-aos="fade-up" data-aos-delay="200">
              {['All', 'Science', 'ICT', 'English', 'Mathematics'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1); // Reset to first page on category change
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="book-cards">
              {paginatedBooks.map(book => (
                <div key={book.id} className="book-card" data-aos="fade-up" data-aos-delay={`${book.id * 100}`}>
                  <img src={book.image} alt={book.title} className="book-image" />
                  <h3>{book.title}</h3>
                  <p>{book.category}</p>
                  <br/>
                  <a href={book.link} className="download-button">Download</a>
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

export default Downloads;
