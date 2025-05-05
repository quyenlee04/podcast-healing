import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import podcastService from "../services/podcastService";
import categoryService from "../services/categoryService";
import MiniPlayer from "../components/podcast/MiniPlayer";


const HomePage = () => {
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
  const [recentPodcasts, setRecentPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured podcasts
        const featuredData = await podcastService.getPodcasts({ featured: true, limit: 5 });
        setFeaturedPodcasts(featuredData.podcasts || []);
        
        // Fetch recent podcasts
        const recentData = await podcastService.getPodcasts({ sort: '-createdAt', limit: 8 });
        setRecentPodcasts(recentData.podcasts || []);
        
        // Fetch categories
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData.categories || []);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover and Listen to Amazing Podcasts</h1>
          <p>Stream the best podcasts for healing, meditation, and personal growth</p>
          <Link to="/podcasts" className="browse-button">Browse All Podcasts</Link>
        </div>
      </section>
      {featuredPodcasts.length > 0 && (
        <section className="featured-section">
          <h2 className="section-title">Featured Podcasts</h2>
          <div className="featured-grid">
            {featuredPodcasts.slice(0, 3).map(podcast => (
              <MiniPlayer key={podcast._id} podcast={podcast} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                to={`/podcasts?category=${category._id}`} 
                key={category._id} 
                className="category-card"
              >
                <div className="category-icon">
                  <i className={`bi bi-${category.icon || 'music-note'}`}></i>
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="about-section">
        <h2 className="section-title">About Podcast Healing</h2>
        <div className="about-content">
          <div className="about-text">
            <p>Welcome to Podcast Healing, your sanctuary for mindfulness and personal growth. We curate the best podcasts focused on meditation, healing, and spiritual wellness.</p>
            <div className="about-features">
              <div className="feature">
                <i className="bi bi-heart-fill"></i>
                <h3>Curated Content</h3>
                <p>Carefully selected podcasts for your well-being journey</p>
              </div>
              <div className="feature">
                <i className="bi bi-headphones"></i>
                <h3>Quality Audio</h3>
                <p>High-quality streaming for the best listening experience</p>
              </div>
              <div className="feature">
                <i className="bi bi-people-fill"></i>
                <h3>Community</h3>
                <p>Join a community of like-minded individuals</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
