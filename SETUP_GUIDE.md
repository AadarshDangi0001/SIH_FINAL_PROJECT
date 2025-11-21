# Backend-Frontend Connection Setup ✅

## ✨ What Was Set Up

### 1. Environment Variables
- ✅ `.env` - Development environment (localhost:5050)
- ✅ `.env.production` - Production environment

### 2. Configuration Files
- ✅ `src/config/api.config.js` - API base URL and all endpoints
- ✅ `src/utils/axios.js` - Axios instance with interceptors

### 3. API Services
- ✅ `src/services/auth.service.js` - Login, Register, Logout, Profile
- ✅ `src/services/chat.service.js` - Chat operations
- ✅ `src/services/post.service.js` - Post operations

### 4. Updated Components
- ✅ `LoginPage.jsx` - Now uses auth service
- ✅ `RegisterPage.jsx` - Now uses auth service
- ✅ `Setting.jsx` - Logout uses auth service

### 5. Backend Updates
- ✅ CORS configured for both development and production
- ✅ Supports localhost:5173, localhost:5050, and production URL

## 🚀 Quick Start

### Step 1: Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5050`

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Step 3: Test the Connection
1. Go to `http://localhost:5173/signup`
2. Create an account
3. Login with your credentials
4. You should be redirected to the dashboard

## 📡 API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Chat
- `GET /api/chat` - Get all chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/:chatId/messages` - Get messages
- `POST /api/chat/:chatId/messages` - Send message

### Posts
- `GET /api/post` - Get all posts
- `POST /api/post` - Create post
- `GET /api/post/:postId` - Get single post
- `PUT /api/post/:postId` - Update post
- `DELETE /api/post/:postId` - Delete post

## 🔧 How to Use in Your Components

### Example: Fetch Posts
```javascript
import { postService } from '../services/post.service';
import { useState, useEffect } from 'react';

function MyComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {loading ? 'Loading...' : posts.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}
```

## 🔐 Authentication Flow

1. User logs in via `LoginPage`
2. `authService.login()` sends credentials to backend
3. Backend returns user data + token
4. Token stored in localStorage
5. Axios automatically adds token to all future requests
6. Protected routes check for user in AuthContext

## 🌐 Production Deployment

### Frontend (Vercel)
1. Set environment variable in Vercel:
   - `VITE_API_URL` = Your backend URL + /api
   - `VITE_SOCKET_URL` = Your backend URL

### Backend
1. Update CORS in `backend/src/app.js`:
   - Add your Vercel deployment URL to `allowedOrigins`

## ⚡ Features

- ✅ Automatic token management
- ✅ Request/Response interceptors
- ✅ Error handling (401 → redirect to login)
- ✅ CORS configured
- ✅ Environment-based URLs
- ✅ TypeScript-ready structure
- ✅ Centralized API endpoints

## 📝 Notes

- All API calls go through axios instance
- Errors are automatically caught and formatted
- 401 errors automatically redirect to login
- Tokens are stored in localStorage
- CORS allows credentials (cookies)

## 🐛 Troubleshooting

### CORS Error
- Make sure backend is running
- Check CORS origins in `backend/src/app.js`
- Verify frontend URL is in `allowedOrigins`

### 401 Unauthorized
- Check if token is in localStorage
- Verify token is being sent in headers
- Check backend auth middleware

### Connection Refused
- Verify backend is running on port 5050
- Check `.env` file has correct port
- Ensure no firewall blocking

## 🎯 Next Steps

1. ✅ Test login/register flow
2. ✅ Add more API endpoints as needed
3. ✅ Implement real-time features with Socket.IO
4. ✅ Add loading states and error handling in UI
5. ✅ Deploy to production

---

**Ready to use!** Your backend and frontend are now connected with production-ready architecture. 🚀
