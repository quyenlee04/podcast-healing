import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/global.css";
import podcastService from "../../services/podcastService";

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        // Use podcastService instead of direct axios call
        const data = await podcastService.getPodcasts();
        setPodcasts(data.podcasts || []);
        console.log("Podcasts data:", data.podcasts); // Debug log
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError("Failed to load podcasts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  // Helper function to format image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "/images/default-cover.jpg";
    }

    // If the path already includes http, it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Otherwise, prepend the server URL
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="podcast-list-container">
      <h1 className="page-title">Discover Podcasts</h1>

      {podcasts.length > 0 ? (
        <div className="podcast-grid">
          {podcasts.map((podcast) => (
            <Link to={`/podcasts/${podcast._id}`} key={podcast._id} className="podcast-card">
              <div className="podcast-card-image">
                <img
                  src={getImageUrl(podcast.coverImage)}
                  alt={podcast.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-cover.jpg";
                  }}
                />
              </div>
              <div className="podcast-card-content">
                <h3 className="podcast-card-title">{podcast.title}</h3>
                <p className="podcast-card-description">{podcast.description.substring(0, 100)}...</p>
                <div className="podcast-card-meta">
                  {podcast.category && <span className="podcast-card-category">{podcast.category.name}</span>}
                  <span className="podcast-card-date">{new Date(podcast.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-podcasts">
          <p>No podcasts available.</p>
          <Link to="/upload" className="btn-primary">Upload a Podcast</Link>
        </div>
      )}
    </div>
  );
};

export default PodcastList;
