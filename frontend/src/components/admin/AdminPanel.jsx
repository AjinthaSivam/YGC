import React from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Courses from "./Courses";
import Books from "./Books";
import Teachers from "./Teachers";
import Students from "./Students";
import Settings from "./Settings";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import './AdminPanel.css';

const AdminPanel = () => {
  const location = useLocation();

  return (
    <div className="admin-panel">
      <nav className="sidebar">
        <h1 className="sidebar-header">Admin Panel</h1>
        <ul className="sidebar-list">
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/books">Books</a></li>
          <li><a href="/admin/courses">Courses</a></li>  
          <li><a href="/admin/students">Students</a></li>
          <li><a href="/admin/teachers">Teachers</a></li>
          <li><a href="/admin/settings">Settings</a></li>
          <li><a href="/admin/profile">Profile</a></li>
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
