import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import authService from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password
      });
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Đăng nhập thành công!');
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn.");
      toast.error(err.message || "Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn.");
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
            value={formData.email}
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
            value={formData.password}
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
        {/* <p className="forgot-password">
          <Link to="/reset-password">Quên mật khẩu?</Link>
        </p> */}
      </form>
    </div>
  );
};

export default Login;
