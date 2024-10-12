import React, { useState, useEffect } from "react";
import './Books.css';
import AdminPanel from "./AdminPanel";
import { FaEdit, FaTrashAlt, FaPrint, FaPlus, FaSave, FaTimes, FaBook, FaUser, FaCalendarAlt, FaBarcode, FaImage, FaChevronLeft, FaChevronRight, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Books = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3;

  // Add this new state for teachers
  const [teachers, setTeachers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
    // Add more teachers as needed
  ]);

  // Modify the books state to use teacherId instead of author
  const [books, setBooks] = useState([
    { id: 1, isbn: "9781234567890", title: "To Kill a Mockingbird", teacherId: 1, publicationDate: "1960-07-11", coverImage: null },
    { id: 2, isbn: "9780987654321", title: "1984", teacherId: 2, publicationDate: "1949-06-08", coverImage: null },
    { id: 3, isbn: "9781122334455", title: "Pride and Prejudice", teacherId: 3, publicationDate: "1813-01-28", coverImage: null },
    { id: 4, isbn: "9780011223344", title: "The Great Gatsby", teacherId: 1, publicationDate: "1925-04-10", coverImage: null },
    { id: 5, isbn: "9785544332211", title: "Moby-Dick", teacherId: 2, publicationDate: "1851-10-18", coverImage: null },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Modify newBook and editingBook states to use teacherId
  const [newBook, setNewBook] = useState({
    isbn: "", title: "", teacherId: "", publicationDate: "", coverImage: null
  });
  const [editingBook, setEditingBook] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teachers.find(t => t.id === book.teacherId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePrint = () => {
    const printContent = document.getElementById('booksTable').outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleAddBook = () => {
    setIsAdding(true);
  };

  const handleSaveNewBook = () => {
    if (!newBook.isbn || !newBook.title || !newBook.teacherId || !newBook.publicationDate) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setBooks([...books, { ...newBook, id: books.length + 1 }]);
    setIsAdding(false);
    setNewBook({ isbn: "", title: "", teacherId: "", publicationDate: "", coverImage: null });
    setMessage({ text: "Book added successfully!", type: "success" });
  };

  const handleEditBook = (book) => {
    setIsEditing(true);
    setEditingBook({ ...book });
  };

  const handleSaveEditedBook = () => {
    if (!editingBook.isbn || !editingBook.title || !editingBook.teacherId || !editingBook.publicationDate) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setBooks(books.map(book => book.id === editingBook.id ? editingBook : book));
    setIsEditing(false);
    setEditingBook(null);
    setMessage({ text: "Book updated successfully!", type: "success" });
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
    setMessage({ text: "Book deleted successfully.", type: "success" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingBook(null);
  };

  // Modify handleInputChange to handle select for teacherId
  const handleInputChange = (e, setter, object) => {
    const { name, value } = e.target;
    setter({ ...object, [name]: name === 'teacherId' ? parseInt(value, 10) : value });
  };

  const handleImageChange = (e, setter, object) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter({ ...object, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="books">
      <AdminPanel />
      <div className="books-container">
        <h2 className="heading">Books...</h2>
        <div className="search-container">
          <div className="input-search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="print-button" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
        </div>
        
        {!isAdding && !isEditing && (
          <button className="add-book-button" onClick={handleAddBook}>
            <FaPlus /> Add Book
          </button>
        )}

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === "error" ? (
              <FaExclamationCircle className="icon" />
            ) : (
              <FaCheckCircle className="icon" />
            )}
            {message.text}
          </div>
        )}

        {isAdding && (
          <div className="add-book-form">
            <h3>Add New Book</h3>
            <div className="input-group">
              <FaBarcode className="input-icon" />
              <input
                type="text"
                name="isbn"
                placeholder="ISBN"
                value={newBook.isbn}
                onChange={(e) => handleInputChange(e, setNewBook, newBook)}
              />
            </div>
            <div className="input-group">
              <FaBook className="input-icon" />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => handleInputChange(e, setNewBook, newBook)}
              />
            </div>
            <div className="input-group">
              <FaUser className="input-icon" />
              <select
                name="teacherId"
                value={newBook.teacherId}
                onChange={(e) => handleInputChange(e, setNewBook, newBook)}
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                name="publicationDate"
                placeholder="Publication Date"
                value={newBook.publicationDate}
                onChange={(e) => handleInputChange(e, setNewBook, newBook)}
              />
            </div>
            <div className="input-group">
              <FaImage className="input-icon" />
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setNewBook, newBook)}
              />
            </div>
            {newBook.coverImage && (
              <div className="cover-preview">
                <img src={newBook.coverImage} alt="Book cover preview" />
              </div>
            )}
            <button onClick={handleSaveNewBook}><FaSave /> Save</button>
            <button onClick={() => setIsAdding(false)}><FaTimes /> Cancel</button>
          </div>
        )}

        {isEditing && (
          <div className="edit-book-form">
            <h3>Edit Book</h3>
            <div className="input-group">
              <FaBarcode className="input-icon" />
              <input
                type="text"
                name="isbn"
                value={editingBook.isbn}
                onChange={(e) => handleInputChange(e, setEditingBook, editingBook)}
              />
            </div>
            <div className="input-group">
              <FaBook className="input-icon" />
              <input
                type="text"
                name="title"
                value={editingBook.title}
                onChange={(e) => handleInputChange(e, setEditingBook, editingBook)}
              />
            </div>
            <div className="input-group">
              <FaUser className="input-icon"/>            
                <select 
                  name="teacherId"
                  value={editingBook.teacherId}
                  onChange={(e) => handleInputChange(e, setEditingBook, editingBook)}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>

            </div>
            <div className="input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                name="publicationDate"
                value={editingBook.publicationDate}
                onChange={(e) => handleInputChange(e, setEditingBook, editingBook)}
              />
            </div>
            <div className="input-group">
              <FaImage className="input-icon" />
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setEditingBook, editingBook)}
              />
            </div>
            {editingBook.coverImage && (
              <div className="cover-preview">
                <img src={editingBook.coverImage} alt="Book cover preview" />
              </div>
            )}
            <button onClick={handleSaveEditedBook}><FaSave /> Save</button>
            <button onClick={handleCancelEdit}><FaTimes /> Cancel</button>
          </div>
        )}

        <table id="booksTable" className="books-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>ISBN</th>
              <th>Title</th>
              <th>Teacher</th>
              <th>Publication Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.length > 0 ? (
              currentBooks.map(book => (
                <tr key={book.id}>
                  <td data-label="Cover">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="book-cover" />
                    ) : (
                      <div className="book-cover-placeholder">No Cover</div>
                    )}
                  </td>
                  <td data-label="ISBN">{book.isbn}</td>
                  <td data-label="Title">{book.title}</td>
                  <td data-label="Teacher">{teachers.find(t => t.id === book.teacherId)?.name || 'Unknown'}</td>
                  <td data-label="Publication Date">{book.publicationDate}</td>
                  <td data-label="Actions">
                    <button className="edit-button" onClick={() => handleEditBook(book)}><FaEdit /></button>
                    <button className="remove-button" onClick={() => handleDeleteBook(book.id)}><FaTrashAlt /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-books">No books found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="page">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Books;