import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/layout/Sidebar";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import Favorites from "./components/user/Favorites";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ResetPassword from "./components/auth/ResetPassword";
import PodcastList from "./components/podcast/PodcastList";
import PodcastDetail from "./components/podcast/PodcastDetail";
import UploadPodcast from "./components/podcast/UploadPodcast";
import Dashboard from "./components/admin/Dashboard";
import UserManagement from "./components/admin/UserManagement";
import PodcastManagement from "./components/admin/PodcastManagement";
import Statistics from "./components/admin/Statistics";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Quản lý trạng thái Sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Đảo trạng thái mở/đóng Sidebar
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`app-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Header />
          <div className="main-content">
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            <div className="content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/podcasts" element={<PodcastList />} />
                <Route path="/podcasts/:id" element={<PodcastDetail />} />
                <Route path="/upload" element={<UploadPodcast />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/podcasts" element={<PodcastManagement />} />
                <Route path="/admin/statistics" element={<Statistics />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
