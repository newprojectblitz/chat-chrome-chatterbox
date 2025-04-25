
import React, { useState } from 'react';

export const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Placeholder for send logic
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 retro-button p-2"
        placeholder="Type your message..."
      />
      <button 
        onClick={handleSend} 
        className="retro-button px-4 py-2"
      >
        Send
      </button>
    </div>
  );
};
