import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext.jsx"; // Assumes context folder is in src/
import Navbar from "../Navbar.jsx"; // Assumes Navbar.jsx is in src/
import InboxItem from "./InboxItem.jsx"; // Points to components folder
import Chat from "../components/Chat.jsx"; // Points to components folder
import { MessageCircle, X } from "lucide-react";

function InboxPage() {
  const { authUser, token } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://relayy-backend-9war.onrender.com";

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("You must be logged in to view your messages.");
      return;
    }

    const fetchChats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${backendURL}/api/v1/chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const sortedChats = res.data.sort((a, b) => {
          const lastMsgA = a.messages[a.messages.length - 1];
          const lastMsgB = b.messages[b.messages.length - 1];

          if (!lastMsgB) return -1;
          if (!lastMsgA) return 1;

          return new Date(lastMsgB.timestamp) - new Date(lastMsgA.timestamp);
        });

        setChats(sortedChats);
      } catch (err) {
        console.error("❌ Error fetching chats:", err);
        setError("Failed to fetch your messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token, backendURL]);

  // Listen for real-time message updates to refresh chat list
  useEffect(() => {
    if (!socket) return;

    const handleMessageUpdate = (data) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === data.chatId) {
            // Update the chat with the new message
            return {
              ...chat,
              messages: [...chat.messages, data.message],
            };
          }
          return chat;
        });

        // Re-sort the chats by last message timestamp
        return updatedChats.sort((a, b) => {
          const lastMsgA = a.messages[a.messages.length - 1];
          const lastMsgB = b.messages[b.messages.length - 1];

          if (!lastMsgB) return -1;
          if (!lastMsgA) return 1;

          return new Date(lastMsgB.timestamp) - new Date(lastMsgA.timestamp);
        });
      });
    };

    const handleChatDeleted = (data) => {
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== data.chatId));
      // If the deleted chat is currently selected, close it
      if (selectedChat && selectedChat._id === data.chatId) {
        setSelectedChat(null);
      }
    };

    socket.on("receive-message", handleMessageUpdate);
    socket.on("chat-deleted", handleChatDeleted);

    return () => {
      socket.off("receive-message", handleMessageUpdate);
      socket.off("chat-deleted", handleChatDeleted);
    };
  }, [socket, selectedChat]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Inbox</h1>

        {loading && (
          <div className="text-center text-gray-600">Loading messages...</div>
        )}

        {error && <div className="text-center text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            {chats.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-2 text-lg font-medium">No messages yet</h2>
                <p className="mt-1 text-sm">
                  Start a conversation by clicking "Chat with Seller" on a
                  product page.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {chats.map((chat) => (
                    <InboxItem
                      key={chat._id}
                      chat={chat}
                      currentUserId={authUser?._id}
                      onSelect={() => handleSelectChat(chat)}
                    />
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>

      {/* Chat Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg h-full max-h-[70vh] flex flex-col z-50 animate-fade-in-down">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {selectedChat.product 
                  ? `Chat about "${selectedChat.product.title}"`
                  : `Chat with ${selectedChat.buyer._id === authUser?._id ? selectedChat.seller.username : selectedChat.buyer.username}`
                }
              </h2>
              <button
                onClick={handleCloseChat}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Chat Component */}
            <div className="flex-1 overflow-y-auto">
              <Chat
                productId={selectedChat.product?._id}
                receiverId={selectedChat.buyer._id === authUser?._id ? selectedChat.seller._id : selectedChat.buyer._id}
                chatId={selectedChat._id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InboxPage;

