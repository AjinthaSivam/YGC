import React, { useState } from "react";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaUsers, FaBook, FaChalkboardTeacher, FaCog, FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import Courses from "./Courses";
import Books from "./Books";
import Teachers from "./Teachers";
import Students from "./Students";
import Settings from "./Settings";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import './AdminPanel.css';

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Perform logout actions here
      navigate("/admin/login");
    }
  };

  const menuItems = [
    { path: "dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "books", icon: FaBook, label: "Books" },
    { path: "courses", icon: FaChalkboardTeacher, label: "Courses" },
    { path: "students", icon: FaUsers, label: "Students" },
    { path: "teachers", icon: FaChalkboardTeacher, label: "Teachers" },
    { path: "settings", icon: FaCog, label: "Settings" },
    { path: "profile", icon: FaUser, label: "Profile" },
  ];

  return (
    <div className="admin-panel">
      <nav className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          {isSidebarOpen && <h1>Admin</h1>}
        </div>
        <ul className="sidebar-list">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link 
                to={`/admin/${path}`} 
                className={`link ${location.pathname === `/admin/${path}` ? 'active' : ''}`} 
                title={label}
              >
                <Icon className="sidebar-icon" />
                {isSidebarOpen && <span>{label}</span>}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={handleLogout} className="link logout-button" title="Logout">
              <FaSignOutAlt className="sidebar-icon" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </nav>

      <div className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
