
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
            <div key={message.id} className="flex items-center justify-between gap-2 p-2 retro-inset bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold whitespace-nowrap">{message.sender}:</span>
                <span
                  style={{
                    fontFamily: message.font === 'comic' ? 'Comic Neue' :
                              message.font === 'typewriter' ? 'Courier New' :
                              'system-ui',
                    color: message.color
                  }}
                  className="truncate"
                >
                  {message.text}
                </span>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
