import React from "react";
import './Profile.css'; // External CSS file
import AdminPanel from "./AdminPanel";

const Profile = () => {
  return (
    <div className="profile"> 
      <AdminPanel/>
      <div className="profile-container">
        <h2 className="heading">Profile</h2>
        <p className="text">User information goes here.</p>
      </div>
    </div>
  );
};

export default Profile;
