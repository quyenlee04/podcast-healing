import React, { useState } from "react";
import Profile from "../components/user/Profile";
import MyPodcasts from "../components/user/Favorites";
import UserPodcasts from "../components/user/UserPodcasts"; // Add this import
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="profile-page">
      <h1>My Account</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button 
          className={activeTab === "uploads" ? "active" : ""}
          onClick={() => setActiveTab("uploads")}
        >
          My Uploads
        </button>
        <button 
          className={activeTab === "favorites" ? "active" : ""}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "profile" && <Profile />}
        {activeTab === "uploads" && <UserPodcasts />}
        {activeTab === "favorites" && <MyPodcasts />}
      </div>
    </div>
  );
};

export default ProfilePage;
