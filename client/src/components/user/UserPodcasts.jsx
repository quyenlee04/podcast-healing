import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import podcastService from "../../services/podcastService";
import { toast } from "react-toastify";

const UserPodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserPodcasts = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = JSON.parse(userData);
      const response = await podcastService.getPodcastsByAuthor(currentUser._id);
      setPodcasts(response.podcasts || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Không thể tải podcast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserPodcasts();
  }, []);

  const handleDelete = async (podcastId) => {
    if (window.confirm("Are you sure you want to delete this podcast?")) {
      try {
        await podcastService.deletePodcast(podcastId);
        toast.success("Podcast deleted successfully");
        fetchUserPodcasts();
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          toast.error("Failed to delete podcast");
        }
      }
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="user-podcasts">
      <div className="user-podcasts-header">
        <h2>My Uploads</h2>
        <Link to="/upload" className="upload-button">
          Upload New Podcast
        </Link>
      </div>

      {podcasts.length === 0 ? (
        <div className="no-podcasts">
          <p>You haven't uploaded any podcasts yet.</p>
          <Link to="/upload" className="upload-link">
            Upload your first podcast
          </Link>
        </div>
      ) : (
        <div className="podcasts-grid">
          {podcasts.map((podcast) => (
            <div key={podcast._id} className="podcast-card">
              <img
                src={podcast.coverImage?.startsWith('http') 
                  ? podcast.coverImage 
                  : `http://localhost:5000${podcast.coverImage}`}
                alt={podcast.title}
                className="podcast-cover"
              />
              <div className="podcast-info">
                <h3>{podcast.title}</h3>
                <p className="listen-count">
                  <i className="bi bi-headphones"></i> {podcast.listenCount || 0} listens
                </p>
                <div className="podcast-actions">
                  <Link 
                    to={`/podcasts/${podcast._id}`} 
                    className="view-button"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/edit-podcast/${podcast._id}`} 
                    className="edit-button"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(podcast._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPodcasts;