import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaBars } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Header.css";

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="header">
            
            <div className="sidebar-toggle">
                <button onClick={toggleSidebar} className="toggle-button">
                    <FaBars />
                </button>
            </div>
            
            {/* Logo và Search Bar ở giữa */}
            <div className="header-center">
                {/* Logo */}
                <Link to="/" className="logo-link">
                    <img src="/logo.png" alt="Logo" className="logo-img" />
                </Link>

                {/* Search Bar */}
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Bạn muốn phát nội dung gì?" />
                </div>
            </div>

            {/* Navigation links */}
            <nav className="header-right">
                {user && user.role === 'admin' && (
                    <Link to="/admin" className="admin-link">
                        Admin Dashboard
                    </Link>
                )}
                
                {user ? (
                    <div className="user-menu">
                        <Link to="/profile" className="user-profile">
                            <FaUser className="user-icon" />
                            <span>{user.username}</span>
                        </Link>
                        <button onClick={logout} className="logout-btn">Đăng xuất</button>
                    </div>
                ) : (
                    <Link to="/login">Đăng nhập</Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
