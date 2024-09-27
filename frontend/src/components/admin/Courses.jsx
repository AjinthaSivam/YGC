import React, { useState } from "react";
import './Courses.css';
import AdminPanel from "./AdminPanel";
import { FaPlus, FaEdit, FaTrash,FaBook, FaPrint, FaInfoCircle, FaClock, FaUser, FaDollarSign, FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Courses = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "Course 1", description: "Introduction to AI", duration: "4 weeks", teacher: "Dr. Smith", fee: "$200", image: "path/to/image1.jpg" },
    { id: 2, name: "Course 2", description: "React for Beginners", duration: "6 weeks", teacher: "Prof. Johnson", fee: "$250", image: "path/to/image2.jpg" },
    { id: 3, name: "Course 3", description: "Data Science Basics", duration: "5 weeks", teacher: "Dr. Brown", fee: "$300", image: "path/to/image3.jpg" },
  ]);

  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    duration: "",
    teacher: "",
    fee: "",
    image: ""
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 2;
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.description || !newCourse.duration || !newCourse.teacher || !newCourse.fee || !newCourse.image) {
      setMessage({ text: "Please fill all fields.", type: "error" });
      return;
    }
  
    const course = {
      id: courses.length + 1,
      ...newCourse
    };
    setCourses([...courses, course]);
    setNewCourse({ name: "", description: "", duration: "", teacher: "", fee: "", image: "" });
    setMessage({ text: "Course added successfully!", type: "success" });
  
    // Refresh the page after a successful add
    reload();
  };

  const handleDeleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    setMessage({ text: "Course deleted successfully!", type: "success" });
  };

  const handleEditCourse = (course) => {
    setEditMode(true);
    setCourseToEdit(course);
    setNewCourse({ name: course.name, description: course.description, duration: course.duration, teacher: course.teacher, fee: course.fee, image: course.image });
  };

  const handleUpdateCourse = () => {
    const updatedCourses = courses.map(course =>
      course.id === courseToEdit.id ? { ...course, ...newCourse } : course
    );
    setCourses(updatedCourses);
    setEditMode(false);
    setNewCourse({ name: "", description: "", duration: "", teacher: "", fee: "", image: "" });
    setMessage({ text: "Course updated successfully!", type: "success" });
  
    // Refresh the page after a successful update
    location.reload();
  };

  const handlePrint = () => {
    window.print();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCourse({ ...newCourse, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination Logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="courses">
      <AdminPanel />
      <div className="courses-container">
        <h2 className="heading">Manage Courses</h2>

        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`}>
            <span className="icon">
              {message.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            </span>
            {message.text}
          </div>
        )}

        {/* Search Container */}
        <div className="search-container">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            /><button className="print-button" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
          </div>
        </div>

        {/* Add/Edit Course */}
        <div className="add-course">
          <h3><strong>{editMode ? "Edit Course" : "Add a New Course"}</strong></h3>
          <div className="input-group">
            <div className="input-column">
              <div className="input-field-container">
                <FaBook className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Course Name"
                  value={newCourse.name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="input-field-container">
                <FaInfoCircle className="input-icon" />
                <input
                  type="text"
                  name="description"
                  placeholder="Course Description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="input-field-container">
                <FaDollarSign className="input-icon" />
                <input
                  type="text"
                  name="fee"
                  placeholder="Course Fee"
                  value={newCourse.fee}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
            <div className="input-column">
              <div className="input-field-container">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="teacher"
                  placeholder="Teacher Name"
                  value={newCourse.teacher}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="input-field-container">
                <FaClock className="input-icon" />
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g., 6 weeks)"
                  value={newCourse.duration}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="input-field-container">
                <FaUpload className="input-icon" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-input"
                />
              </div>
            </div>
          </div>

          {editMode ? (
            <button onClick={handleUpdateCourse} className="update-btn"> <FaEdit/>Update</button>
          ) : (
            <button onClick={handleAddCourse} className="add-btn">< FaPlus/>Add</button>
          )}
          
        </div>

        {/* Course Table */}
        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Teacher</th>
                <th>Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.length > 0 ? (
                currentCourses.map((course) => (
                  <tr key={course.id}>
                    <td><img src={course.image} alt={course.name} className="course-image" /></td>
                    <td>{course.name}</td>
                    <td>{course.description}</td>
                    <td>{course.duration}</td>
                    <td>{course.teacher}</td>
                    <td>{course.fee}</td>
                    <td>
                      <div className="btn-group">
                        <button onClick={() => handleEditCourse(course)} className="edit-btn">
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="delete-btn">
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No courses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Page */}
        <div className="page">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
        <button
          key={page}
          className={`page-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
      </div>
    </div>
  );
};

export default Courses;
