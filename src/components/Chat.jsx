import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { SendHorizonal, Loader2 } from "lucide-react";
import axios from "axios";

function Chat({ productId, receiverId, chatId: existingChatId }) {
  const { authUser, socket } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatId, setChatId] = useState(existingChatId || null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

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
    console.log(`✅ Joined chat: ${chatId}`);

    const handleReceiveMessage = (data) => {
      if (data.chatId === chatId) {
        setMessages((prev) => {
          // Check if message already exists (e.g., temp message)
          const exists = prev.some((msg) =>
            msg._id === data.message._id ||
            (msg.sender === data.message.sender._id && msg.text === data.message.text && Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 1000)
          );
          if (!exists) {
            return [...prev, data.message];
          }
          return prev;
        });
      }
    };

    const handleMessageDeleted = (data) => {
      if (data.chatId === chatId) {
        setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
      }
    };

    const handleChatDeleted = (data) => {
      if (data.chatId === chatId) {
        // Close the chat if open
        // Assuming there's an onClose prop, but in InboxPage, it's modal, so perhaps set selectedChat to null
        // Since Chat.jsx is used in InboxPage, and no onClose, perhaps emit or something. But for now, since it's modal, maybe not needed, but to be safe, we can leave it.
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("chat-deleted", handleChatDeleted);

    return () => {
      socket.emit("leave-chat", chatId);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("chat-deleted", handleChatDeleted);
      console.log(`❌ Left chat: ${chatId}`);
    };
  }, [socket, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !chatId || !receiverId) return;

    const messageData = {
      chatId,
      text: newMessage.trim(),
      receiverId,
    };

    // Add the message locally immediately for instant UI update
    const tempMessage = {
      sender: authUser._id,
      text: newMessage.trim(),
      timestamp: new Date(),
      _id: `temp-${Date.now()}`, // Temporary ID to avoid duplicates
    };
    setMessages((prev) => [...prev, tempMessage]);

    socket.emit("send-message", messageData);
    setNewMessage("");
  };

  // Render Logic
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
        <span className="ml-2 text-gray-700">Loading chat...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <span className="text-red-600">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSender = msg.sender?._id === authUser._id || msg.sender === authUser._id;
            return (
              <div
                key={msg._id || index}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    isSender
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block text-right">
                    {(() => {
                      const date = new Date(msg.timestamp);
                      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                    })()}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-emerald-600 text-white rounded-full p-3 hover:bg-emerald-700 disabled:bg-gray-400"
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;

