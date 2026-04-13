import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import RelayyChat from "./RelayyChat";
import { useAuth } from "../Context/AuthContext";

function UserChatButton({ receiverId, receiverName }) {
  const [isOpen, setIsOpen] = useState(false);
  const { authUser } = useAuth();

  if (!receiverId || receiverId === authUser?._id) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <MessageCircle className="h-5 w-5" />
        Message {receiverName || 'User'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            <RelayyChat
              receiverId={receiverId}
              receiverName={receiverName}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default UserChatButton;
