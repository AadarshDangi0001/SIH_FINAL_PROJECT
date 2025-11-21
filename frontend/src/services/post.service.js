import axiosInstance from '../utils/axios';
import { API_ENDPOINTS } from '../config/api.config';

export const postService = {
  // Get all posts
  getPosts: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.POST.GET_POSTS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.POST.CREATE_POST, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single post
  getPost: async (postId) => {
    try {
      const endpoint = API_ENDPOINTS.POST.GET_POST.replace(':postId', postId);
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update post
  updatePost: async (postId, postData) => {
    try {
      const endpoint = API_ENDPOINTS.POST.UPDATE_POST.replace(':postId', postId);
      const response = await axiosInstance.put(endpoint, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const endpoint = API_ENDPOINTS.POST.DELETE_POST.replace(':postId', postId);
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
