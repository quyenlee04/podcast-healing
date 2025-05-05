import api from './api';

const podcastService = {
  // Get all podcasts with optional filtering
  getPodcasts: async (params = {}) => {
    try {
      const response = await api.get('/podcasts', { 
        params: {
          ...params,
          search: params.search || '',
          sort: params.sort || '-createdAt'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch podcasts' };
    }
  },

  // Get a single podcast by ID
  getPodcastById: async (id) => {
    try {
      const response = await api.get(`/podcasts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch podcast' };
    }
  },

  // Create a new podcast (with file upload)
  createPodcast: async (formData) => {
    try {
      const response = await api.post('/podcasts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create podcast' };
    }
  },

  // Update an existing podcast
  updatePodcast: async (id, podcastData) => {
    try {
      // Create FormData for file uploads
  
      
      const response = await api.put(`/podcasts/${id}`, podcastData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update podcast' };
    }
  },
// ... existing code ...

// getPodcastsByAuthor: async () => {
//   try {
//     const response = await api.get('/podcasts/author');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to fetch user podcasts' };
//   }
// },

getPodcastsByAuthor: async (authorId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get(`/podcasts/author/${authorId}`, {
      headers: {
<<<<<<< HEAD
        'Authorization': `Bearer ${localStorage.getItem('token')}`
=======
        Authorization: `Bearer ${token}`
>>>>>>> 86a5ea1ee0e912854d8f54310f17be07b34153ff
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Không xóa token ở đây
      throw error;
    }
    throw error;
  }
},
searchPodcastsByName: async (searchTerm) => {
  try {
    const response = await api.get('/podcasts', { 
      params: { 
        search: searchTerm,
        sort: '-createdAt'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search podcasts' };
  }
},// Add this method to the existing podcastService object
searchPodcastsByName: async (searchTerm) => {
  try {
    const response = await api.get('/podcasts', { 
      params: { 
        search: searchTerm,
        sort: '-createdAt'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search podcasts' };
  }
},

  // Delete a podcast
  deletePodcast: async (id) => {
    try {
      const response = await api.delete(`/podcasts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete podcast' };
    }
  },

  // Like/unlike a podcast
  toggleLike: async (id) => {
    try {
      const response = await api.post(`/podcasts/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle like' };
    }
  },
  getLikedPodcasts: async () => {
    try {
      const response = await api.get('/podcasts/liked');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch liked podcasts' };
    }
  },
  // Add a comment to a podcast
  addComment: async (id, text) => {
    try {
      const response = await api.post(`/podcasts/${id}/comment`, { text });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  },

  // Delete a comment from a podcast
  deleteComment: async (podcastId, commentId) => {
    try {
      const response = await api.delete(`/podcasts/${podcastId}/comment/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete comment' };
    }
  },

  incrementListenCount: async (podcastId) => {
    try {
      const response = await api.post(`/podcasts/${podcastId}/increment-listen`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to increment listen count' };
    }
  },
  getLikedPodcasts: async () => {
    try {
      const response = await api.get('/podcasts/liked');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch liked podcasts' };
    }
  },
};




export default podcastService;