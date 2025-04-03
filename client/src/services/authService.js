import api from './api';

// Add these methods to your existing authService object
const authService = {
    // Register a new user
    register: async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login a user
    login: async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);

            // Store token and user data in localStorage
            if (response.data.token) {
                // No need to manipulate the token as it's already in correct format from server
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

   
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    
    getUserById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch user' };
        }
    },

   
    updateProfile: async (profileData) => {
        try {
            
            const formData = new FormData();

            // Add text fields
            if (profileData.firstName) formData.append('firstName', profileData.firstName);
            if (profileData.lastName) formData.append('lastName', profileData.lastName);
            if (profileData.bio) formData.append('bio', profileData.bio);

            // Add avatar file if provided
            if (profileData.avatar) {
                formData.append('avatar', profileData.avatar);
            }

            const response = await api.put('/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update user in localStorage
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update profile' };
        }
    },
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch users' };
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update user' };
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete user' };
        }
    }
};

export default authService;