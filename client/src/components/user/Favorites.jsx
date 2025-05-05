import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import podcastService from "../../services/podcastService";

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await podcastService.getLikedPodcasts();
        setFavorites(response.podcasts || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  // Add this helper function
  const getFullUrl = (path) => {
    if (!path) return "/images/default-cover.jpg";
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="favorites-container">
      <h2>Podcasts yêu thích của bạn</h2>
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((podcast) => (
            <Link 
              to={`/podcasts/${podcast._id}`} 
              key={podcast._id} 
              className="favorite-item"
            >
              <img 
                src={getFullUrl(podcast.coverImage)} 
                alt={podcast.title} 
              />
              <h3>{podcast.title}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-favorites">
          <p>You haven't liked any podcasts yet.</p>
          <Link to="/" className="browse-link">Browse Podcasts</Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
