import React from "react";
import './Courses.css'; // External CSS file
import './AdminPanel';

const Courses = () => {
  return (
    <div className="courses-container">
      <AdminPanel />
      <h2 className="heading">Manage Courses</h2>
      <ul className="list">
        <li className="list-item">Course 1</li>
        <li className="list-item">Course 2</li>
      </ul>
    </div>
  );
};

export default Courses;
