import React from "react";
import './Books.css'; // External CSS file

const Books = () => {
  return (
    <div className="books-container">
      <h2 className="heading">Manage Books</h2>
      <ul className="list">
        <li className="list-item">Book 1</li>
        <li className="list-item">Book 2</li>
      </ul>
    </div>
  );
};

export default Books;
