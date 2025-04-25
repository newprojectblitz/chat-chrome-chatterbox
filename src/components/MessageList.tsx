
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
  const [reactions, setReactions] = useState<Record<string, { likes: number, dislikes: number }>>({});
  
  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, user_id')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Fetch user profiles separately to get usernames
      const userIds = [...new Set(data.map(message => message.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Create a lookup for usernames by user_id
      const usernameLookup = profiles.reduce((acc: Record<string, string>, profile) => {
        acc[profile.id] = profile.username;
        return acc;
      }, {});

      setMessages(data.map(message => ({
        id: message.id,
        text: message.text,
        sender: usernameLookup[message.user_id] || 'Unknown',
        timestamp: new Date(message.created_at).getTime(),
        font: message.font,
        color: message.color,
        fontSize: message.font_size,
        isBold: message.is_bold,
        isItalic: message.is_italic,
        isUnderline: message.is_underline
      })));

      // Fetch reactions for these messages
      await fetchReactions(data.map(m => m.id));
    };

    const fetchReactions = async (messageIds: string[]) => {
      if (messageIds.length === 0) return;

      const { data, error } = await supabase
        .from('reactions')
        .select('message_id, reaction_type')
        .in('message_id', messageIds);

      if (error) {
        console.error('Error fetching reactions:', error);
        return;
      }

      // Count likes and dislikes for each message
      const reactionCounts: Record<string, { likes: number, dislikes: number }> = {};
      data.forEach(reaction => {
        if (!reactionCounts[reaction.message_id]) {
          reactionCounts[reaction.message_id] = { likes: 0, dislikes: 0 };
        }
        if (reaction.reaction_type === 'like') {
          reactionCounts[reaction.message_id].likes += 1;
        } else if (reaction.reaction_type === 'dislike') {
          reactionCounts[reaction.message_id].dislikes += 1;
        }
      });

      setReactions(reactionCounts);
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
          // Fetch the username for this user
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.user_id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }

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
    
    // Update local state with the new reaction
    setReactions(prev => {
      const current = prev[messageId] || { likes: 0, dislikes: 0 };
      return {
        ...prev,
        [messageId]: {
          ...current,
          [reaction === 'like' ? 'likes' : 'dislikes']: current[reaction === 'like' ? 'likes' : 'dislikes'] + 1
        }
      };
    });
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
                    className="p-1 hover:bg-gray-200 rounded flex items-center gap-1"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {reactions[message.id]?.likes > 0 && <span>{reactions[message.id]?.likes}</span>}
                  </button>
                  <button 
                    onClick={() => handleReaction(message.id, 'dislike')}
                    className="p-1 hover:bg-gray-200 rounded flex items-center gap-1"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    {reactions[message.id]?.dislikes > 0 && <span>{reactions[message.id]?.dislikes}</span>}
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
