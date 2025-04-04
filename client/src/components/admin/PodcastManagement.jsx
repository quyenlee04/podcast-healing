import React, { useState, useEffect } from "react";
import podcastService from "../../services/podcastService";
import categoryService from "../../services/categoryService";
import { toast } from 'react-toastify';


const PodcastManagement = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    visibility: 'public',
    mp3: null,
    coverImage: null
  });

  useEffect(() => {
    fetchPodcasts();
    fetchCategories();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await podcastService.getPodcasts();
      setPodcasts(response.podcasts || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response || []); // Handle the direct response instead of response.categories
    } catch (err) {
      console.error(err);
      setCategories([]); // Set empty array on error
    }
  };
  // Update the handleAdd button click in the JSX
  // <button className="btn btn-primary" onClick={handleAdd}>
  //   <i className="bi bi-plus-lg me-2"></i>Add Podcast
  // </button>

  // Update handleInputChange function
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === 'audioFile') {
        setFormData(prev => ({ ...prev, mp3: files[0] }));
      } else {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Update handleEdit function
  const handleEdit = (podcast) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title,
      description: podcast.description,
      category: podcast.category._id || '',
      visibility: podcast.visibility,
      mp3: null,         // Changed from audioFile to mp3
      coverImage: null
    });
    setShowModal(true);
  };

  // Update handleCloseModal function
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPodcast(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      visibility: 'public',
      mp3: null,         // Changed from audioFile to mp3
      coverImage: null
    });
  };

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.description || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('visibility', formData.visibility);

      if (!editingPodcast) {
        // For new podcast
        if (!formData.mp3 || !formData.coverImage) {
          toast.error('Please upload both audio and cover image files');
          return;
        }
        formDataToSend.append('mp3', formData.mp3);
        formDataToSend.append('coverImage', formData.coverImage);

        await podcastService.createPodcast(formDataToSend);
      } else {
        // For editing
        if (formData.mp3) formDataToSend.append('mp3File', formData.mp3);
        if (formData.coverImage) formDataToSend.append('coverImage', formData.coverImage);

        await podcastService.updatePodcast(editingPodcast._id, formDataToSend);
      }

      await fetchPodcasts(); // Refresh the list
      handleCloseModal();
      toast.success(`Podcast ${editingPodcast ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving podcast:', error);
      toast.error(error.message || 'Failed to save podcast');
    }
  };

  const handleDelete = async (podcastId) => {
    if (window.confirm('Are you sure you want to delete this podcast?')) {
      try {
        await podcastService.deletePodcast(podcastId);
        fetchPodcasts();
      } catch (error) {
        console.error(error);
        alert(error.message || 'Failed to delete podcast');
      }
    }
  };

  // Update the form fields to match the new field names
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Podcast Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>Add Podcast
        </button>
      </div>

      {/* Podcast Table */}
      <div className="">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {podcasts.map(podcast => (
              <tr key={podcast._id}>
                <td>{podcast.title}</td>
                <td>{podcast.category?.name}</td>
                <td>
                  <span className="badge bg-success">
                    {podcast.listenCount || 0}
                  </span>
                </td>
                <td>
                  <span className={`badge ${podcast.visibility === 'public' ? 'bg-success' : 'bg-warning'}`}>
                    {podcast.visibility}
                  </span>
                </td>
                <td>
                  <div className="btn-group">

                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handleEdit(podcast)} // Change from handleUpdate to handleEdit
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(podcast._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header">
              <h5 className="modal-title">{editingPodcast ? 'Edit Podcast' : 'Add Podcast'}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>

                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {Array.isArray(categories) && categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Visibility</label>
                  <select
                    className="form-select"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                {/* Remove the !editingPodcast condition to allow file uploads during edit */}
                <div className="mb-3">
                  <label className="form-label">Audio File (MP3)</label>
                  <input
                    type="file"
                    className="form-control"
                    name="audioFile"
                    accept="audio/mpeg,audio/mp3"
                    onChange={handleInputChange}
                    required={!editingPodcast} // Only required for new podcasts
                  />
                  {editingPodcast && (
                    <small className="text-muted">Leave empty to keep the current audio file</small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Cover Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleInputChange}
                    required={!editingPodcast} // Only required for new podcasts
                  />
                  {editingPodcast && (
                    <small className="text-muted">Leave empty to keep the current cover image</small>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPodcast ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default PodcastManagement;