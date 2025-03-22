import React from "react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="page-container">
      <h1>Admin Panel</h1>
      <Link to="/admin/users">Manage Users</Link>
      <Link to="/admin/podcasts">Manage Podcasts</Link>
      <Link to="/admin/statistics">View Statistics</Link>
    </div>
  );
};

export default AdminPage;
