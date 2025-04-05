import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaPlay, FaPause } from "react-icons/fa";
import podcastService from "../../services/podcastService";
import { usePlayerContext } from "../../context/PlayerContext";

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { playPodcast, currentPodcast, isPlaying, togglePlay } = usePlayerContext();
  const searchTerm = searchParams.get('search');
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const searchTerm = searchParams.get('search');
        const data = await podcastService.getPodcasts({ search: searchTerm });
        setPodcasts(data.podcasts || []);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError("Failed to load podcasts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [searchParams]); // Add searchParams as dependency

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

  const handlePlayPodcast = async (podcast, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await podcastService.incrementListenCount(podcast._id);
      if (currentPodcast && currentPodcast._id === podcast._id) {
        togglePlay();
      }
      else {
        playPodcast(podcast, podcasts);
      }
    } catch (error) {
      console.error('Failed to update listen count:', error);
    }
  }; // Removed extra curly brace here

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">{error}</div>;


  return (
    <div className="podcast-list-container">
      <h1 className="page-title">
        {searchTerm ? `Search Results for "${searchTerm}"` : 'Danh Sách Podcasts'}
      </h1>

      {podcasts.length === 0 ? (
        <div className="no-podcasts">
          <p>
            {searchTerm 
              ? `No podcasts found for "${searchTerm}"`
              : 'No podcasts found. Check back later for new content!'}
          </p>
        </div>
      ) : (
        <div className="podcast-grid">
          {podcasts.map((podcast) => {
            const isCurrentlyPlaying =
              currentPodcast &&
              currentPodcast._id === podcast._id &&
              isPlaying;

            return (
              <Link
                to={`/podcasts/${podcast._id}`}
                key={podcast._id}
                className="podcast-card"
              >
                <div className="podcast-card-image-container">
                  <img
                    src={getImageUrl(podcast.coverImage)}
                    alt={podcast.title}
                    className="podcast-card-image"
                  />
                  <button
                    className={`podcast-play-button ${isCurrentlyPlaying ? 'playing' : ''}`}
                    onClick={(e) => handlePlayPodcast(podcast, e)}
                  >
                    {isCurrentlyPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <div className="podcast-listen-count">
                    <i className="bi bi-headphones"></i>
                    {podcast.listenCount || 0}
                  </div>
                </div>
                <div className="podcast-info">
                  <h3 className="podcast-title">{podcast.title}</h3>
                  <p className="podcast-author">
                    {podcast.author ? podcast.author.username : "Unknown Author"}
                  </p>
                </div>
                {podcast.category && (
                  <span className="podcast-card-category">{podcast.category.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PodcastList;
