import axiosInstance from '../utils/axios';
import { API_ENDPOINTS } from '../config/api.config';

export const scanService = {
  // Scan document using post API
  scanDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post(
        API_ENDPOINTS.POST.CREATE_POST,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return {
        imageUrl: response.data.post.image,
        explanation: response.data.post.caption,
        postId: response.data.post._id,
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
