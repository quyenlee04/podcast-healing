import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import AdminRoute from "./components/auth/AdminRoute";
import PrivateRoute from "./components/auth/PrivateRoute";
import UploadPodcast from './components/podcast/UploadPodcast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PopularPage from './pages/PopularPage';
// Admin Components
import Dashboard from "./components/admin/Dashboard";

// Client Components
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import GlobalPlayer from "./components/player/GlobalPlayer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ResetPassword from "./components/auth/ResetPassword";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import PodcastDetail from "./components/podcast/PodcastDetail";
import PodcastList from "./components/podcast/PodcastList";

// Layouts
const AdminLayout = ({ children }) => {
  return <div className="admin-layout">{children}</div>;
};

const ClientLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </main>
      <GlobalPlayer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      {/* Add other admin routes here */}
                    </Routes>
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* Auth Routes (No Layout) */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} /> */}

            {/* Client Routes */}
            <Route
              path="/*"
              element={
                <ClientLayout>
                  <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="explore" element={<ExplorePage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/podcasts" element={<PodcastList />} />
                    <Route path="/podcasts/:id" element={<PodcastDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/upload" element={
                      <PrivateRoute>
                        <UploadPodcast />
                      </PrivateRoute>
                    } />
                    <Route path="/popular" element={<PopularPage />} />
                    
                  </Routes>
                </ClientLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;
