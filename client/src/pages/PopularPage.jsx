import React, { useState, useEffect } from "react";
import podcastService from "../services/podcastService";
import MiniPlayer from "../components/podcast/MiniPlayer";
import "../styles/PopularPage.css";

const PopularPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularPodcasts = async () => {
      try {
        setLoading(true);
        const response = await podcastService.getPodcasts({ 
          sort: '-listenCount',
          limit: 3 // Limit to top 3 podcasts
        });
        setPodcasts(response.podcasts || []);
      } catch (err) {
        console.error('Error fetching popular podcasts:', err);
        setError('Failed to load popular podcasts');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPodcasts();
  }, []);

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="popular-page">
      <h1>Top 3 Popular Podcasts</h1>
      <div className="popular-grid">
        {podcasts.map((podcast, index) => (
          <div key={podcast._id} className="popular-item">
            <div className={`rank-badge rank-${index + 1}`}>#{index + 1}</div>
            <MiniPlayer podcast={podcast} />
            <div className="listen-count">
              {podcast.listenCount || 0} listens
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPage;