
import React from 'react';
import { useChatContext } from '../context/ChatContext';

export const MessageList = () => {
  const { messages } = useChatContext();

  return (
    <div className="h-full overflow-y-auto p-2">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet</div>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message.id} className="p-2 retro-inset bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="font-bold">{message.sender}:</span>
                <span className="text-gray-400 text-xs">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div 
                style={{ 
                  fontFamily: message.font === 'comic' ? 'Comic Neue' : 
                            message.font === 'typewriter' ? 'Courier New' : 
                            'system-ui',
                  color: message.color 
                }}
                className="mt-1"
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
