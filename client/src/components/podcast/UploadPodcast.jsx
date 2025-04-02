import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import podcastService from "../../services/podcastService";
import categoryService from "../../services/categoryService";
import "../../styles/global.css";

const UploadPodcast = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    coverImage: null,
    mp3: null,
    visibility: "public"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        // Fix: The API returns categories directly, not nested in a categories property
        setCategories(response || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('visibility', formData.visibility);
      
      if (formData.mp3) {
        formDataToSend.append('mp3', formData.mp3);
      }
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }

      await podcastService.createPodcast(formDataToSend);
      navigate('/podcasts');
    } catch (error) {
      setError(error.message || 'Failed to upload podcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-podcast-container">
      <h2>Upload New Podcast</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="form-control"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Audio File (MP3)</label>
          <input
            type="file"
            name="mp3"
            accept="audio/mpeg,audio/mp3"
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Podcast'}
        </button>
      </form>
    </div>
  );
};

export default UploadPodcast;
