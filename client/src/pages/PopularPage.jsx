import React, { useState, useEffect } from "react";
import podcastService from "../services/podcastService";
import MiniPlayer from "../components/podcast/MiniPlayer";

const PopularPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularPodcasts = async () => {
      try {
        setLoading(true);
        // Get all podcasts and sort by listen count
        const response = await podcastService.getPodcasts({
          sort: '-listenCount',
          limit: 10 // Get more podcasts to ensure we have enough valid ones
        });

        // Filter and sort podcasts by listen count
        const sortedPodcasts = response.podcasts
          .filter(podcast => podcast.listenCount > 0) // Only include podcasts with listens
          .sort((a, b) => b.listenCount - a.listenCount) // Sort by listen count
          .slice(0, 3); // Get top 3

        setPodcasts(sortedPodcasts);
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
      <h1>Top 3 podcasts thịnh hành</h1>
      <div className="popular-grid">
        {podcasts.map((podcast, index) => (
          <div key={podcast._id} className="popular-item">
            <div className={`rank-badge rank-${index + 1}`}>#{index + 1}</div>
            <MiniPlayer podcast={podcast} />
            <div className="listen-count">
              <span className="listen-number">{podcast.listenCount.toLocaleString()}</span>
              <span className="listen-text">lượt nghe</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPage;