import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext.jsx";
import Navbar from "../Navbar.jsx";
import RelayyChat from "./RelayyChat.jsx";
import { MessageCircle, Search, MoreVertical } from "lucide-react";

function RelayyInbox() {
  const { authUser, token, socket } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

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

        const sortedChats = (res.data || []).sort((a, b) => {
          const lastMsgA = a.messages?.[a.messages.length - 1];
          const lastMsgB = b.messages?.[b.messages.length - 1];

          if (!lastMsgB) return -1;
          if (!lastMsgA) return 1;

          return new Date(lastMsgB.timestamp) - new Date(lastMsgA.timestamp);
        });

        setChats(sortedChats);

        const counts = {};
        sortedChats.forEach((chat) => {
          const unreadMessages = (chat.messages || []).filter((msg) => {
            const senderId =
              msg?.sender?._id ?? typeof msg?.sender === "string"
                ? msg.sender
                : undefined;
            const authId = authUser?._id ?? authUser;
            const isSender = senderId === authId;
            return !isSender && !msg?.read;
          });
          counts[chat._id] = unreadMessages.length;
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error("❌ Error fetching chats:", err);
        setError("Failed to fetch your messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token, backendURL, authUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessageNotification = (data) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [data.chatId]: (prev[data.chatId] || 0) + 1,
      }));

      setChats((prevChats) => {
        return prevChats
          .map((chat) => {
            if (chat._id === data.chatId) {
              const newMsg = {
                _id: Date.now().toString(),
                sender: data.senderId,
                text: data.text,
                timestamp: new Date().toISOString(),
                read: false,
              };
              return {
                ...chat,
                messages: [...(chat.messages || []), newMsg],
              };
            }
            return chat;
          })
          .sort((a, b) => {
            const lastMsgA = a.messages?.[a.messages.length - 1];
            const lastMsgB = b.messages?.[b.messages.length - 1];
            if (!lastMsgB) return -1;
            if (!lastMsgA) return 1;
            return new Date(lastMsgB.timestamp) - new Date(lastMsgA.timestamp);
          });
      });
    };

    socket.on("new-message-notification", handleNewMessageNotification);

    return () => {
      socket.off("new-message-notification", handleNewMessageNotification);
    };
  }, [socket]);

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    document.body.style.overflow = "hidden";

    // Mark unread count cleared locally when opening
    setUnreadCounts((prev) => ({
      ...prev,
      [chat._id]: 0,
    }));
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    document.body.style.overflow = "unset";

    // Refresh chats to get updated read status
    const refreshChats = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/v1/chats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        const sortedChats = (res.data || []).sort((a, b) => {
          const lastMsgA = a.messages?.[a.messages.length - 1];
          const lastMsgB = b.messages?.[b.messages.length - 1];

          if (!lastMsgB) return -1;
          if (!lastMsgA) return 1;

          return new Date(lastMsgB.timestamp) - new Date(lastMsgA.timestamp);
        });

        setChats(sortedChats);

        const counts = {};
        sortedChats.forEach((chat) => {
          const unreadMessages = (chat.messages || []).filter((msg) => {
            const senderId =
              msg?.sender?._id ?? (typeof msg?.sender === "string" ? msg.sender : undefined);
            const authId = authUser?._id ?? authUser;
            const isSender = senderId === authId;
            return !isSender && !msg?.read;
          });
          counts[chat._id] = unreadMessages.length;
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error("Error refreshing chats:", err);
      }
    };

    refreshChats();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Safely determine the other user in a chat (handles object or id)
  const getOtherUser = (chat) => {
    const buyerObj = chat?.buyer;
    const sellerObj = chat?.seller;

    const buyerId =
      buyerObj?. _id ?? (typeof buyerObj === "string" ? buyerObj : undefined);
    const authId = authUser?._id ?? authUser;

    if (buyerId !== undefined && authId !== undefined) {
      return buyerId === authId ? sellerObj ?? {} : buyerObj ?? {};
    }

    // Fallback: try comparing raw values or return seller if buyer missing
    if (!buyerObj && sellerObj) return sellerObj;
    if (!sellerObj && buyerObj) return buyerObj;
    return buyerObj || sellerObj || {};
  };

  const getLastMessage = (chat) => {
    const lastMsg = chat?.messages?.[chat.messages.length - 1];
    if (!lastMsg) return "No messages yet";

    const senderId =
      lastMsg?.sender?._id ?? (typeof lastMsg?.sender === "string" ? lastMsg.sender : undefined);
    const authId = authUser?._id ?? authUser;
    const isSender = senderId === authId;

    const rawText = lastMsg?.text ?? "";
    const text = rawText.length > 40 ? rawText.substring(0, 40) + "..." : rawText;
    return (isSender ? "You: " : "") + text;
  };

  const filteredChats = (chats || []).filter((chat) => {
    const otherUser = getOtherUser(chat);
    const username = otherUser?.username ?? "";
    return username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const otherUserForModal = selectedChat ? getOtherUser(selectedChat) : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto bg-white shadow-lg">
        <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Chats</h1>
          <button className="hover:bg-emerald-700 rounded-full p-2 transition">
            <MoreVertical className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-gray-100 px-4 py-3 border-b">
          <div className="bg-white rounded-lg flex items-center px-4 py-2 shadow-sm">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 ml-3 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ height: "calc(100vh - 250px)" }}>
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="text-gray-600">Loading chats...</div>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center h-40">
              <div className="text-red-600">{error}</div>
            </div>
          )}

          {!loading && !error && filteredChats.length === 0 && (
            <div className="text-center py-20">
              <MessageCircle className="mx-auto h-16 w-16 text-gray-300" />
              <h2 className="mt-4 text-xl font-medium text-gray-600">No chats yet</h2>
              <p className="mt-2 text-sm text-gray-500">Start a conversation by messaging someone!</p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredChats.map((chat) => {
              const otherUser = getOtherUser(chat);
              const lastMessage = getLastMessage(chat);
              const lastMsgTime = chat?.messages?.[chat.messages.length - 1]?.timestamp;
              const unreadCount = unreadCounts[chat._id] || 0;
              const displayInitial = (otherUser?.username?.[0] ?? "?").toUpperCase();
              const displayName = otherUser?.username ?? "Unknown";

              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className="flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition relative"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {displayInitial}
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3
                        className={`font-semibold text-gray-900 truncate ${unreadCount > 0 ? "font-bold" : ""}`}
                      >
                        {displayName}
                      </h3>
                      {lastMsgTime && (
                        <span
                          className={`text-xs ml-2 flex-shrink-0 ${unreadCount > 0 ? "text-emerald-600 font-semibold" : "text-gray-500"}`}
                        >
                          {formatTime(lastMsgTime)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                        {lastMessage}
                      </p>
                      {chat.product && (
                        <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex-shrink-0">Product</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat Modal */}
      {selectedChat && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseChat}
        >
          <div
            className="w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <RelayyChat
              productId={selectedChat.product?._id}
              receiverId={otherUserForModal?._id}
              chatId={selectedChat._id}
              onClose={handleCloseChat}
              receiverName={otherUserForModal?.username ?? "Unknown"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RelayyInbox;
