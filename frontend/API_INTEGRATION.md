# API Integration Guide

## Environment Setup

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### Production (.env.production)
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

## Project Structure

```
frontend/src/
├── config/
│   └── api.config.js          # API configuration and endpoints
├── utils/
│   └── axios.js               # Axios instance with interceptors
└── services/
    ├── auth.service.js        # Authentication API calls
    ├── chat.service.js        # Chat API calls
    └── post.service.js        # Post API calls
```

## Usage Examples

### 1. Authentication

#### Login
```javascript
import { authService } from '../services/auth.service';

const handleLogin = async () => {
  try {
    const data = await authService.login({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('User logged in:', data);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Register
```javascript
import { authService } from '../services/auth.service';

const handleRegister = async () => {
  try {
    const data = await authService.register({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    console.log('User registered:', data);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

#### Logout
```javascript
import { authService } from '../services/auth.service';

const handleLogout = async () => {
  try {
    await authService.logout();
    console.log('User logged out');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

#### Get Profile
```javascript
import { authService } from '../services/auth.service';

const fetchProfile = async () => {
  try {
    const profile = await authService.getProfile();
    console.log('User profile:', profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};
```

### 2. Chat Operations

#### Get All Chats
```javascript
import { chatService } from '../services/chat.service';

const fetchChats = async () => {
  try {
    const chats = await chatService.getChats();
    console.log('Chats:', chats);
  } catch (error) {
    console.error('Failed to fetch chats:', error);
  }
};
```

#### Send Message
```javascript
import { chatService } from '../services/chat.service';

const sendMessage = async (chatId) => {
  try {
    const message = await chatService.sendMessage(chatId, {
      content: 'Hello, World!',
      type: 'text'
    });
    console.log('Message sent:', message);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

### 3. Post Operations

#### Get All Posts
```javascript
import { postService } from '../services/post.service';

const fetchPosts = async () => {
  try {
    const posts = await postService.getPosts();
    console.log('Posts:', posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
};
```

#### Create Post
```javascript
import { postService } from '../services/post.service';

const createNewPost = async () => {
  try {
    const post = await postService.createPost({
      title: 'My Post',
      content: 'Post content here'
    });
    console.log('Post created:', post);
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};
```

## API Response Handling

The axios instance automatically handles:
- ✅ Authentication tokens (stored in localStorage)
- ✅ Request/Response interceptors
- ✅ Error handling (401, 403, 404, 500)
- ✅ Automatic redirect to login on 401
- ✅ CORS with credentials

## Error Handling

All services throw errors that can be caught:

```javascript
try {
  const data = await authService.login(credentials);
  // Success
} catch (error) {
  // error.message contains the error message
  console.error(error.message);
}
```

## Adding New Endpoints

1. Add endpoint to `config/api.config.js`:
```javascript
export const API_ENDPOINTS = {
  NEW_FEATURE: {
    GET_ALL: '/new-feature',
    GET_ONE: '/new-feature/:id',
  }
};
```

2. Create service in `services/`:
```javascript
import axiosInstance from '../utils/axios';
import { API_ENDPOINTS } from '../config/api.config';

export const newFeatureService = {
  getAll: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.NEW_FEATURE.GET_ALL);
    return response.data;
  }
};
```

3. Use in components:
```javascript
import { newFeatureService } from '../services/newFeature.service';

const data = await newFeatureService.getAll();
```

## Development vs Production

- **Development**: Uses `http://localhost:3000/api` (from `.env`)
- **Production**: Uses production URL (from `.env.production`)

Vite automatically selects the correct env file based on the build mode.

## Running the Application

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` and connect to backend at `http://localhost:3000`.
