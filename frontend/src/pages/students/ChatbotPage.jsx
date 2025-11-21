import React, { useState, useRef, useEffect } from "react";
import { chatService } from "../../services/chat.service";
import socketService from "../../services/socket.service";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const chatEndRef = useRef(null);

  // Load chats on mount
  useEffect(() => {
    fetchChats();
    
    // Connect to socket
    socketService.connect();

    // Listen for AI responses
    socketService.onResponse((data) => {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.message, chat: data.chat },
      ]);
      setIsLoading(false);
    });

    // Listen for errors
    socketService.onError((error) => {
      console.error('Socket error:', error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "model", 
          content: "Sorry, I encountered an error. Please try again." 
        },
      ]);
      setIsLoading(false);
    });

    // Cleanup on unmount
    return () => {
      socketService.offResponse();
      socketService.offError();
      socketService.disconnect();
    };
  }, []);

  // Fetch all chats
  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const data = await chatService.getChats();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  // Load messages when chat changes
  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    }
  }, [currentChatId]);

  // Fetch messages for a chat
  const fetchMessages = async (chatId) => {
    try {
      const data = await chatService.getMessages(chatId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // If no chat selected, create one first
    if (!currentChatId) {
      await handleNewChat(input);
      return;
    }

    const userMessage = input.trim();
    setInput("");

    // Add user message to UI immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Send message via socket
      socketService.sendMessage(currentChatId, userMessage);
      
      // Response will come through socket.onResponse listener
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "model", 
          content: "Sorry, I encountered an error. Please try again." 
        },
      ]);
      setIsLoading(false);
    }
  };

  // Create a new chat
  const handleNewChat = async (firstMessage = null) => {
    try {
      let title = 'New Chat';
      
      // Only generate title from message if it's a string
      if (firstMessage && typeof firstMessage === 'string') {
        title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
      } else if (chats.length > 0) {
        title = `New Chat ${chats.length + 1}`;
      }
      
      const data = await chatService.createChat(title);
      
      // Add new chat to list
      setChats((prev) => [data.chat, ...prev]);
      setCurrentChatId(data.chat._id);
      setMessages([]);
      
      // If there's a first message, send it
      if (firstMessage && typeof firstMessage === 'string') {
        setInput(firstMessage);
        // Trigger send after chat is created
        setTimeout(() => {
          const form = document.querySelector('form');
          if (form) {
            form.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Failed to create new chat');
    }
  };

  // Toggle sidebar (mobile only)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Switch to a different chat
  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Delete a chat
  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this chat?')) {
      return;
    }
    
    try {
      await chatService.deleteChat(chatId);
      
      // Remove from UI
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  // Start editing chat title
  const startEditingChat = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat._id);
    setEditingTitle(chat.title);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  // Save edited title
  const saveEditedTitle = async (chatId, e) => {
    e.stopPropagation();
    
    if (!editingTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }
    
    try {
      const data = await chatService.updateChatTitle(chatId, editingTitle.trim());
      
      // Update in UI
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? { ...chat, title: data.chat.title } : chat
        )
      );
      
      setEditingChatId(null);
      setEditingTitle("");
    } catch (error) {
      console.error('Error updating chat title:', error);
      alert('Failed to update chat title');
    }
  };

  // Handle key press in edit mode
  const handleEditKeyPress = (chatId, e) => {
    if (e.key === 'Enter') {
      saveEditedTitle(chatId, e);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="w-screen  bg-[#E8FDFF] h-[90vh] mt-20 lg:w-full ">
      <div className="h-[98%] w-[98%] lg:w-[78%] lg:ml-12 flex flex-col bg-[#CAECFF] rounded-2xl relative ">
        {/* Welcome Text */}
        {!currentChatId && messages.length === 0 && (
          <div className="absolute w-full px-14 py-28 text-center lg:flex lg:flex-col lg:items-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Welcome to <span className="bg-[#FF993A] text-white px-4 py-1 rounded-xl">Askly</span>
            </h2>
            <p className="text-xs lg:text-sm ml-2 mt-2">
              The power of AI at your service - Tame the knowledge
            </p>
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 w-full overflow-y-auto px-8 py-4 flex flex-col gap-2 mt-24">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[70%] md:max-w-[85%] p-3 rounded-xl wrap-break-word ${
                msg.role === "user"
                  ? "self-end bg-[#FF993A] text-white"
                  : "self-start bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {isLoading && (
            <div className="self-start p-4 bg-gray-200 rounded-xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Form */}
        <div className="absolute bottom-[1%] w-full px-4">
          <form onSubmit={handleSend} className="w-full relative">
            <input
              type="text"
              placeholder='Example: "Explain Quantum Computing"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-lg px-4 w-full bg-[#D0E1E7] border border-black/30 disabled:bg-gray-300 disabled:text-gray-500"
            />
            <div
              onClick={isLoading ? null : handleSend}
              className={`absolute h-8 w-8 ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF993A] cursor-pointer"
              } flex items-center justify-center right-4 top-2 rounded`}
            >
              <i className="ri-send-plane-2-fill text-white"></i>
            </div>
          </form>
        </div>

        {/* Right Sidebar - Chat List */}
        <div
          className={`fixed top-20 lg:top-20 right-0 lg:right-4 h-[88vh] lg:h-[88.5vh] w-[60%] lg:w-[13%] bg-[#CAECFF] shadow-lg lg:rounded-2xl transition-transform duration-300 ease-in-out flex flex-col p-4 z-9999 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0`}
        >
          {/* Toggle button - mobile only */}
          <div
            onClick={toggleSidebar}
            className="lg:hidden absolute -left-9 top-5 bg-[#FF993A] text-white w-9 h-9 rounded flex items-center justify-center cursor-pointer font-bold shadow-md z-10000"
          >
            {sidebarOpen ? (
              <i className="ri-arrow-right-s-line"></i>
            ) : (
              <i className="ri-arrow-left-s-fill"></i>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col gap-4 h-full">
            <p
              onClick={handleNewChat}
              className="bg-[#FF993A] text-white px-3 py-3 rounded-lg cursor-pointer text-center font-medium hover:bg-[#e88a33] transition-colors"
            >
              + Start a new chat
            </p>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(88vh-60px)]">
              {loadingChats && (
                <p className="text-center text-sm text-gray-500">Loading chats...</p>
              )}
              {!loadingChats && chats.length === 0 && (
                <p className="text-center text-sm text-gray-500">No chats yet</p>
              )}
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => editingChatId !== chat._id && switchChat(chat._id)}
                  className={`p-3 bg-[#D0E1E7] rounded-lg cursor-pointer flex items-center gap-2 relative hover:bg-[#b0d4e7] transition-colors group ${
                    currentChatId === chat._id ? "bg-[#b0d4e7] border-l-[3px] border-[#FF993A]" : ""
                  }`}
                >
                  <i className="ri-chat-4-line shrink-0"></i>
                  
                  {editingChatId === chat._id ? (
                    <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => handleEditKeyPress(chat._id, e)}
                        className="flex-1 px-2 py-1 text-xs rounded border border-[#FF993A] focus:outline-none focus:ring-1 focus:ring-[#FF993A]"
                        autoFocus
                      />
                      <i
                        onClick={(e) => saveEditedTitle(chat._id, e)}
                        className="ri-check-line text-green-600 hover:text-green-700 cursor-pointer"
                        title="Save"
                      ></i>
                      <i
                        onClick={cancelEditing}
                        className="ri-close-line text-red-600 hover:text-red-700 cursor-pointer"
                        title="Cancel"
                      ></i>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                        {chat.title}
                      </span>
                      <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <i
                          onClick={(e) => startEditingChat(chat, e)}
                          className="ri-edit-line text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                          title="Rename"
                        ></i>
                        <i
                          onClick={(e) => deleteChat(chat._id, e)}
                          className="ri-delete-bin-line text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                          title="Delete"
                        ></i>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;