
import { useState } from 'react';
import { MessageList } from './MessageList';
import { UserRoster } from './UserRoster';
import { ChatInput } from './ChatInput';
import { ChatTabs } from './ChatTabs';
import { TopTrashTicker } from './TopTrashTicker';
import { Settings } from './Settings';
import { Users } from 'lucide-react';
import { ChatProvider } from '../context/ChatContext';

export const ChatWindow = () => {
  const [activeTab, setActiveTab] = useState('public');
  
  return (
    <ChatProvider>
      <div className="max-w-6xl mx-auto h-[80vh] my-8">
        <div className="retro-window h-full flex flex-col">
          <div className="title-bar flex items-center justify-between">
            <span>TrashTok Chat</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>37 people here</span>
            </div>
          </div>
          
          <Settings />
          <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <TopTrashTicker />
          
          <div className="flex-1 flex gap-2 p-2 min-h-0">
            <div className="flex-1 retro-inset bg-white">
              <MessageList />
            </div>
            <div className="w-48 retro-inset bg-white overflow-hidden">
              <UserRoster />
            </div>
          </div>
          
          <div className="p-2">
            <ChatInput />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};
