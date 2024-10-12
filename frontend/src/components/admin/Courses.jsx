import React, { useState, useEffect } from "react";
import './Courses.css';
import AdminPanel from "./AdminPanel";
import { FaEdit, FaTrashAlt, FaPrint, FaPlus, FaSave, FaTimes, FaBook, FaGraduationCap, FaCalendarAlt, FaDollarSign, FaChevronLeft, FaChevronRight, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  // Assume these states are populated from their respective components
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Smith" },
    { id: 2, name: "Bob Johnson" },
    { id: 3, name: "Charlie Davis" },
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mike Brown" },
  ]);

  const [books, setBooks] = useState([
    { id: 1, title: "Python Basics", teacherId: 1 },
    { id: 2, title: "Web Development Fundamentals", teacherId: 2 },
    { id: 3, title: "Statistics for Data Science", teacherId: 3 },
  ]);

  const [courses, setCourses] = useState([
    { id: 1, courseId: "C001", bookId: 1, studentId: 1, purchaseDate: "2023-09-01", payment: 500 },
    { id: 2, courseId: "C002", bookId: 2, studentId: 2, purchaseDate: "2023-10-01", payment: 600 },
    { id: 3, courseId: "C003", bookId: 3, studentId: 3, purchaseDate: "2023-09-15", payment: 550 },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseId: "", bookId: "", studentId: "", purchaseDate: "", payment: ""
  });
  const [editingCourse, setEditingCourse] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const filteredCourses = courses.filter(course => {
    const book = books.find(b => b.id === course.bookId);
    const student = students.find(s => s.id === course.studentId);
    const teacher = teachers.find(t => t.id === book?.teacherId);
    
    return (
      book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePrint = () => {
    const printContent = document.getElementById('coursesTable').outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleAddCourse = () => {
    setIsAdding(true);
  };

  const handleSaveNewCourse = () => {
    if (!newCourse.courseId || !newCourse.bookId || !newCourse.studentId || !newCourse.purchaseDate || !newCourse.payment) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setCourses([...courses, { ...newCourse, id: courses.length + 1 }]);
    setIsAdding(false);
    setNewCourse({ courseId: "", bookId: "", studentId: "", purchaseDate: "", payment: "" });
    setMessage({ text: "Course added successfully!", type: "success" });
  };


  const handleEditCourse = (course) => {
    setIsEditing(true);
    setEditingCourse({ ...course });
  };

  const handleSaveEditedCourse = () => {
    if (!editingCourse.courseId || !editingCourse.bookId || !editingCourse.studentId || !editingCourse.purchaseDate || !editingCourse.payment) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setCourses(courses.map(course => course.id === editingCourse.id ? editingCourse : course));
    setIsEditing(false);
    setEditingCourse(null);
    setMessage({ text: "Course updated successfully!", type: "success" });
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    setMessage({ text: "Course deleted successfully.", type: "success" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCourse(null);
  };

  const handleInputChange = (e, setter, object) => {
    const { name, value } = e.target;
    setter({ ...object, [name]: name === 'bookId' || name === 'studentId' ? parseInt(value, 10) : value });
  };

  return (
    <div className="courses">
      <AdminPanel />
      <div className="courses-container">
        <h2 className="heading">Courses...</h2>
        <div className="search-container">
          <div className="input-search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="print-button" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
        </div>
        
        {!isAdding && !isEditing && (
          <button className="add-course-button" onClick={handleAddCourse}>
            <FaPlus /> Add Course
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
          <div className="add-course-form">
            <h3>New Course</h3>
            <div className="input-group">
              <FaBook className="input-icon" />
              <input
                type="text"
                name="courseId"
                placeholder="Course ID"
                value={newCourse.courseId}
                onChange={(e) => handleInputChange(e, setNewCourse, newCourse)}
              />
            </div>
            <div className="input-group">
              <FaBook className="input-icon" />
              <select
                name="bookId"
                value={newCourse.bookId}
                onChange={(e) => handleInputChange(e, setNewCourse, newCourse)}
              >
                <option value="">Select Book</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <FaGraduationCap className="input-icon" />
              <select
                name="studentId"
                value={newCourse.studentId}
                onChange={(e) => handleInputChange(e, setNewCourse, newCourse)}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                name="purchaseDate"
                value={newCourse.purchaseDate}
                onChange={(e) => handleInputChange(e, setNewCourse, newCourse)}
              />
            </div>
            <div className="input-group">
              <FaDollarSign className="input-icon" />
              <input
                type="number"
                name="payment"
                placeholder="Payment"
                value={newCourse.payment}
                onChange={(e) => handleInputChange(e, setNewCourse, newCourse)}
              />
            </div>
            <button onClick={handleSaveNewCourse}><FaSave /> Save</button>
            <button onClick={() => setIsAdding(false)}><FaTimes /> Cancel</button>
          </div>
        )}

        {isEditing && (
          <div className="edit-course-form">
            <h3>Edit Course</h3>
            <div className="input-group">
              <FaBook className="input-icon" />
              <input
                type="text"
                name="courseId"
                placeholder="Course ID"
                value={editingCourse.courseId}
                onChange={(e) => handleInputChange(e, setEditingCourse, editingCourse)}
              />
            </div>
            <div className="input-group">
              <FaBook className="input-icon" />
              <select
                name="bookId"
                value={editingCourse.bookId}
                onChange={(e) => handleInputChange(e, setEditingCourse, editingCourse)}
              >
                <option value="">Select Book</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <FaGraduationCap className="input-icon" />
              <select
                name="studentId"
                value={editingCourse.studentId}
                onChange={(e) => handleInputChange(e, setEditingCourse, editingCourse)}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                name="purchaseDate"
                value={editingCourse.purchaseDate}
                onChange={(e) => handleInputChange(e, setEditingCourse, editingCourse)}
              />
            </div>
            <div className="input-group">
              <FaDollarSign className="input-icon" />
              <input
                type="number"
                name="payment"
                placeholder="Payment"
                value={editingCourse.payment}
                onChange={(e) => handleInputChange(e, setEditingCourse, editingCourse)}
              />
            </div>
            <button onClick={handleSaveEditedCourse}><FaSave /> Save</button>
            <button onClick={handleCancelEdit}><FaTimes /> Cancel</button>
          </div>
        )}

        <table id="coursesTable" className="courses-table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Book</th>
              <th>Teacher</th>
              <th>Student</th>
              <th>Purchase Date</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.length > 0 ? (
              currentCourses.map(course => {
                const book = books.find(b => b.id === course.bookId);
                const student = students.find(s => s.id === course.studentId);
                const teacher = teachers.find(t => t.id === book?.teacherId);
                return (
                  <tr key={course.id}>
                    <td data-label="Course ID">{course.courseId}</td>
                    <td data-label="Book">{book ? book.title : 'Unknown'}</td>
                    <td data-label="Teacher">{teacher ? teacher.name : 'Unknown'}</td>
                    <td data-label="Student">{student ? student.name : 'Unknown'}</td>
                    <td data-label="Purchase Date">{course.purchaseDate}</td>
                    <td data-label="Payment">${course.payment}</td>
                    <td data-label="Actions">
                      <div className="action-buttons">
                        <button 
                          className="edit-button" 
                          onClick={() => handleEditCourse(course)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="remove-button" 
                          onClick={() => handleDeleteCourse(course.id)}
                          title="Delete"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-courses">No courses found.</td>
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
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Courses;