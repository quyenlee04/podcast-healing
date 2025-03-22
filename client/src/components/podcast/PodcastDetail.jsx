import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import podcastService from "../../services/podcastService";
import PodcastPlayer from "./PodcastPlayer";
import "../../styles/global.css";
import "../../styles/podcast.css"; 

const PodcastDetail = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPodcasts, setRelatedPodcasts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true);
        const data = await podcastService.getPodcastById(id);
        setPodcast(data);
        console.log("Podcast data:", data);
      } catch (err) {
        console.error("Error fetching podcast:", err);
        setError("Failed to load podcast. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  // Helper function to format URLs
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };
  
  // Add this to your useEffect or create a new one
  useEffect(() => {
    const fetchRelatedPodcasts = async () => {
      if (podcast && podcast.category) {
        try {
          // Get podcasts in the same category
          const data = await podcastService.getPodcasts({ 
            category: podcast.category._id 
          });
          
          const related = data.podcasts.filter(p => p._id !== podcast._id);
          setRelatedPodcasts(related);
          
          // Find current index in case we navigated from a list
          const index = related.findIndex(p => p._id === podcast._id);
          if (index !== -1) {
            setCurrentIndex(index);
          }
        } catch (err) {
          console.error("Error fetching related podcasts:", err);
        }
      }
    };
    
    if (podcast) {
      fetchRelatedPodcasts();
    }
  }, [podcast]);
  
  // Add these navigation functions
  const handleNext = () => {
    if (currentIndex < relatedPodcasts.length - 1) {
      const nextPodcast = relatedPodcasts[currentIndex + 1];
      navigate(`/podcasts/${nextPodcast._id}`);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevPodcast = relatedPodcasts[currentIndex - 1];
      navigate(`/podcasts/${prevPodcast._id}`);
    }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!podcast) return <div className="error-container">Podcast not found</div>;

  return (
    <div className="podcast-detail-container">
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
        </div>
      </div>
      
      <div className="podcast-player-container">
        <PodcastPlayer 
          audioUrl={getFullUrl(podcast.audioUrl)} 
          title={podcast.title}
          coverImage={getFullUrl(podcast.coverImage)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={currentIndex < relatedPodcasts.length - 1}
          hasPrevious={currentIndex > 0}
        />
      </div>
      
      <div className="podcast-description">
        <h2>About this podcast</h2>
        <p>{podcast.description}</p>
      </div>
      
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
    </div>
  );
};

export default PodcastDetail;
