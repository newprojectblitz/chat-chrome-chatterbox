
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatUser } from '../types/chat';

interface ChatContextType {
  messages: ChatMessage[];
  users: ChatUser[];
  activeTab: string;
  currentUser: ChatUser | null;
  sendMessage: (text: string, channelId: string) => void;
  setActiveTab: (tab: string) => void;
  logout: () => void;
  updateUserSettings: (
    font: string, 
    color: string, 
    fontSize?: string, 
    isBold?: boolean, 
    isItalic?: boolean, 
    isUnderline?: boolean,
    nbaTeam?: string,
    nhlTeam?: string,
    mlbTeam?: string,
    nflTeam?: string
  ) => void;
  getChannelMessages: (channelId: string) => Promise<ChatMessage[]>;
  reactToMessage: (messageId: string, reaction: 'like' | 'dislike') => Promise<void>;
  getTopMessage: (channelId: string) => ChatMessage | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>({});
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeTab, setActiveTab] = useState('public');
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser({
            id: session.user.id,
            name: profile.username,
            font: 'system',
            color: '#000000',
            fontSize: 'regular',
            nbaTeam: profile.nba_team,
            nhlTeam: profile.nhl_team,
            mlbTeam: profile.mlb_team,
            nflTeam: profile.nfl_team,
            isOnline: true
          });
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
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

            setChannelMessages(prev => ({
              ...prev,
              [payload.new.channel_id]: [...(prev[payload.new.channel_id] || []), newMessage]
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (text: string, channelId: string) => {
    if (!text.trim() || !currentUser) return;

    const messageData = {
      text,
      user_id: currentUser.id,
      channel_id: channelId,
      font: currentUser.font,
      color: currentUser.color,
      font_size: currentUser.fontSize,
      is_bold: currentUser.isBold,
      is_italic: currentUser.isItalic,
      is_underline: currentUser.isUnderline
    };

    const { error } = await supabase
      .from('messages')
      .insert([messageData]);

    if (error) {
      console.error('Error sending message:', error);
    }
  };

  const reactToMessage = async (messageId: string, reaction: 'like' | 'dislike') => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('reactions')
      .insert([{
        message_id: messageId,
        user_id: currentUser.id,
        reaction_type: reaction
      }]);

    if (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const getChannelMessages = async (channelId: string): Promise<ChatMessage[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, user_id')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    // Fetch user profiles separately to get usernames
    const userIds = [...new Set(data.map(message => message.user_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return [];
    }

    // Create a lookup for usernames by user_id
    const usernameLookup = profiles.reduce((acc: Record<string, string>, profile) => {
      acc[profile.id] = profile.username;
      return acc;
    }, {});

    return data.map(message => ({
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
    }));
  };

  const updateUserSettings = async (
    font: string,
    color: string,
    fontSize = 'regular',
    isBold = false,
    isItalic = false,
    isUnderline = false,
    nbaTeam = 'None',
    nhlTeam = 'None',
    mlbTeam = 'None',
    nflTeam = 'None'
  ) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        nba_team: nbaTeam,
        nhl_team: nhlTeam,
        mlb_team: mlbTeam,
        nfl_team: nflTeam
      })
      .eq('id', currentUser.id);

    if (error) {
      console.error('Error updating user settings:', error);
      return;
    }

    setCurrentUser(prev => prev ? {
      ...prev,
      font,
      color,
      fontSize,
      isBold,
      isItalic,
      isUnderline,
      nbaTeam,
      nhlTeam,
      mlbTeam,
      nflTeam
    } : null);
  };

  const getTopMessage = (channelId: string): ChatMessage | null => {
    const messages = channelMessages[channelId] || [];
    return messages.length > 0 ? messages[messages.length - 1] : null;
  };

  return (
    <ChatContext.Provider value={{
      messages: [],
      users,
      activeTab,
      currentUser,
      sendMessage,
      setActiveTab,
      logout: () => {},
      updateUserSettings,
      getChannelMessages,
      reactToMessage,
      getTopMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
