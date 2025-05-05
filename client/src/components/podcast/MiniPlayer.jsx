import React from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaPause } from "react-icons/fa";
import { usePlayerContext } from "../../context/PlayerContext";
import "../../styles/components/miniPlayer.css"; 

const MiniPlayer = ({ podcast }) => {
  const { playPodcast, currentPodcast, isPlaying, togglePlay } = usePlayerContext();

  const isCurrentlyPlaying = 
    currentPodcast && 
    currentPodcast._id === podcast._id && 
    isPlaying;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentPodcast && currentPodcast._id === podcast._id) {
      togglePlay();
    } else {
      playPodcast(podcast);
    }
  };

  // Helper function to format URLs
  const getFullUrl = (path) => {
    if (!path) return "/images/default-cover.jpg";
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  return (
    <div className="mini-player">
      <Link to={`/podcasts/${podcast._id}`} className="mini-player-link">
        <div className="mini-player-image-container">
          <img 
            src={getFullUrl(podcast.coverImage)} 
            alt={podcast.title} 
            className="mini-player-image" 
          />
          <button 
            className={`mini-player-button ${isCurrentlyPlaying ? 'playing' : ''}`}
            onClick={handlePlayClick}
          >
            {isCurrentlyPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
        <div className="mini-player-info">
          <h3 className="mini-player-title">{podcast.title}</h3>
          <p className="mini-player-author">
            {podcast.author ? podcast.author.username : "Unknown Author"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default MiniPlayer;