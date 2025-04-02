import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFire, FaHeart, FaUser, FaCloudUploadAlt, FaSignInAlt, FaPodcast, FaBars } from "react-icons/fa";
import "../../styles/Sidebar.css";

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      

      <ul className="sidebar-menu">
        <li>
          <Link to="/">
            <FaHome className="icon" />
            <span className="text">Home</span>
          </Link>
        </li>
        <li>
          <Link to="/podcasts">
            <FaPodcast className="icon" />
            <span className="text">Podcasts</span>
          </Link>
        </li>
        <li>
          <Link to="/popular">
            <FaFire className="icon" />
            <span className="text">Popular</span>
          </Link>
        </li>
        <li>
          <Link to="/favorites">
            <FaHeart className="icon" />
            <span className="text">Favorites</span>
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <FaUser className="icon" />
            <span className="text">Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/upload">
            <FaCloudUploadAlt className="icon" />
            <span className="text">Upload</span>
          </Link>
        </li>
      
      </ul>
    </div>
  );
};

export default Sidebar;
