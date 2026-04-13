import React from 'react';

// A simple fallback image
const FallbackAvatar = () => (
  <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

function InboxItem({ chat, currentUserId, onSelect }) {
  // Determine who the "other user" is
  const otherUser = chat.buyer._id === currentUserId ? chat.seller : chat.buyer;
  const product = chat.product;

  // Fallback if product or user data is somehow missing
  if (!otherUser || !product) {
    return null;
  }
  
  // Get the last message, if one exists
  const lastMessage = chat.messages.length > 0 
    ? chat.messages[chat.messages.length - 1]
    : null;

  return (
    <li 
      onClick={onSelect} 
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start space-x-4">
        
        {/* Left Side: Avatar */}
        <div className="flex-shrink-0">
          {otherUser.avatar ? (
            <img 
              className="h-12 w-12 rounded-full object-cover" 
              src={otherUser.avatar} 
              alt={otherUser.name} 
            />
          ) : (
            <FallbackAvatar />
          )}
        </div>

        {/* Middle: Conversation Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {otherUser.name}
          </p>
          <p className="text-sm text-gray-600 truncate">
            <span className="font-medium">Product:</span> {product.title}
          </p>
          <p className="text-sm text-gray-500 truncate mt-1">
            {lastMessage ? (
              <>
                <span className="font-medium">
                  {lastMessage.sender === currentUserId ? "You: " : ""}
                </span>
                {lastMessage.text}
              </>
            ) : (
              'No messages yet'
            )}
          </p>
        </div>

        {/* Right Side: Product Image */}
        <div className="flex-shrink-0">
          <img 
            className="h-16 w-16 rounded-md object-cover" 
            src={product.mainImage} // Ensure this field name is correct
            alt={product.title} 
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/100x100/eeeeee/cccccc?text=Image'; 
            }}
          />
        </div>

      </div>
    </li>
  );
}

export default InboxItem;
