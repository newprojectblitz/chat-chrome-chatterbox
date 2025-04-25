
import { Link } from 'react-router-dom';
import { LogOut, UserCircle } from 'lucide-react';

interface MenuHeaderProps {
  username: string;
  onSignOut: (e: React.MouseEvent) => Promise<void>;
  isLoading: boolean;
}

export const MenuHeader = ({ username, onSignOut, isLoading }: MenuHeaderProps) => {
  return (
    <div className="flex justify-between">
      <div className="mt-8 flex gap-2">
        <Link 
          to="/profile" 
          className="retro-button flex items-center gap-2 flex-1 justify-center"
        >
          <UserCircle className="w-5 h-5" />
          My Profile
        </Link>
        
        <button 
          onClick={onSignOut} 
          className="retro-button flex items-center gap-2 flex-1 justify-center"
          disabled={isLoading}
        >
          <LogOut className="w-5 h-5" />
          {isLoading ? 'Signing Out...' : 'Log Out'}
        </button>
      </div>
    </div>
  );
};
