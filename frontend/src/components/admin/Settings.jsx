import React, { useState } from "react";
import './Settings.css'; // External CSS file
import AdminPanel from "./AdminPanel";
import { FaPalette, FaBell, FaLanguage, FaLock, FaUserShield, FaSave } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    language: "english",
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisibility: "public",
      activityLog: true
    },
    security: {
      twoFactor: false,
      loginAlerts: true
    }
  });

  const handleChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically send the settings to your backend
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings">
      <AdminPanel />
      <div className="settings-container">
        <h2 className="heading">Settings</h2>
        
        <section className="settings-section">
          <h3><FaPalette /> Appearance</h3>
          <div className="setting-item">
            <label>
              Theme:
              <select 
                value={settings.theme} 
                onChange={(e) => setSettings({...settings, theme: e.target.value})}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3><FaLanguage /> Language</h3>
          <div className="setting-item">
            <label>
              Preferred Language:
              <select 
                value={settings.language} 
                onChange={(e) => setSettings({...settings, language: e.target.value})}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3><FaBell /> Notifications</h3>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.notifications.email} 
                onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
              />
              Email Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.notifications.push} 
                onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
              />
              Push Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.notifications.sms} 
                onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
              />
              SMS Notifications
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3><FaUserShield /> Privacy</h3>
          <div className="setting-item">
            <label>
              Profile Visibility:
              <select 
                value={settings.privacy.profileVisibility} 
                onChange={(e) => handleChange('privacy', 'profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.privacy.activityLog} 
                onChange={(e) => handleChange('privacy', 'activityLog', e.target.checked)}
              />
              Enable Activity Log
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3><FaLock /> Security</h3>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.security.twoFactor} 
                onChange={(e) => handleChange('security', 'twoFactor', e.target.checked)}
              />
              Enable Two-Factor Authentication
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.security.loginAlerts} 
                onChange={(e) => handleChange('security', 'loginAlerts', e.target.checked)}
              />
              Receive Login Alerts
            </label>
          </div>
        </section>

        <button className="save-button" onClick={handleSave}>
          <FaSave /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
