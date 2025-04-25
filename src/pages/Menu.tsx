
import { Link, Navigate } from 'react-router-dom';
import { Volleyball, Tv, Award, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Menu = () => {
  const { user, signOut } = useAuth();
  
  const channels = [
    { id: 'reality1', name: 'The Bachelor Live', type: 'Reality TV', icon: Award },
    { id: 'sports1', name: 'NBA Finals Game 1', type: 'Sports', icon: Volleyball },
    { id: 'reality2', name: 'Survivor Discussion', type: 'Reality TV', icon: Tv },
    { id: 'sports2', name: 'Premier League Chat', type: 'Sports', icon: Trophy },
  ];

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="retro-window">
          <div className="title-bar flex justify-between items-center">
            <span>TrashTok Channels</span>
            <span className="text-sm">
              Welcome, {user.email?.split('@')[0]}
            </span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <Link 
                    key={channel.id}
                    to={`/chat/${channel.id}`}
                    className="retro-button flex items-center gap-2 p-4 hover:shadow-[inset_1px_1px_#7F7F7F]"
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-bold">{channel.name}</div>
                      <div className="text-sm text-gray-600">{channel.type}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => signOut()} 
                className="retro-button flex items-center gap-2 w-full justify-center"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
