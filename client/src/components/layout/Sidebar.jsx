import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFire, FaHeart, FaUser, FaCloudUploadAlt, FaSignInAlt, FaPodcast, FaBars } from "react-icons/fa";
import "../../styles/Sidebar.css";

const Sidebar = ({ isOpen, onToggle }) => {

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={onToggle}>
          <FaBars />
        </button>
      </div>

      <ul className="sidebar-menu">
      <li>
          <Link to="/">
            <FaHome className="icon" />
            {isOpen && <span className="text">Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/admin/dashboard">
            <FaFire className="icon" />
            {isOpen && <span className="text">Popular</span>}
          </Link>
        </li>
        <li>
          <Link to="/favorites">
            <FaHeart className="icon" />
            {isOpen && <span className="text">Favorites</span>}
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <FaUser className="icon" />
            {isOpen && <span className="text">Profile</span>}
          </Link>
        </li>
        <li>
          <Link to="/upload">
            <FaCloudUploadAlt className="icon" />
            {isOpen && <span className="text">Upload</span>}
          </Link>
        </li>
        <li>
          <Link to="/login">
            <FaSignInAlt className="icon" />
            {isOpen && <span className="text">Login</span>}
          </Link>
        </li>
        <li>
          <Link to="/podcasts">
            <FaPodcast className="icon" />
            {isOpen && <span className="text">Podcast</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
