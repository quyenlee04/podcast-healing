import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.info(
      <div>
        <p>Please log in to access this feature</p>
        <div className="mt-2">
          <a 
            href="/login" 
            className="btn btn-primary btn-sm me-2"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/login?redirect=${location.pathname}`;
            }}
          >
            Login
          </a>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              toast.dismiss();
              window.history.back();
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        position: "top-center",
        className: "login-prompt-toast"
      }
    );
    return null;
  }

  return children;
};

export default PrivateRoute;