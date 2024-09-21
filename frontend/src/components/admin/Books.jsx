import React from "react";
import './Books.css'; // External CSS file
import AdminPanel from "./AdminPanel";

const Books = () => {
  return (
    
    <div className="books-container">
      <AdminPanel/>
      <h2 className="heading">Manage Books</h2>
      <ul className="list">
        <li className="list-item">Book 1</li>
        <li className="list-item">Book 2</li>
      </ul>
    </div>
  );
};

export default Books;
