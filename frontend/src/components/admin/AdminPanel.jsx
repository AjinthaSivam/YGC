import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Courses from "./Courses";  // Adjusted the path
import Books from "./Books";      // Adjusted the path
import Teachers from "./Teachers"; // Adjusted the path
import Students from "./Students"; // Adjusted the path
import Settings from "./Settings"; // Adjusted the path
import Profile from "./Profile";   // Adjusted the path
import Dashboard from "./Dashboard";
import './AdminPanel.css'; // External CSS file

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <nav className="sidebar">
        <ul className="sidebar-list">
          <li><Link to="dashboard" className="link">Dashboard</Link></li>
          <li><Link to="courses" className="link">Courses</Link></li>
          <li><Link to="books" className="link">Books</Link></li>
          <li><Link to="teachers" className="link">Teachers</Link></li>
          <li><Link to="students" className="link">Students</Link></li>
          <li><Link to="settings" className="link">Settings</Link></li>
          <li><Link to="profile" className="link">Profile</Link></li>
        </ul>
      </nav>
      <div className="content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="courses" element={<Courses />} />
          <Route path="books" element={<Books />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
