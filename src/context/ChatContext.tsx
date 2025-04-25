
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  getChannelMessages: (channelId: string) => ChatMessage[];
  reactToMessage: (messageId: string, reaction: 'like' | 'dislike') => void;
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
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>({
    reality1: [],
    sports1: [],
    reality2: [],
    sports2: [],
  });
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeTab, setActiveTab] = useState('public');
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string, { likes: number, dislikes: number }>>({});
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>({});

  useEffect(() => {
    const username = localStorage.getItem('chat-username');
    const savedSettings = localStorage.getItem('chat-settings');
    
    if (username) {
      const userSettings = savedSettings ? JSON.parse(savedSettings) : {};
      setCurrentUser({
        id: `user_${Date.now().toString(36)}`,
        name: username,
        font: userSettings.font || 'system',
        color: userSettings.color || '#000000',
        fontSize: userSettings.fontSize || 'regular',
        isBold: userSettings.isBold || false,
        isItalic: userSettings.isItalic || false,
        isUnderline: userSettings.isUnderline || false,
        nbaTeam: userSettings.nbaTeam || 'None',
        nhlTeam: userSettings.nhlTeam || 'None',
        mlbTeam: userSettings.mlbTeam || 'None',
        nflTeam: userSettings.nflTeam || 'None',
        isOnline: true
      });
    }
  }, []);

  const updateUserSettings = (
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
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
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
      };
      
      localStorage.setItem('chat-settings', JSON.stringify({ 
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
      }));
      setCurrentUser(updatedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('chat-username');
    localStorage.removeItem('chat-settings');
    setCurrentUser(null);
  };

  const sendMessage = (text: string, channelId: string) => {
    if (!text.trim() || !currentUser || !channelId) return;
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now().toString(36)}`,
      text,
      timestamp: Date.now(),
      sender: currentUser.name,
      font: currentUser.font,
      color: currentUser.color,
      fontSize: currentUser.fontSize || 'regular',
      isBold: currentUser.isBold || false,
      isItalic: currentUser.isItalic || false,
      isUnderline: currentUser.isUnderline || false
    };

    if (channelId.startsWith('dm_')) {
      // Handle direct messages
      setDirectMessages(prev => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), newMessage]
      }));
    } else {
      // Handle channel messages
      setChannelMessages(prev => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), newMessage]
      }));
    }
    
    setMessageReactions(prev => ({
      ...prev,
      [newMessage.id]: { likes: 0, dislikes: 0 }
    }));
  };

  const getChannelMessages = (channelId: string): ChatMessage[] => {
    if (channelId.startsWith('dm_')) {
      return directMessages[channelId] || [];
    }
    return channelMessages[channelId] || [];
  };

  const reactToMessage = (messageId: string, reaction: 'like' | 'dislike') => {
    setMessageReactions(prev => {
      const currentReactions = prev[messageId] || { likes: 0, dislikes: 0 };
      return {
        ...prev,
        [messageId]: {
          ...currentReactions,
          [reaction]: currentReactions[reaction] + 1
        }
      };
    });
  };

  const getTopMessage = (channelId: string): ChatMessage | null => {
    const messages = getChannelMessages(channelId);
    if (messages.length === 0) return null;
    
    let topMessageId = '';
    let maxLikes = -1;
    
    Object.entries(messageReactions).forEach(([messageId, reactions]) => {
      const messageInChannel = messages.some(msg => msg.id === messageId);
      if (messageInChannel && reactions.likes > maxLikes) {
        maxLikes = reactions.likes;
        topMessageId = messageId;
      }
    });
    
    if (topMessageId && maxLikes > 0) {
      return messages.find(msg => msg.id === topMessageId) || null;
    }
    
    return null;
  };

  return (
    <ChatContext.Provider value={{ 
      messages: [], 
      users, 
      activeTab, 
      currentUser,
      sendMessage, 
      setActiveTab,
      logout,
      updateUserSettings,
      getChannelMessages,
      reactToMessage,
      getTopMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
