
import React, { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '../types/chat';

export const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { reactToMessage } = useChatContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data.map(message => ({
        id: message.id,
        text: message.text,
        sender: message.profiles.username,
        timestamp: new Date(message.created_at).getTime(),
        font: message.font,
        color: message.color,
        fontSize: message.font_size,
        isBold: message.is_bold,
        isItalic: message.is_italic,
        isUnderline: message.is_underline
      })));
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage: ChatMessage = {
            id: payload.new.id,
            text: payload.new.text,
            sender: profile?.username || 'Unknown',
            timestamp: new Date(payload.new.created_at).getTime(),
            font: payload.new.font,
            color: payload.new.color,
            fontSize: payload.new.font_size,
            isBold: payload.new.is_bold,
            isItalic: payload.new.is_italic,
            isUnderline: payload.new.is_underline
          };

          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  const handleReaction = async (messageId: string, reaction: 'like' | 'dislike') => {
    await reactToMessage(messageId, reaction);
  };

  return (
    <div className="h-full overflow-y-auto p-2">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-2">
              <span className="font-bold whitespace-nowrap">{message.sender}:</span>
              <div className="flex flex-1 items-center gap-2">
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
                <div className="flex items-center gap-2 ml-2 text-gray-500 text-xs">
                  <button 
                    onClick={() => handleReaction(message.id, 'like')}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleReaction(message.id, 'dislike')}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                  <span>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
