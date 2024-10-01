import React, { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Courses from "./Courses";
import Books from "./Books";
import Teachers from "./Teachers";
import Students from "./Students";
import Settings from "./Settings";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import { FaBars, FaUsers, FaBook, FaChalkboardTeacher, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import './AdminPanel.css';

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar
  };

  return (
    <div className="admin-panel">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <nav className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <h1 className="sidebar-header">Admin</h1>
        <ul className="sidebar-list">
          <li>
            <Link to="/admin/dashboard" className="link">
              <FaUsers /> {isSidebarOpen && 'Dashboard'}
            </Link>
          </li>
          <li>
            <Link to="/admin/books" className="link">
              <FaBook /> {isSidebarOpen && 'Books'}
            </Link>
          </li>
          <li>
            <Link to="/admin/courses" className="link">
              <FaChalkboardTeacher /> {isSidebarOpen && 'Courses'}
            </Link>
          </li>
          <li>
            <Link to="/admin/students" className="link">
              <FaUsers /> {isSidebarOpen && 'Students'}
            </Link>
          </li>
          <li>
            <Link to="/admin/teachers" className="link">
              <FaChalkboardTeacher /> {isSidebarOpen && 'Teachers'}
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className="link">
              <FaCog /> {isSidebarOpen && 'Settings'}
            </Link>
          </li>
          <li>
            <Link to="/admin/profile" className="link">
              <FaUser /> {isSidebarOpen && 'Profile'}
            </Link>
          </li>
          <li>
            <Link to="#" className="link">
              <FaSignOutAlt /> {isSidebarOpen && 'Logout'}
            </Link>
          </li>
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
