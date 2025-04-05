import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaFire, FaHeart, FaUser, FaCloudUploadAlt, FaPodcast, FaListUl } from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className={isActive("/") ? "active" : ""}>
            <FaHome className="icon" />
            <span className="text">Trang chủ</span>
          </Link>
        </li>
        <li>
          <Link to="/podcasts" className={isActive("/podcasts") ? "active" : ""}>
            <FaPodcast className="icon" />
            <span className="text">Podcasts</span>
          </Link>
        </li>
        <li>
          <Link to="/popular" className={isActive("/popular") ? "active" : ""}>
            <FaFire className="icon" />
            <span className="text">Thịnh hành</span>
          </Link>
        </li>
        <li>
          <Link to="/favorites" className={isActive("/favorites") ? "active" : ""}>
            <FaHeart className="icon" />
            <span className="text">Yêu thích</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
            <FaUser className="icon" />
            <span className="text">Hồ sơ</span>
          </Link>
        </li>
        <li>
          <Link to="/categories" className={isActive("/categories") ? "active" : ""}>
            <FaListUl className="icon" />
            <span className="text">Thể loại</span>
          </Link>
        </li>
        <li>
          <Link to="/upload" className={isActive("/upload") ? "active" : ""}>
            <FaCloudUploadAlt className="icon" />
            <span className="text">Tải lên</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
