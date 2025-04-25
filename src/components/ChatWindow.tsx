
import { useState } from 'react';
import { MessageList } from './MessageList';
import { UserRoster } from './UserRoster';
import { ChatInput } from './ChatInput';
import { TopTrashTicker } from './TopTrashTicker';
import { Settings } from './Settings';
import { Users, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export const ChatWindow = () => {
  const [activeTab, setActiveTab] = useState('public');
  const { channelId } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="max-w-6xl mx-auto h-[80vh] my-8">
      <div className="retro-window h-full flex flex-col">
        <div className="title-bar flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/menu')} 
              className="bg-transparent border-none text-white flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>
            <span>TrashTok Chat - {channelId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>37 people here</span>
          </div>
        </div>
        
        <Settings activeTab={activeTab} onTabChange={setActiveTab} />
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
  );
};
