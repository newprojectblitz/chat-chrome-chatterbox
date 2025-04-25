
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, ChatUser } from '../types/chat';

interface ChatContextType {
  messages: ChatMessage[];
  users: ChatUser[];
  activeTab: string;
  sendMessage: (text: string) => void;
  setActiveTab: (tab: string) => void;
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
    // Add more mock users
  ]);
  const [activeTab, setActiveTab] = useState('public');
  const [userId] = useState(`user_${Date.now().toString(36)}`);
  
  // Load saved settings and username
  useEffect(() => {
    // Load username
    const username = localStorage.getItem('chat-username');
    
    // Load settings
    const savedSettings = localStorage.getItem('chat-settings');
    if (savedSettings) {
      try {
        const { font, color } = JSON.parse(savedSettings);
        // We'll use these settings for the user's sent messages
      } catch (e) {
        console.error('Failed to parse saved settings');
      }
    }
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Get user settings
    const savedSettings = localStorage.getItem('chat-settings');
    let font = 'system';
    let color = '#000000';
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        font = settings.font || font;
        color = settings.color || color;
      } catch (e) {
        console.error('Failed to parse saved settings');
      }
    }

    // Get username from localStorage
    const username = localStorage.getItem('chat-username') || `User_${userId.slice(-4)}`;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now().toString(36)}`,
      text,
      timestamp: Date.now(),
      sender: username,
      font,
      color,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // In a real app, you'd send this message to your backend/Firebase here
    console.log('Message sent:', newMessage);
  };

  return (
    <ChatContext.Provider value={{ messages, users, activeTab, sendMessage, setActiveTab }}>
      {children}
    </ChatContext.Provider>
  );
};
