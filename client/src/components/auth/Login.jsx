import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import authService from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-container">
          <img src="/logo.png" alt="PodCast-Healing" className="logo" />
        </div>
        <h2>Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng Nhập"}
        </button>

        <p className="register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
        <p className="forgot-password">
          <Link to="/reset-password">Quên mật khẩu?</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
