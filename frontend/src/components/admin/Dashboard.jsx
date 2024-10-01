import React from "react";
import AdminPanel from "./AdminPanel";
import { FaUsers, FaBookOpen, FaChalkboardTeacher, FaChartLine, FaClipboardList, FaTasks } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <AdminPanel />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="intro-text">Welcome to your dashboard! Track performance metrics and activities of the institute easily.</p>
        </header>

        <section className="metrics-section">
          <h3 className="metrics-title">Key Metrics</h3>
          <div className="metrics">
            <div className="metric card">
              <div className="metric-icon"><FaUsers size={50} /></div>
              <div className="metric-details">
                <h3>Total Students</h3>
                <p className="metric-value">1,200</p>
              </div>
            </div>
            <div className="metric card">
              <div className="metric-icon"><FaBookOpen size={50} /></div>
              <div className="metric-details">
                <h3>Total Courses</h3>
                <p className="metric-value">45</p>
              </div>
            </div>
            <div className="metric card">
              <div className="metric-icon"><FaChalkboardTeacher size={50} /></div>
              <div className="metric-details">
                <h3>Active Teachers</h3>
                <p className="metric-value">30</p>
              </div>
            </div>
            <div className="metric card">
              <div className="metric-icon"><FaChartLine size={50} /></div>
              <div className="metric-details">
                <h3>Enrollments</h3>
                <p className="metric-value">150</p>
              </div>
            </div>
            <div className="metric card">
              <div className="metric-icon"><FaClipboardList size={50} /></div>
              <div className="metric-details">
                <h3>Average Grades</h3>
                <p className="metric-value">85%</p>
              </div>
            </div>
            <div className="metric card">
              <div className="metric-icon"><FaTasks size={50} /></div>
              <div className="metric-details">
                <h3>Completion</h3>
                <p className="metric-value">92%</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
