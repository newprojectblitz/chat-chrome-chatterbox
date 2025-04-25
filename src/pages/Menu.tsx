
import { Link, Navigate } from 'react-router-dom';
import { Globe, Users, Gamepad2, Plane, BookOpen, ShoppingCart, Heart, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Menu = () => {
  const { user, signOut } = useAuth();
  
  const channels = [
    { 
      id: 'international', 
      name: 'International', 
      icon: Globe,
      gradient: 'from-[#4a9f45] to-[#2d7a29]'
    },
    { 
      id: 'games', 
      name: 'Games', 
      icon: Gamepad2,
      gradient: 'from-[#ff9966] to-[#ff5e62]'
    },
    { 
      id: 'travel', 
      name: 'Travel', 
      icon: Plane,
      gradient: 'from-[#e65c00] to-[#F9D423]'
    },
    { 
      id: 'learning', 
      name: 'Research & Learn', 
      icon: BookOpen,
      gradient: 'from-[#f46b45] to-[#eea849]'
    },
    { 
      id: 'lifestyle', 
      name: 'Lifestyle', 
      icon: Heart,
      gradient: 'from-[#e14fad] to-[#f9d423]'
    },
    { 
      id: 'shopping', 
      name: 'Shopping', 
      icon: ShoppingCart,
      gradient: 'from-[#00c6ff] to-[#0072ff]'
    },
    { 
      id: 'community', 
      name: 'Community', 
      icon: Users,
      gradient: 'from-[#4776E6] to-[#8E54E9]'
    },
    { 
      id: 'entertainment', 
      name: 'Entertainment', 
      icon: Music,
      gradient: 'from-[#654ea3] to-[#eaafc8]'
    },
  ];

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-[#e6e6e6] p-4 font-system">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-2 border-[#a0a0a0] shadow-md">
          <div className="bg-[#000080] text-white px-4 py-2 flex justify-between items-center">
            <span className="text-xl font-bold">TrashTok Channels</span>
            <span className="text-sm">
              Welcome, {user.email?.split('@')[0]}
            </span>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {channels.map((channel) => (
                <Link 
                  key={channel.id}
                  to={`/chat/${channel.id}`}
                  className={`
                    group relative overflow-hidden
                    border-2 border-gray-300 rounded
                    bg-gradient-to-r ${channel.gradient}
                    hover:shadow-lg transition-shadow
                    p-4
                  `}
                >
                  <div className="flex items-center gap-3 text-white">
                    <channel.icon className="w-6 h-6" />
                    <span className="text-lg font-bold tracking-wide">{channel.name}</span>
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => signOut()} 
                className="
                  w-full px-4 py-2
                  bg-gradient-to-r from-[#d02618] to-[#ff4b1f]
                  text-white font-bold
                  border-2 border-gray-300 rounded
                  hover:shadow-lg transition-shadow
                  flex items-center justify-center gap-2
                "
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
