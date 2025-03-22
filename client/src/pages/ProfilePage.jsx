import React, { useState } from "react";
import Profile from "../components/user/Profile";
import Favorites from "../components/user/Favorites";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="profile-page">
      <h1>My Account</h1>
      
      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button 
          className={activeTab === "favorites" ? "active" : ""}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites
        </button>
      </div>

      {/* Nội dung thay đổi theo tab */}
      <div className="tab-content">
        {activeTab === "profile" && <Profile />}
        {activeTab === "favorites" && <Favorites />}
      </div>
    </div>
  );
};

export default ProfilePage;
