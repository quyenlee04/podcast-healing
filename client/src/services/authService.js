import api from './api';

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
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Logout a user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get user by ID
    getUserById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch user' };
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            // Create FormData for file uploads
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
    }
};

export default authService;