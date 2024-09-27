import React, { useState } from "react";
import './Teachers.css'; // External CSS file
import AdminPanel from "./AdminPanel";
import { FaEdit, FaTrashAlt, FaPrint } from "react-icons/fa"; // Importing icons

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 3; // Number of teachers to display per page

  const teachers = [
    { id: 1, teacherId: "T001", name: "Teacher 1", subject: "Mathematics", experience: "5 years", salary: "$50,000", imageUrl: "https://via.placeholder.com/50" },
    { id: 2, teacherId: "T002", name: "Teacher 2", subject: "Science", experience: "3 years", salary: "$48,000", imageUrl: "https://via.placeholder.com/50" },
    { id: 3, teacherId: "T003", name: "Teacher 3", subject: "English", experience: "4 years", salary: "$52,000", imageUrl: "https://via.placeholder.com/50" },
    { id: 4, teacherId: "T004", name: "Teacher 4", subject: "History", experience: "6 years", salary: "$55,000", imageUrl: "https://via.placeholder.com/50" },
    { id: 5, teacherId: "T005", name: "Teacher 5", subject: "Art", experience: "2 years", salary: "$40,000", imageUrl: "https://via.placeholder.com/50" },
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="teachers">
      <AdminPanel />
      <div className="teachers-container">
        <h2 className="heading">Manage Teachers</h2>
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
        <button className="add-teacher-button">Add Teacher</button>
        <table className="teachers-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Teacher ID</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length > 0 ? (
              currentTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td><img src={teacher.imageUrl} alt={teacher.name} className="teacher-image" /></td>
                  <td>{teacher.teacherId}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.experience}</td>
                  <td>{teacher.salary}</td>
                  <td>
                    <button className="edit-button"><FaEdit /></button>
                    <button className="remove-button"><FaTrashAlt /></button>
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
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
