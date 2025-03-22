import api from './api';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  // Get a single category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category' };
    }
  },

  // Admin functions below - these would typically be used in an admin panel

  // Create a new category (admin only)
  createCategory: async (categoryData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', categoryData.name);
      if (categoryData.description) {
        formData.append('description', categoryData.description);
      }
      
      // Add image if provided
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }
      
      const response = await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create category' };
    }
  },

  // Update an existing category (admin only)
  updateCategory: async (id, categoryData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      if (categoryData.name) formData.append('name', categoryData.name);
      if (categoryData.description) formData.append('description', categoryData.description);
      if (categoryData.active !== undefined) formData.append('active', categoryData.active);
      
      // Add image if provided
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }
      
      const response = await api.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update category' };
    }
  },

  // Delete a category (admin only)
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete category' };
    }
  }
};

export default categoryService;