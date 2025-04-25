
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '@/context/ChatContext';

const DirectMessages = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useChatContext();
  
  // In a real app, you'd fetch friend data from an API
  const [friend] = useState({
    id: friendId || 'unknown',
    name: 'Friend',
    isOnline: true,
  });

  const channelId = `dm_${[currentUser?.id || 'me', friend.id].sort().join('_')}`;

  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-4xl mx-auto h-[80vh]">
        <div className="retro-window h-full flex flex-col">
          <div className="title-bar flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/profile')} 
                className="bg-transparent border-none text-white flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
              </button>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Chat with {friend.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>{friend.isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-hidden">
              <MessageList />
            </div>
            
            <div className="p-2">
              <ChatInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMessages;
