
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Volleyball, Tv, Award, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { ChannelList } from '@/components/menu/ChannelList';

const Menu = () => {
  const { user, signOut, isLoading, session, profile } = useAuth();

  // Add console logs to help debug the authentication flow
  useEffect(() => {
    console.log("Menu page: user state:", user ? "Logged in" : "Not logged in");
    console.log("Menu page: session state:", session ? "Active" : "None");
    console.log("Menu page: loading state:", isLoading);
    console.log("Menu page: profile:", profile);
  }, [user, session, isLoading, profile]);

  const channels = [
    { id: 'reality1', name: 'The Bachelor Live', type: 'Reality TV', icon: Award },
    { id: 'sports1', name: 'NBA Finals Game 1', type: 'Sports', icon: Volleyball },
    { id: 'reality2', name: 'Survivor Discussion', type: 'Reality TV', icon: Tv },
    { id: 'sports2', name: 'Premier League Chat', type: 'Sports', icon: Trophy },
  ];

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      // Navigation will happen via the auth state change listener
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  // Display loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading menu...</div>
      </div>
    );
  }

  // We don't need to check for user authentication here anymore since RequireAuth handles it

  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="retro-window">
          <div className="title-bar flex justify-between items-center">
            <span>TrashTok Channels</span>
            <span className="text-sm">
              Welcome, {profile?.username || user?.email?.split('@')[0]}
            </span>
          </div>
          <div className="p-4">
            <ChannelList channels={channels} />
            <MenuHeader 
              username={profile?.username || user?.email?.split('@')[0] || ''}
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
