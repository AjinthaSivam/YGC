import React from "react";
import './Profile.css'; // External CSS file

const Profile = () => {
  return (
    <><AdminPanel/>
    <div className="profile-container">
      <h2 className="heading">Profile</h2>
      <p className="text">User information goes here.</p>
    </div></>
  );
};

export default Profile;
