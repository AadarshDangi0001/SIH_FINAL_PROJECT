export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  // Chat endpoints
  CHAT: {
    GET_CHATS: '/chat',
    CREATE_CHAT: '/chat',
    GET_MESSAGES: '/chat/:chatId/messages',
    SEND_MESSAGE: '/chat/:chatId/messages',
  },
  // Post endpoints
  POST: {
    GET_POSTS: '/post',
    CREATE_POST: '/post',
    GET_POST: '/post/:postId',
    UPDATE_POST: '/post/:postId',
    DELETE_POST: '/post/:postId',
  },
};
