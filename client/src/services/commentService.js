import api from './api';

const commentService = {
  // Get comments for a podcast
  getComments: async (podcastId) => {
    try {
      const response = await api.get(`/podcasts/${podcastId}/comments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch comments' };
    }
  },

  // Add a new comment
  addComment: async (podcastId, text) => {
    try {
      const response = await api.post(`/podcasts/${podcastId}/comments`, { text });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  },

  // Delete a comment
  deleteComment: async (podcastId, commentId) => {
    try {
      const response = await api.delete(`/podcasts/${podcastId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete comment' };
    }
  }
};

export default commentService;