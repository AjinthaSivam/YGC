import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import './Login.css'; // Import external CSS for styling

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    if (username === "admin" && password === "admin") {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 >Welcome Back 👋</h2>
        <p className="admin-subtitle">Please log in to your admin account</p>
        <div className="admin-login-form">
          <div className="admin-input-group">
            <FaUser className="admin-icon" />
            <input className="admin-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="admin-input-group">
            <FaLock className="admin-icon" />
            <input className="admin-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {error && <p className="admin-error-message">{error}</p>}
          <button className="admin-button" onClick={handleLogin}>
            <FaSignInAlt className="admin-button-icon" />
            Login
          </button>
          <a href="/forgot-password" className="admin-forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
