# Chat Integration with Socket.IO

## ✅ What Was Implemented

### 1. Socket Service (`frontend/src/services/socket.service.js`)
- Manages Socket.IO connection
- Handles authentication with JWT token
- Emits messages to backend
- Listens for AI responses and errors
- Auto-reconnection support

### 2. Updated ChatbotPage
- **Socket Integration**: Uses Socket.IO for real-time messaging
- **Load Chats**: Fetches user's chats on mount
- **Create Chat**: Creates new chat via REST API
- **Load Messages**: Fetches message history for each chat
- **Send Messages**: Sends via Socket.IO → AI processes → Response received
- **Delete Chat**: Deletes chat and messages via REST API
- **Real-time Updates**: Messages appear instantly

### 3. Backend Updates
- **Socket CORS**: Updated to allow localhost for development
- **Multiple Origins**: Supports both production and development URLs

## 📡 How It Works

### Message Flow:
```
User types message
    ↓
Frontend adds to UI (optimistic update)
    ↓
Socket emits "ai-message" event
    ↓
Backend receives message
    ↓
Backend:
  - Saves user message to DB
  - Generates embedding vectors
  - Queries memory (RAG)
  - Sends to AI (Gemini)
  - Saves AI response to DB
    ↓
Socket emits "ai-response" event
    ↓
Frontend receives and displays AI response
```

## 🔧 API Endpoints Used

### REST API:
- `POST /api/chat` - Create new chat
- `GET /api/chat` - Get all chats
- `GET /api/chat/messages/:id` - Get messages for chat
- `DELETE /api/chat/:id` - Delete chat
- `PUT /api/chat/:id` - Update chat title

### Socket.IO Events:
- **Emit**: `ai-message` - Send user message
- **Listen**: `ai-response` - Receive AI response
- **Listen**: `ai-error` - Handle errors

## 🚀 Testing

1. **Start Backend**:
```bash
cd backend
npm run dev
```

2. **Start Frontend**:
```bash
cd frontend
npm run dev
```

3. **Test Flow**:
   - Login to the app
   - Click "Start a new chat"
   - Send a message
   - Wait for AI response (uses Gemini + RAG)
   - Messages are saved to database
   - Switch between chats to see history

## ✨ Features

- ✅ Real-time messaging with Socket.IO
- ✅ AI-powered responses (Gemini)
- ✅ RAG (Retrieval Augmented Generation) with Pinecone
- ✅ Chat history persistence
- ✅ Multiple chat support
- ✅ Message loading states
- ✅ Error handling
- ✅ Auto-reconnection
- ✅ Token-based authentication

## 🔐 Authentication

Socket connection uses JWT token from localStorage:
```javascript
auth: {
  token: localStorage.getItem('token')
}
```

Backend validates token before allowing socket connection.

## 📝 Notes

- Messages are stored in MongoDB
- Vectors stored in Pinecone for RAG
- AI responses use chat history + memory for context
- Socket automatically reconnects on disconnect
- All operations are user-specific (protected)
