import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { Send, ArrowLeft, MoreVertical, Trash2, Trash } from "lucide-react";
import axios from "axios";

function RelayyChat({ productId, receiverId, chatId: existingChatId, onClose, receiverName, receiverAvatar }) {
  const { authUser, socket } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatId, setChatId] = useState(existingChatId || null);
  const [otherUser, setOtherUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [product, setProduct] = useState(null);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://relayy-backend-9war.onrender.com";

  useEffect(() => {
    if (!authUser || !receiverId) return;

    const initChat = async () => {
      try {
        setLoading(true);
        setError(null);

        const payload = { receiverId };
        if (productId) {
          payload.productId = productId;
        }

        const res = await axios.post(`${backendURL}/api/v1/chats`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        setChatId(res.data._id);
        setMessages(res.data.messages || []);
        
        const otherUserId = res.data.buyer._id === authUser._id ? res.data.seller : res.data.buyer;
        setOtherUser(otherUserId);
        
        if (res.data.product) {
          console.log("Product data:", res.data.product);
          setProduct(res.data.product);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error creating/getting chat:", err);
        setError("Failed to load chat.");
        setLoading(false);
      }
    };

    initChat();
  }, [authUser, receiverId, productId, backendURL]);

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("join-chat", chatId);

    // Mark messages as read when chat opens
    const markAsRead = async () => {
      try {
        await axios.put(`${backendURL}/api/v1/chats/${chatId}/read`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    };
    
    markAsRead();

    const handleReceiveMessage = (data) => {
      if (data.chatId === chatId) {
        setMessages((prev) => {
          const messageExists = prev.some(msg =>
            msg._id === data.message._id ||
            (msg.text === data.message.text &&
             Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 1000)
          );

          if (messageExists) {
            return prev;
          }

          return [...prev, data.message];
        });

        // Mark new message as read immediately since chat is open
        setTimeout(() => markAsRead(), 500);
      }
    };

    const handleMessageDeleted = (data) => {
      if (data.chatId === chatId) {
        setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
      }
    };

    const handleChatDeleted = (data) => {
      if (data.chatId === chatId) {
        onClose();
      }
    };

    const handleChatError = (error) => {
      alert(error);
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("chat-deleted", handleChatDeleted);
    socket.on("chat-error", handleChatError);

    return () => {
      socket.emit("leave-chat", chatId);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("chat-deleted", handleChatDeleted);
      socket.off("chat-error", handleChatError);
    };
  }, [socket, chatId, backendURL]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !chatId || !receiverId) return;

    const messageData = {
      chatId,
      text: newMessage.trim(),
      receiverId,
    };

    const optimisticMessage = {
      _id: Date.now().toString(),
      sender: authUser._id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);
    socket.emit("send-message", messageData);
    setNewMessage("");
  };

  const handleDeleteMessage = (messageId) => {
  socket.emit("delete-message", { chatId, messageId });
  setSelectedMessage(null);
  };

  const handleDeleteChat = () => {
    if (!window.confirm("Are you sure you want to delete this entire chat? This cannot be undone.")) {
      return;
    }

    socket.emit("delete-chat", { chatId });
    setShowMenu(false);
    onClose();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDateDivider = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-gray-600">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <span className="text-red-600">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white px-6 py-5 flex items-center gap-4 shadow-xl backdrop-blur-sm">
        <button 
          onClick={onClose} 
          className="hover:bg-white/20 rounded-full p-2.5 transition-all duration-300 active:scale-90 hover:rotate-[-5deg]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-emerald-100 flex items-center justify-center font-bold text-emerald-700 shadow-lg text-xl ring-4 ring-white/30">
            {(receiverName || otherUser?.username || 'U')[0].toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-xl tracking-tight">{receiverName || otherUser?.username || 'User'}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-emerald-100 font-medium">Active now</span>
          </div>
        </div>

        <div className="flex items-center gap-2 relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="hover:bg-white/20 rounded-full p-2.5 transition-all duration-300 active:scale-90"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* {showMenu && (
            <div className="absolute top-14 right-0 bg-white rounded-2xl shadow-2xl py-2 z-20 animate-fade-in border border-gray-100 min-w-[200px] overflow-hidden">
              <button
                onClick={handleDeleteChat}
                className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-5 py-3 w-full transition-all duration-200 active:scale-95 text-left group"
              >
                <Trash className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Delete Chat</span>
              </button>
            </div>
          )} */}
        </div>
      </div>

      {product && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100 px-6 py-4 shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Product Discussion</p>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-base font-bold text-gray-800 truncate flex-1">{product.title || 'Product'}</p>
              <div className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded-full shadow-md">
                <span className="text-xs font-medium">₹</span>
                <span className="text-sm font-bold">{product.price ? product.price.toLocaleString('en-IN') : '0'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.03'%3E%3Cpath d='M0 0h80v80H0z'/%3E%3Cpath d='M20 20h40v40H20z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#f9fafb'
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center mt-28 px-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-3 rounded-full shadow-lg border border-emerald-200">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <p className="text-emerald-700 text-sm font-semibold">End-to-end encrypted</p>
            </div>
            <div className="mt-10 space-y-3">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center shadow-lg">
                <Send className="h-10 w-10 text-emerald-600" />
              </div>
              <p className="text-gray-700 text-lg font-bold">No messages yet</p>
              <p className="text-gray-500 text-sm">Start the conversation! 👋</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSender = msg.sender?._id === authUser._id || msg.sender === authUser._id;
            const showDateDivider = index === 0 || 
              new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();
            
            return (
              <React.Fragment key={msg._id || index}>
                {showDateDivider && (
                  <div className="flex justify-center my-8">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-2 rounded-full shadow-md border border-emerald-200">
                      <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                        {formatDateDivider(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className={`flex ${isSender ? "justify-end" : "justify-start"} group animate-message-appear`}>
                  <div
                    className="relative"
                    onContextMenu={(e) => {
                      if (isSender) {
                        e.preventDefault();
                        setSelectedMessage(msg._id);
                      }
                    }}
                    onClick={() => {
                      if (selectedMessage === msg._id) {
                        setSelectedMessage(null);
                      }
                    }}
                  >
                    <div
                      className={`relative max-w-[95%] px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                        isSender
                          ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                      }`}
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      <p className="text-[15px] leading-relaxed mb-1.5">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`text-[11px] font-medium ${isSender ? 'text-emerald-50' : 'text-gray-500'}`}>
                          {formatTime(msg.timestamp)}
                        </span>
                        {isSender && (
                          <svg className="w-4 h-4 text-emerald-100 opacity-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        )}
                      </div>
                    </div>

                    {isSender && selectedMessage === msg._id && (
                      <div className="absolute top-0 -left-16 bg-white rounded-xl shadow-2xl p-1.5 z-10 animate-fade-in border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-95 group"
                        >
                          <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-semibold">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="bg-white px-6 py-5 flex items-center gap-4 border-t border-gray-200 shadow-2xl">
        <div className="flex-1 flex items-center bg-gray-50 rounded-3xl shadow-inner hover:bg-gray-100 transition-all duration-200 border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 bg-transparent focus:outline-none text-gray-800 text-[15px] placeholder-gray-400"
          />
        </div>
        
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`rounded-full p-4 transition-all duration-300 shadow-lg ${
            newMessage.trim() 
              ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 hover:shadow-2xl hover:scale-110 text-white active:scale-95' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

export default RelayyChat;
