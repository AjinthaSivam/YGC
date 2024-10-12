import React, { useState, useEffect } from "react";
import './Students.css';
import AdminPanel from "./AdminPanel";
import { FaEdit, FaTrashAlt, FaPrint, FaPlus, FaSave, FaTimes, FaIdCard, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaImage, FaChevronLeft, FaChevronRight, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 3;

  const [students, setStudents] = useState([
    { id: 1, studentId: "S001", name: "John Doe", email: "john@example.com", phone: "123-456-7890", grade: "10th", image: null },
    { id: 2, studentId: "S002", name: "Jane Smith", email: "jane@example.com", phone: "234-567-8901", grade: "11th", image: null },
    { id: 3, studentId: "S003", name: "Bob Johnson", email: "bob@example.com", phone: "345-678-9012", grade: "9th", image: null },
    { id: 4, studentId: "S004", name: "Alice Brown", email: "alice@example.com", phone: "456-789-0123", grade: "12th", image: null },
    { id: 5, studentId: "S005", name: "Charlie Davis", email: "charlie@example.com", phone: "567-890-1234", grade: "10th", image: null },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentId: "", name: "", email: "", phone: "", grade: "", image: null
  });
  const [editingStudent, setEditingStudent] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePrint = () => {
    const printContent = document.getElementById('studentsTable').outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleAddStudent = () => {
    setIsAdding(true);
  };

  const handleSaveNewStudent = () => {
    if (!newStudent.studentId || !newStudent.name || !newStudent.email || !newStudent.phone || !newStudent.grade) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setStudents([...students, { ...newStudent, id: students.length + 1 }]);
    setIsAdding(false);
    setNewStudent({ studentId: "", name: "", email: "", phone: "", grade: "", image: null });
    setMessage({ text: "Student added successfully!", type: "success" });
  };

  const handleEditStudent = (student) => {
    setIsEditing(true);
    setEditingStudent({ ...student });
  };

  const handleSaveEditedStudent = () => {
    if (!editingStudent.studentId || !editingStudent.name || !editingStudent.email || !editingStudent.phone || !editingStudent.grade) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setStudents(students.map(student => student.id === editingStudent.id ? editingStudent : student));
    setIsEditing(false);
    setEditingStudent(null);
    setMessage({ text: "Student updated successfully!", type: "success" });
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
    setMessage({ text: "Student deleted successfully.", type: "success" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };

  const handleInputChange = (e, setter, object) => {
    const { name, value } = e.target;
    setter({ ...object, [name]: value });
  };

  const handleImageChange = (e, setter, object) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter({ ...object, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="students">
      <AdminPanel />
      <div className="students-container">
        <h2 className="heading">Students...</h2>
        <div className="search-container">
          <div className="input-search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="print-button" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
        </div>
        
        {!isAdding && !isEditing && (
          <button className="add-student-button" onClick={handleAddStudent}>
            <FaPlus /> Add Student
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
          <div className="add-student-form">
            <h3>Add New Student</h3>
            <div className="input-group">
              <FaIdCard className="input-icon" />
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                value={newStudent.studentId}
                onChange={(e) => handleInputChange(e, setNewStudent, newStudent)}
              />
            </div>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={newStudent.name}
                onChange={(e) => handleInputChange(e, setNewStudent, newStudent)}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => handleInputChange(e, setNewStudent, newStudent)}
              />
            </div>
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={newStudent.phone}
                onChange={(e) => handleInputChange(e, setNewStudent, newStudent)}
              />
            </div>
            <div className="input-group">
              <FaGraduationCap className="input-icon" />
              <input
                type="text"
                name="grade"
                placeholder="Grade"
                value={newStudent.grade}
                onChange={(e) => handleInputChange(e, setNewStudent, newStudent)}
              />
            </div>
            <div className="input-group">
              <FaImage className="input-icon" />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setNewStudent, newStudent)}
              />
            </div>
            {newStudent.image && (
              <div className="image-preview">
                <img src={newStudent.image} alt="Student preview" />
              </div>
            )}
            <button onClick={handleSaveNewStudent}><FaSave /> Save</button>
            <button onClick={() => setIsAdding(false)}><FaTimes /> Cancel</button>
          </div>
        )}

        {isEditing && (
          <div className="edit-student-form">
            <h3>Edit Student</h3>
            <div className="input-group">
              <FaIdCard className="input-icon" />
              <input
                type="text"
                name="studentId"
                value={editingStudent.studentId}
                onChange={(e) => handleInputChange(e, setEditingStudent, editingStudent)}
              />
            </div>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                value={editingStudent.name}
                onChange={(e) => handleInputChange(e, setEditingStudent, editingStudent)}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                value={editingStudent.email}
                onChange={(e) => handleInputChange(e, setEditingStudent, editingStudent)}
              />
            </div>
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={editingStudent.phone}
                onChange={(e) => handleInputChange(e, setEditingStudent, editingStudent)}
              />
            </div>
            <div className="input-group">
              <FaGraduationCap className="input-icon" />
              <input
                type="text"
                name="grade"
                value={editingStudent.grade}
                onChange={(e) => handleInputChange(e, setEditingStudent, editingStudent)}
              />
            </div>
            <div className="input-group">
              <FaImage className="input-icon" />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setEditingStudent, editingStudent)}
              />
            </div>
            {editingStudent.image && (
              <div className="image-preview">
                <img src={editingStudent.image} alt="Student preview" />
              </div>
            )}
            <button onClick={handleSaveEditedStudent}><FaSave /> Save</button>
            <button onClick={handleCancelEdit}><FaTimes /> Cancel</button>
          </div>
        )}

        <table id="studentsTable" className="students-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map(student => (
                <tr key={student.id}>
                  <td data-label="Image">
                    {student.image ? (
                      <img src={student.image} alt={student.name} className="student-image" />
                    ) : (
                      <div className="student-image-placeholder">No Image</div>
                    )}
                  </td>
                  <td data-label="Student ID">{student.studentId}</td>
                  <td data-label="Name">{student.name}</td>
                  <td data-label="Email">{student.email}</td>
                  <td data-label="Phone">{student.phone}</td>
                  <td data-label="Grade">{student.grade}</td>
                  <td data-label="Actions">
                    <button className="edit-button" onClick={() => handleEditStudent(student)}><FaEdit /></button>
                    <button className="remove-button" onClick={() => handleDeleteStudent(student.id)}><FaTrashAlt /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-students">No students found.</td>
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

export default Students;