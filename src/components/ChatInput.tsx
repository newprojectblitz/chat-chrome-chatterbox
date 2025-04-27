
import React, { useState } from 'react';
import { useChatContext } from '../context/ChatContext';

export const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChatContext();

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
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
