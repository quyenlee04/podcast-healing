import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaBars } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";


const Header = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/podcasts?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
    return (
        <header className="header">
            <div className="header-center">
                <Link to="/" className="header-logo-link">
                    <img src="/logo.png" alt="Logo" className="header-logo" />
                </Link>

                
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Tìm kiếm podcast..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">
                                <FaSearch />
                            </button>
                        </div>
                    </form>
                </div>
            

            <nav className="nav-links">
                {user && user.role === 'admin' && (
                    <Link to="/admin" className="admin-link">
                        Admin Dashboard
                    </Link>
                )}

                {user ? (
                    <div className="user-nav">
                        <Link to="/profile" className="user-profile-link">
                            <FaUser />
                            <span>{user.username}</span>
                        </Link>
                        <button onClick={logout} className="btn-primary">
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn-primary">
                        Đăng nhập
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
