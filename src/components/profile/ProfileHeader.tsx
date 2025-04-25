
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-4">
      <button 
        onClick={() => navigate('/menu')} 
        className="bg-transparent border-none text-white flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
      </button>
      <div className="flex items-center">
        <User className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-bold">User Profile</h2>
      </div>
    </div>
  );
};
