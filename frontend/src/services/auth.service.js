import axiosInstance from '../utils/axios';
import { API_ENDPOINTS } from '../config/api.config';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      // Transform data to match backend structure
      const requestData = {
        fullName: {
          firstName: userData.firstName,
          lastName: userData.lastName
        },
        email: userData.email,
        password: userData.password
      };
      
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
