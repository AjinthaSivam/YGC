import React, { useState, useEffect } from "react";
import './Teachers.css';
import AdminPanel from "./AdminPanel";
import { FaEdit, FaTrashAlt, FaPrint, FaChalkboardTeacher,FaPlus, FaSave, FaTimes, FaIdCard, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaImage, FaChevronLeft, FaChevronRight, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 3;

  const [teachers, setTeachers] = useState([
    { id: 1, teacherId: "T001", name: "John Doe", email: "john@example.com", phone: "123-456-7890", subject: "Mathematics", image: null },
    { id: 2, teacherId: "T002", name: "Jane Smith", email: "jane@example.com", phone: "234-567-8901", subject: "Science", image: null },
    { id: 3, teacherId: "T003", name: "Bob Johnson", email: "bob@example.com", phone: "345-678-9012", subject: "English", image: null },
    { id: 4, teacherId: "T004", name: "Alice Brown", email: "alice@example.com", phone: "456-789-0123", subject: "History", image: null },
    { id: 5, teacherId: "T005", name: "Charlie Davis", email: "charlie@example.com", phone: "567-890-1234", subject: "Art", image: null },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    teacherId: "", name: "", email: "", phone: "", subject: "", image: null
  });
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePrint = () => {
    const printContent = document.getElementById('teachersTable').outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleAddTeacher = () => {
    setIsAdding(true);
  };

  const handleSaveNewTeacher = () => {
    if (!newTeacher.teacherId || !newTeacher.name || !newTeacher.email || !newTeacher.phone || !newTeacher.subject) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setTeachers([...teachers, { ...newTeacher, id: teachers.length + 1 }]);
    setIsAdding(false);
    setNewTeacher({ teacherId: "", name: "", email: "", phone: "", subject: "", image: null });
    setMessage({ text: "Teacher added successfully!", type: "success" });
  };

  const handleEditTeacher = (teacher) => {
    setIsEditing(true);
    setEditingTeacher({ ...teacher });
  };

  const handleSaveEditedTeacher = () => {
    if (!editingTeacher.teacherId || !editingTeacher.name || !editingTeacher.email || !editingTeacher.phone || !editingTeacher.subject) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setTeachers(teachers.map(teacher => teacher.id === editingTeacher.id ? editingTeacher : teacher));
    setIsEditing(false);
    setEditingTeacher(null);
    setMessage({ text: "Teacher updated successfully!", type: "success" });
  };

  const handleDeleteTeacher = (id) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
    setMessage({ text: "Teacher deleted successfully.", type: "success" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTeacher(null);
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
    <div className="teachers">
      <AdminPanel />
      <div className="teachers-container">
      {/* <h2 className="heading"><FaChalkboardTeacher/>Teachers...</h2> */}
      <h2 className="heading">Teachers...</h2>
        <div className="search-container">
          <div className="input-search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="print-button" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
        </div>
        
        {!isAdding && !isEditing && (
          <button className="add-teacher-button" onClick={handleAddTeacher}>
            <FaPlus /> Add Teacher
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
          <div className="add-teacher-form">
            <h3>Add New Teacher</h3>
            <div className="input-group">
              <FaIdCard className="input-icon" />
              <input
                type="text"
                name="teacherId"
                placeholder="Teacher ID"
                value={newTeacher.teacherId}
                onChange={(e) => handleInputChange(e, setNewTeacher, newTeacher)}
              />
            </div>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={newTeacher.name}
                onChange={(e) => handleInputChange(e, setNewTeacher, newTeacher)}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newTeacher.email}
                onChange={(e) => handleInputChange(e, setNewTeacher, newTeacher)}
              />
            </div>
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={newTeacher.phone}
                onChange={(e) => handleInputChange(e, setNewTeacher, newTeacher)}
              />
            </div>
            <div className="input-group">
              <FaGraduationCap className="input-icon" />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={newTeacher.subject}
                onChange={(e) => handleInputChange(e, setNewTeacher, newTeacher)}
              />
            </div>
            <div className="input-group">
              <FaImage className="input-icon" />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setNewTeacher, newTeacher)}
              />
            </div>
            {newTeacher.image && (
              <div className="image-preview">
                <img src={newTeacher.image} alt="Teacher preview" />
              </div>
            )}
            <button onClick={handleSaveNewTeacher}><FaSave /> Save</button>
            <button onClick={() => setIsAdding(false)}><FaTimes /> Cancel</button>
          </div>
        )}

        {isEditing && (
          <div className="edit-teacher-form">
            <h3>Edit Teacher</h3>
            <div className="input-group">
              <FaIdCard className="input-icon" />
              <input
                type="text"
                name="teacherId"
                value={editingTeacher.teacherId}
                onChange={(e) => handleInputChange(e, setEditingTeacher, editingTeacher)}
              />
            </div>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                value={editingTeacher.name}
                onChange={(e) => handleInputChange(e, setEditingTeacher, editingTeacher)}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                value={editingTeacher.email}
                onChange={(e) => handleInputChange(e, setEditingTeacher, editingTeacher)}
              />
            </div>
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={editingTeacher.phone}
                onChange={(e) => handleInputChange(e, setEditingTeacher, editingTeacher)}
              />
            </div>
            <div className="input-group">
              <FaGraduationCap className="input-icon" />
              <input
                type="text"
                name="subject"
                value={editingTeacher.subject}
                onChange={(e) => handleInputChange(e, setEditingTeacher, editingTeacher)}
              />
            </div>
            <div className="input-group">
              <FaImage className="input-icon" />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setEditingTeacher, editingTeacher)}
              />
            </div>
            {editingTeacher.image && (
              <div className="image-preview">
                <img src={editingTeacher.image} alt="Teacher preview" />
              </div>
            )}
            <button onClick={handleSaveEditedTeacher}><FaSave /> Save</button>
            <button onClick={handleCancelEdit}><FaTimes /> Cancel</button>
          </div>
        )}

        <table id="teachersTable" className="teachers-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Teacher ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length > 0 ? (
              currentTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td data-label="Image">
                    {teacher.image ? (
                      <img src={teacher.image} alt={teacher.name} className="teacher-image" />
                    ) : (
                      <div className="teacher-image-placeholder">No Image</div>
                    )}
                  </td>
                  <td data-label="Teacher ID">{teacher.teacherId}</td>
                  <td data-label="Name">{teacher.name}</td>
                  <td data-label="Email">{teacher.email}</td>
                  <td data-label="Phone">{teacher.phone}</td>
                  <td data-label="Subject">{teacher.subject}</td>
                  <td data-label="Actions">
                    <button className="edit-button" onClick={() => handleEditTeacher(teacher)}><FaEdit /></button>
                    <button className="remove-button" onClick={() => handleDeleteTeacher(teacher.id)}><FaTrashAlt /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-teachers">No teachers found.</td>
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

export default Teachers;