
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, ChatUser } from '../types/chat';

interface ChatContextType {
  messages: ChatMessage[];
  users: ChatUser[];
  activeTab: string;
  currentUser: ChatUser | null;
  sendMessage: (text: string) => void;
  setActiveTab: (tab: string) => void;
  logout: () => void;
  updateUserSettings: (font: string, color: string) => void;
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([
    { id: '1', name: 'TrashQueen', font: 'comic', color: '#FF0000', isOnline: true },
    { id: '2', name: 'RealityFan99', font: 'system', color: '#0000FF', isOnline: true },
    { id: '3', name: 'TVGossiper', font: 'typewriter', color: '#008000', isOnline: true },
  ]);
  const [activeTab, setActiveTab] = useState('public');
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);

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
        isOnline: true
      });
    }
  }, []);

  const updateUserSettings = (font: string, color: string) => {
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        font, 
        color 
      };
      
      // Save to localStorage
      localStorage.setItem('chat-settings', JSON.stringify({ font, color }));
      
      // Update current user
      setCurrentUser(updatedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('chat-username');
    localStorage.removeItem('chat-settings');
    setCurrentUser(null);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || !currentUser) return;
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now().toString(36)}`,
      text,
      timestamp: Date.now(),
      sender: currentUser.name,
      font: currentUser.font,
      color: currentUser.color,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      users, 
      activeTab, 
      currentUser,
      sendMessage, 
      setActiveTab,
      logout,
      updateUserSettings
    }}>
      {children}
    </ChatContext.Provider>
  );
};
