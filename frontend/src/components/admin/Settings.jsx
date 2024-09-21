import React, { useState } from "react";
import './Settings.css'; // External CSS file

const Settings = () => {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    
    <><AdminPanel/>
    <div className="settings-container">
      <h2 className="heading">Settings</h2>
      <label className="label">
        Theme:
        <select value={theme} onChange={handleThemeChange} className="select">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div></>
  );
};

export default Settings;
