import React from "react";
import './Students.css'; // External CSS file

const Students = () => {
  return (
    
    <><AdminPanel/>
    <div className="students-container">
      <h2 className="heading">Manage Students</h2>
      <ul className="list">
        <li className="list-item">Student 1</li>
        <li className="list-item">Student 2</li>
      </ul>
    </div></>
  );
};

export default Students;
