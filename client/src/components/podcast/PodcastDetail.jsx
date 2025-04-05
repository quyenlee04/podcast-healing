import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import podcastService from "../../services/podcastService";
import { usePlayerContext } from "../../context/PlayerContext";
import PodcastPlayer from "./PodcastPlayer";
import Comments from './Comments';

import LikeButton from '../common/LikeButton';
import { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const PodcastDetail = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // Add this line
  const [relatedPodcasts, setRelatedPodcasts] = useState([]);
  const { playPodcast, currentPodcast, isPlaying, togglePlay } = usePlayerContext();
  const listenTracking = useRef();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true);
        const data = await podcastService.getPodcastById(id);
        setPodcast(data);
        // Check if the current user has liked this podcast
        if (user && data.likes) {
          setIsLiked(data.likes.includes(user._id));
        }

        if (!currentPodcast || currentPodcast._id !== data._id) {
          fetchRelatedPodcasts(data);
        }
      } catch (err) {
        console.error("Error fetching podcast:", err);
        setError("Failed to load podcast. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id, user]); // Add user to dependency array

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await podcastService.toggleLike(podcast._id);
      setIsLiked(response.liked);

      // Update podcast likes count
      setPodcast(prev => ({
        ...prev,
        likes: response.liked
          ? [...(prev.likes || []), user._id]
          : (prev.likes || []).filter(id => id !== user._id)
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Helper function to format URLs
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const fetchRelatedPodcasts = async (podcastData) => {
    if (podcastData && podcastData.category) {
      try {
        // Get podcasts in the same category
        const data = await podcastService.getPodcasts({
          category: podcastData.category._id
        });

        const related = data.podcasts.filter(p => p._id !== podcastData._id);
        setRelatedPodcasts(related);
      } catch (err) {
        console.error("Error fetching related podcasts:", err);
      }
    }
  };

  const handlePlayPodcast = async () => {
    try {
      // Increment listen count when playing
      await podcastService.incrementListenCount(podcast._id);

      if (currentPodcast && currentPodcast._id === podcast._id) {
        togglePlay();
      } else {
        playPodcast(podcast);
      }
    } catch (error) {
      console.error('Failed to update listen count:', error);
    }

  };

  // Add cleanup for listen tracking
  useEffect(() => {
    return () => {
      if (listenTracking.current) {
        clearTimeout(listenTracking.current);
      }
    };
  }, []);

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!podcast) return <div className="error-container">Podcast not found</div>;

  const isCurrentlyPlaying = currentPodcast && currentPodcast._id === podcast._id && isPlaying;



  return (
    <div className={`podcast-detail ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
      <div className="podcast-header">
        <img
          src={getFullUrl(podcast.coverImage)}
          alt={podcast.title}
          className="podcast-cover"
          onError={(e) => {
            console.log("Image failed to load:", e.target.src);
            e.target.onerror = null;
            e.target.src = "/images/default-cover.jpg";
          }}
        />
        <div className="podcast-info">
          <h1 className="podcast-title">{podcast.title}</h1>
          <div className="podcast-meta">
            {podcast.author && <span className="podcast-author">By: {podcast.author.username}</span>}
            {podcast.category && <span className="podcast-category">Category: {podcast.category.name}</span>}
            <span className="podcast-date">Published: {new Date(podcast.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="podcast-actions">
            <button
              onClick={handlePlayPodcast}
              className={`play-podcast-btn ${isCurrentlyPlaying ? 'playing' : ''}`}
            >
              {isCurrentlyPlaying ? 'Dừng' : 'Phát'}
            </button>
            <button
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>


      <div className="podcast-description">
        <h2>About this podcast</h2>
        <p>{podcast.description}</p>
      </div>

      {relatedPodcasts.length > 0 && (
        <div className="related-podcasts">
          <h2>More from this category</h2>
          <div className="related-podcasts-grid">
            {relatedPodcasts.slice(0, 4).map(relatedPodcast => (
              <div key={relatedPodcast._id} className="related-podcast-card">
                <img
                  src={getFullUrl(relatedPodcast.coverImage)}
                  alt={relatedPodcast.title}
                  className="related-podcast-cover"
                />
                <div className="related-podcast-info">
                  <h3>{relatedPodcast.title}</h3>
                  <button
                    onClick={() => playPodcast(relatedPodcast, [podcast, ...relatedPodcasts])}
                    className="play-related-btn"
                  >
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Comments podcastId={id} />
      {/* <PodcastPlayer 
        audioUrl={getFullUrl(podcast.audioUrl)}
        title={podcast.title}
        coverImage={getFullUrl(podcast.coverImage)}
        podcastId={podcast._id}
        onListenCountUpdated={handleListenCountUpdated}
        className="podcast-player"
      /> */}
    </div>
  );
};

export default PodcastDetail;
