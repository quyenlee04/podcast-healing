import React, { useState } from "react";
import Profile from "../components/user/Profile";
import MyPodcasts from "../components/user/Favorites";
import UserPodcasts from "../components/user/UserPodcasts"; 
import '../styles/pages/profilePage.css';// Add this import


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="profile-page">
      <h1>Tài khoản của tôi</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Thông tin cá nhân
        </button>
        <button 
          className={activeTab === "uploads" ? "active" : ""}
          onClick={() => setActiveTab("uploads")}
        >
          Bài đăng của bạn
        </button>
       
      </div>

      <div className="tab-content">
        {activeTab === "profile" && <Profile />}
        {activeTab === "uploads" && <UserPodcasts />}
      
      </div>
    </div>
  );
};

export default ProfilePage;
