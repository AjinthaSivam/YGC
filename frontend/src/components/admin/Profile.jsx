import React, { useState } from 'react';
import './Profile.css';
import AdminPanel from './AdminPanel';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaCalendar, FaMapMarkerAlt, FaLanguage, FaGraduationCap, FaBriefcase } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    role: 'Administrator',
    avatar: 'https://via.placeholder.com/150',
    dateOfBirth: '1990-01-01',
    address: '123 Main St, Anytown, USA',
    languages: ['English', 'Spanish'],
    education: [
      { degree: 'Bachelor of Science in Computer Science', institution: 'University of Technology', year: '2012' },
      { degree: 'Master of Business Administration', institution: 'Business School', year: '2015' }
    ],
    experience: [
      { position: 'Senior Developer', company: 'Tech Solutions Inc.', period: '2015 - Present' },
      { position: 'Junior Developer', company: 'StartUp Co.', period: '2012 - 2015' }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = () => {
    setUser({ ...editedUser });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile">
      <AdminPanel />
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-header">
            <div className="avatar-section">
              <img src={user.avatar} alt="User Avatar" className="avatar" />
              {isEditing && (
                <div className="avatar-upload">
                  <label htmlFor="avatar-input" className="avatar-upload-label">
                    <FaEdit /> Change Avatar
                  </label>
                  <input
                    type="file"
                    id="avatar-input"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                  />
                </div>
              )}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.role}</p>
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-section">
              <h4>Personal Information</h4>
              <div className="detail-item">
                <FaUser className="icon" />
                <span>Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{user.name}</span>
                )}
              </div>
              <div className="detail-item">
                <FaEnvelope className="icon" />
                <span>Email:</span>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{user.email}</span>
                )}
              </div>
              <div className="detail-item">
                <FaPhone className="icon" />
                <span>Phone:</span>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{user.phone}</span>
                )}
              </div>
              <div className="detail-item">
                <FaCalendar className="icon" />
                <span>Date of Birth:</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editedUser.dateOfBirth}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{user.dateOfBirth}</span>
                )}
              </div>
              <div className="detail-item">
                <FaMapMarkerAlt className="icon" />
                <span>Address:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedUser.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{user.address}</span>
                )}
              </div>
            </div>
            <div className="detail-section">
              <h4>Additional Information</h4>
              <div className="detail-item">
                <FaLock className="icon" />
                <span>Role:</span>
                <span>{user.role}</span>
              </div>
              <div className="detail-item">
                <FaLanguage className="icon" />
                <span>Languages:</span>
                <span>{user.languages.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                <FaSave /> Save Changes
              </button>
              <button className="cancel-btn" onClick={handleEditToggle}>
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={handleEditToggle}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;