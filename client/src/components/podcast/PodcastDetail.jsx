import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import podcastService from "../../services/podcastService";
import { usePlayerContext } from "../../context/PlayerContext";
import PodcastPlayer from "./PodcastPlayer";
import "../../styles/global.css";
import "../../styles/podcast.css"; 

const PodcastDetail = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPodcasts, setRelatedPodcasts] = useState([]);
  const { playPodcast, currentPodcast, isPlaying, togglePlay } = usePlayerContext();
  const listenTracking = useRef();

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true);
        const data = await podcastService.getPodcastById(id);
        setPodcast(data);
        console.log("Podcast data:", data);
        
        // If this is the current podcast in the player, we don't need to do anything
        // Otherwise, we'll fetch related podcasts but not auto-play
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
  }, [id, currentPodcast]);

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
    if (currentPodcast && currentPodcast._id === podcast._id) {
      togglePlay();
    } else {
      playPodcast(podcast);
      // Start tracking listen duration when played from button
      if (!listenTracking.current) {
        listenTracking.current = setTimeout(async () => {
          try {
            await podcastService.incrementListenCount(podcast._id);
            handleListenCountUpdated();
          } catch (error) {
            console.error('Error updating listen count:', error);
          }
        }, 180000); // 3 minutes in milliseconds
      }
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

  const handleListenCountUpdated = async () => {
    try {
      const updatedPodcast = await podcastService.getPodcastById(id);
      setPodcast(updatedPodcast);
    } catch (error) {
      console.error('Error refreshing podcast data:', error);
    }
  };

  return (
    <div className="podcast-detail">
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
          
          <button 
            onClick={handlePlayPodcast} 
            className={`play-podcast-btn ${isCurrentlyPlaying ? 'playing' : ''}`}
          >
            {isCurrentlyPlaying ? 'Pause Episode' : 'Play Episode'}
          </button>
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
      
      {podcast.comments && podcast.comments.length > 0 && (
        <div className="podcast-comments">
          <h2>Comments ({podcast.comments.length})</h2>
          <ul className="comments-list">
            {podcast.comments.map(comment => (
              <li key={comment._id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.user.username}</span>
                  <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <PodcastPlayer 
        audioUrl={getFullUrl(podcast.audioUrl)}
        title={podcast.title}
        coverImage={getFullUrl(podcast.coverImage)}
        podcastId={podcast._id}
        onListenCountUpdated={handleListenCountUpdated}
        className="podcast-player"
      />
    </div>
  );
};

export default PodcastDetail;
