import React, { useState } from "react";
import './Books.css'; // External CSS for styling
import { FaTrash, FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import AdminPanel from "./AdminPanel";

const initialBooks = [
  { id: 1, title: "Introduction to AI", author: "John Doe", description: "A comprehensive guide to AI concepts." },
  { id: 2, title: "Learning React", author: "Jane Smith", description: "An in-depth look at building applications with React." },
];

const Books = () => {
  const [books, setBooks] = useState(initialBooks);
  const [newBook, setNewBook] = useState({ title: '', author: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.description) {
      setMessage({ text: 'Please fill out all fields.', type: 'error' });
      return;
    }
    if (isEditing) {
      setBooks(books.map(book => (book.id === currentBookId ? { ...newBook, id: currentBookId } : book)));
      setMessage({ text: 'Book updated successfully!', type: 'success' });
    } else {
      setBooks([...books, { ...newBook, id: Date.now() }]);
      setMessage({ text: 'Book added successfully!', type: 'success' });
    }
    resetForm();
  };

  const handleEditBook = (book) => {
    setNewBook(book);
    setIsEditing(true);
    setCurrentBookId(book.id);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter(book => book.id !== id));
      setMessage({ text: 'Book deleted successfully!', type: 'success' });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetForm = () => {
    setNewBook({ title: '', author: '', description: '' });
    setIsEditing(false);
    setCurrentBookId(null);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="books-container">
      <AdminPanel />
      <div className="book-management-container">
        <div className="form-container">
          <h2 className="management-title">{isEditing ? "Edit Book" : "Add Book"}</h2>
          <input
            type="text"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            placeholder="Book Title" 
            className="input-field"
          />
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            placeholder="Author"
            className="input-field"
          />
          <textarea
            name="description"
            value={newBook.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="textarea-field"
          />
          <button onClick={handleAddBook} className="btn-add">
            <FaPlus /> {isEditing ? "Update Book" : "Add Book"}
          </button>
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Books by Title or Author"
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>

        <div className="books-list">
          {currentBooks.map(book => (
            <div className="book-card" key={book.id}>
              <h3>{book.title}</h3>
              <p className="author">by {book.author}</p>
              <p className="description">{book.description}</p>
              <div className="action-buttons">
                <button className="btn-edit" onClick={() => handleEditBook(book)}>
                  <FaEdit /> Edit
                </button>
                <button className="btn-delete" onClick={() => handleDeleteBook(book.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, index) => (
            <button className="page-button" key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;
