import React, { useState } from "react";
import UserManagement from "./UserManagement";
import PodcastManagement from "./PodcastManagement";
import CategoryManagement from "./CategoryManagement";

import { Link } from "react-router-dom";
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container-fluid admin-dashboard p-0">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-2 admin-sidebar">
          <h3 className="text-white mb-4 fw-bold">
            <i className="bi bi-soundwave me-2"></i>
            Admin Panel
          </h3>
          <div className="nav flex-column">
            <Link to="/" className="nav-link d-flex align-items-center mb-3">
              <i className="bi bi-arrow-left-circle me-3"></i>
              Back to App
            </Link>
            <button 
              className={`nav-link d-flex align-items-center ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people me-3"></i>
              Users
            </button>
            <button 
              className={`nav-link d-flex align-items-center ${activeTab === 'podcasts' ? 'active' : ''}`}
              onClick={() => setActiveTab('podcasts')}
            >
              <i className="bi bi-mic-fill me-3"></i>
              Podcasts
            </button>
            <button 
              className={`nav-link d-flex align-items-center ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <i className="bi bi-folder me-3"></i>
              Categories
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-10 admin-main">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'podcasts' && <PodcastManagement />}
              {activeTab === 'categories' && <CategoryManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;