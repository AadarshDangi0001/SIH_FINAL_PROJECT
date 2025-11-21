import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = localStorage.getItem('token');
    
    this.socket = io(API_CONFIG.SOCKET_URL, {
      auth: {
        token: token
      },
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  sendMessage(chatId, message) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('ai-message', {
      content: message,
      chat: chatId
    });
  }

  onResponse(callback) {
    if (this.socket) {
      this.socket.on('ai-response', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('ai-error', callback);
    }
  }

  offResponse() {
    if (this.socket) {
      this.socket.off('ai-response');
    }
  }

  offError() {
    if (this.socket) {
      this.socket.off('ai-error');
    }
  }
}

export default new SocketService();
