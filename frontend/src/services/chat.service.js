import axiosInstance from '../utils/axios';
import { API_ENDPOINTS } from '../config/api.config';

export const chatService = {
  // Get all chats
  getChats: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CHAT.GET_CHATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new chat
  createChat: async (title = 'New Chat') => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CHAT.CREATE_CHAT, { title });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get messages for a chat
  getMessages: async (chatId) => {
    try {
      const response = await axiosInstance.get(`/chat/messages/${chatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update chat title
  updateChatTitle: async (chatId, title) => {
    try {
      const response = await axiosInstance.put(`/chat/${chatId}`, { title });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    try {
      const response = await axiosInstance.delete(`/chat/${chatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
