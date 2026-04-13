import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import UserChatButton from "./userChatButton";
import { useAuth } from "../Context/AuthContext";

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();
  
  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://relayy-backend-9war.onrender.com";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendURL}/api/v1/users/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        
        const filteredUsers = res.data.filter(user => user._id !== authUser?._id);
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchUsers();
    }
  }, [authUser, backendURL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Message Users</h1>
        
        {loading ? (
          <div className="text-center py-12">Loading users...</div>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.college} - {user.hostel}</p>
                </div>
                <UserChatButton 
                  receiverId={user._id} 
                  receiverName={user.username}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserListPage;
