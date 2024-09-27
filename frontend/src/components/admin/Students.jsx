import React from "react";
import './Students.css'; // External CSS file
import AdminPanel from "./AdminPanel";

const Students = () => {
  return (
    
    <div className="students">
      <AdminPanel/>
      <div className="students-container">
        <h2 className="heading">Manage Students</h2>
        <ul className="list">
          <li className="list-item">Student 1</li>
          <li className="list-item">Student 2</li>
        </ul>
      </div>
    </div>
  );
};

export default Students;
