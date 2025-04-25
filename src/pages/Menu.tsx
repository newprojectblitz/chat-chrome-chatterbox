
import { Navigate } from 'react-router-dom';
import { Volleyball, Tv, Award, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { ChannelList } from '@/components/menu/ChannelList';

const Menu = () => {
  // Try-catch block to safely access auth context
  let user = null;
  let signOut = async () => {};
  let isLoading = true;

  try {
    const auth = useAuth();
    user = auth.user;
    signOut = auth.signOut;
    isLoading = auth.isLoading;
  } catch (error) {
    console.error("Auth context error:", error);
    // If auth context fails, redirect to auth page
    return <Navigate to="/auth" replace />;
  }
  
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
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to auth page if no user is logged in
  if (!user) {
    console.log("No user found, redirecting to auth");
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
