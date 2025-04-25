
import { Navigate } from 'react-router-dom';
import { Volleyball, Tv, Award, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { ChannelList } from '@/components/menu/ChannelList';

const Menu = () => {
  const { user, signOut, isLoading } = useAuth();
  
  const channels = [
    { id: 'reality1', name: 'The Bachelor Live', type: 'Reality TV', icon: Award },
    { id: 'sports1', name: 'NBA Finals Game 1', type: 'Sports', icon: Volleyball },
    { id: 'reality2', name: 'Survivor Discussion', type: 'Reality TV', icon: Tv },
    { id: 'sports2', name: 'Premier League Chat', type: 'Sports', icon: Trophy },
  ];

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting to sign out from Menu");
      await signOut();
      // Note: Navigation will now happen via the auth state change listener in AuthContext
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

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
            <ChannelList channels={channels} />
            <MenuHeader 
              username={user.email?.split('@')[0] || ''}
              onSignOut={handleSignOut}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
