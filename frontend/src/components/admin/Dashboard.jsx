import React from "react";
import AdminPanel from "./AdminPanel";
import { FaUsers, FaBookOpen, FaChalkboardTeacher, FaChartLine, FaCalendarAlt, FaBell, FaCheckCircle, FaDollarSign, FaGraduationCap, FaChartPie, FaList, FaUser } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const courses = [
    { id: 1, name: "Intro to CS", students: 150, revenue: 15000 },
    { id: 2, name: "Adv. Math", students: 80, revenue: 12000 },
    { id: 3, name: "Eng. Lit", students: 100, revenue: 10000 },
    { id: 4, name: "Physics 101", students: 75, revenue: 9000 },
    { id: 5, name: "Web Dev", students: 120, revenue: 18000 },
  ];

  const recentActivities = [
    { id: 1, activity: "New student enrolled in 'Advanced Mathematics'" },
    { id: 2, activity: "Teacher 'John Doe' uploaded new course material" },
    { id: 3, activity: "Grade reports generated for 'Introduction to Physics'" },
    { id: 4, activity: "New announcement posted for all students" },
  ];

  const studentDemographics = {
    undergrad: 65,
    graduate: 25,
    phd: 10,
  };

  const quickAccessLinks = [
    { id: 1, name: "Add New Course", link: "/admin/courses/" },
    { id: 2, name: "Manage Teachers", link: "/admin/teachers" },
    { id: 3, name: "Student Directory", link: "/admin/students" },
    { id: 4, name: "System Settings", link: "/admin/settings" },
  ];

  // Find the maximum revenue for scaling
  const maxRevenue = Math.max(...courses.map(course => course.revenue));

  return (
    <div className="dashboard-container">
      <AdminPanel />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button className="btn-notification"><FaBell /></button>
            <img src="https://via.placeholder.com/40" alt="Admin" className="admin-avatar" />
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-card stat-card">
            <FaUsers className="card-icon" />
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-number">1234</p>
            </div>
          </div>

          <div className="dashboard-card stat-card">
            <FaChalkboardTeacher className="card-icon" />
            <div className="stat-content">
              <h3>Active Teachers</h3>
              <p className="stat-number">56</p>
            </div>
          </div>

          <div className="dashboard-card stat-card">
            <FaBookOpen className="card-icon" />
            <div className="stat-content">
              <h3>Total Courses</h3>
              <p className="stat-number">78</p>
            </div>
          </div>

          <div className="dashboard-card stat-card">
            <FaChartLine className="card-icon" />
            <div className="stat-content">
              <h3>New Enrollments</h3>
              <p className="stat-number">120 <span className="stat-change positive">+12%</span></p>
            </div>
          </div>

          <div className="dashboard-card stat-card">
            <FaDollarSign className="card-icon" />
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">$64000 <span className="stat-change positive">+8%</span></p>
            </div>
          </div>

          <div className="dashboard-card stat-card">
            <FaGraduationCap className="card-icon" />
            <div className="stat-content">
              <h3>Graduation Rate</h3>
              <p className="stat-number">92%</p>
            </div>
          </div>
          <div className="dashboard-card wide-card quick-access">
            <h3><FaList /> Quick Access</h3>
            <ul className="quick-access-links">
              {quickAccessLinks.map(link => (
                <li key={link.id}>
                  <a href={link.link}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="dashboard-card wide-card top-courses">
            <h3><FaBookOpen /> Top Courses</h3>
            <div className="top-courses-content">
              {courses.map(course => (
                <div key={course.id} className="course-row">
                  <div className="course-info">
                    <span className="course-name">{course.name}</span>
                    <div className="course-stats">
                      <span className="course-students"><FaUser /> {course.students}</span>
                      <span className="course-revenue"><FaDollarSign /> {course.revenue}</span>
                    </div>
                  </div>
                  <div className="course-bar-container">
                    <div 
                      className="course-bar" 
                      style={{width: `${(course.revenue / maxRevenue) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card wide-card recent-activity">
            <h3><FaList /> Recent Activity</h3>
            <ul>
              {recentActivities.map(activity => (
                <li key={activity.id}>{activity.activity}</li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card wide-card upcoming-events">
            <h3><FaCalendarAlt /> Upcoming Events</h3>
            <ul>
              <li><span className="event-date">May 15</span> End of Semester Exams</li>
              <li><span className="event-date">May 20</span> Teacher-Parent Meeting</li>
              <li><span className="event-date">June 1</span> Summer Course Registration Begins</li>
            </ul>
          </div>

          <div className="dashboard-card wide-card task-list">
            <h3><FaCheckCircle /> Tasks</h3>
            <ul>
              <li>Review new course proposals</li>
              <li>Prepare end-of-semester report</li>
              <li>Schedule staff meeting</li>
              <li>Update student handbook</li>
            </ul>
          </div>

          <div className="dashboard-card wide-card student-demographics">
            <h3><FaChartPie /> Student Demographics</h3>
            <div className="pie-chart">
              {/* You can replace this with an actual chart library */}
              <div className="pie-slice undergrad" style={{transform: `rotate(0deg) skew(${90 - (studentDemographics.undergrad * 3.6)}deg)`}}></div>
              <div className="pie-slice graduate" style={{transform: `rotate(${studentDemographics.undergrad * 3.6}deg) skew(${90 - (studentDemographics.graduate * 3.6)}deg)`}}></div>
              <div className="pie-slice phd" style={{transform: `rotate(${(studentDemographics.undergrad + studentDemographics.graduate) * 3.6}deg) skew(${90 - (studentDemographics.phd * 3.6)}deg)`}}></div>
            </div>
            <ul className="demographic-legend">
              <li><span className="legend-color undergrad"></span>Undergraduate: {studentDemographics.undergrad}%</li>
              <li><span className="legend-color graduate"></span>Graduate: {studentDemographics.graduate}%</li>
              <li><span className="legend-color phd"></span>PhD: {studentDemographics.phd}%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

