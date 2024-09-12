import React from "react";
import './Courses.css'; // External CSS file

const Courses = () => {
  return (
    <div className="courses-container">
      <h2 className="heading">Manage Courses</h2>
      <ul className="list">
        <li className="list-item">Course 1</li>
        <li className="list-item">Course 2</li>
      </ul>
    </div>
  );
};

export default Courses;
