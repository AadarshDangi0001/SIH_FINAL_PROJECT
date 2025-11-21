// Example: Using auth service in a component
import { useState } from 'react';
import { authService } from '../services/auth.service';
import { chatService } from '../services/chat.service';
import { postService } from '../services/post.service';

/**
 * Example component showing how to use API services
 */
const ExampleApiUsage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Example 1: Fetch user profile
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await authService.getProfile();
      setData(profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Fetch chats
  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const chats = await chatService.getChats();
      setData(chats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 3: Create a post
  const createPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const newPost = await postService.createPost({
        title: 'Sample Post',
        content: 'This is a sample post content'
      });
      setData(newPost);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 4: Send message
  const sendMessage = async (chatId) => {
    setLoading(true);
    setError(null);
    try {
      const message = await chatService.sendMessage(chatId, {
        content: 'Hello!',
        type: 'text'
      });
      setData(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>API Service Examples</h2>
      
      <div>
        <button onClick={fetchProfile}>Fetch Profile</button>
        <button onClick={fetchChats}>Fetch Chats</button>
        <button onClick={createPost}>Create Post</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default ExampleApiUsage;
