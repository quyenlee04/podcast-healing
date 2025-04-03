import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import categoryService from "../services/categoryService";
import "../styles/CategoriesPage.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-category.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`; // Add server URL
  };

  return (
    <div className="categories-page">
      <h1>Categories</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <Link 
            to={`/podcasts?category=${category._id}`} 
            key={category._id} 
            className="category-card"
          >
            <div className="category-image">
              <img 
                src={getImageUrl(category.image)} 
                alt={category.name}
                onError={(e) => {
                  e.target.src = '/default-category.jpg';
                }}
              />
            </div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;