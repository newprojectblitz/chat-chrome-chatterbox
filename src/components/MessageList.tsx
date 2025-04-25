
import React from 'react';
import { useChatContext } from '../context/ChatContext';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { getChannelMessages, reactToMessage } = useChatContext();
  
  const messages = channelId ? getChannelMessages(channelId) : [];

  const handleReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    reactToMessage(messageId, reaction);
  };

  return (
    <div className="h-full overflow-y-auto p-2">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet</div>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message.id} className="flex items-center gap-2">
              <span className="font-bold whitespace-nowrap">{message.sender}:</span>
              <span
                style={{
                  fontFamily: message.font === 'comic' ? 'Comic Neue' :
                            message.font === 'typewriter' ? 'Courier New' :
                            'system-ui',
                  color: message.color,
                  fontWeight: message.isBold ? 'bold' : 'normal',
                  fontStyle: message.isItalic ? 'italic' : 'normal',
                  textDecoration: message.isUnderline ? 'underline' : 'none',
                  fontSize: message.fontSize === 'small' ? '0.875rem' : 
                           message.fontSize === 'large' ? '1.125rem' : 
                           '1rem'
                }}
                className="flex-1"
              >
                {message.text}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleReaction(message.id, 'like')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleReaction(message.id, 'dislike')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
