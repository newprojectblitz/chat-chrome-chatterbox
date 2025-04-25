
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircle, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FriendsListProps {
  friends: { id: string; name: string; isOnline: boolean }[];
  friendRequests: string[];
  onAddFriend: (username: string) => void;
  onAcceptFriend: (username: string) => void;
  onRejectFriend: (username: string) => void;
}

export const FriendsList = ({
  friends,
  friendRequests,
  onAddFriend,
  onAcceptFriend,
  onRejectFriend,
}: FriendsListProps) => {
  const [friendUsername, setFriendUsername] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const navigate = useNavigate();
  
  const handleAddFriend = () => {
    if (friendUsername.trim()) {
      onAddFriend(friendUsername);
      setFriendUsername('');
      setShowAddFriend(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Friends</h3>
        <Button 
          onClick={() => setShowAddFriend(!showAddFriend)} 
          className="retro-button py-1 px-2 flex items-center gap-1"
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </Button>
      </div>
      
      {showAddFriend && (
        <div className="p-2 retro-inset bg-gray-50">
          <Input
            type="text"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            placeholder="Username"
            className="mb-2"
          />
          <Button 
            onClick={handleAddFriend}
            className="w-full retro-button py-1"
          >
            Send Request
          </Button>
        </div>
      )}
      
      {friendRequests.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-bold">Friend Requests</Label>
          {friendRequests.map((req, i) => (
            <div key={i} className="flex items-center justify-between">
              <span>{req}</span>
              <div className="flex gap-1">
                <Button 
                  onClick={() => onAcceptFriend(req)}
                  className="retro-button py-0 px-1 flex items-center"
                >
                  <Check className="w-3 h-3 mr-1" /> Accept
                </Button>
                <Button 
                  onClick={() => onRejectFriend(req)}
                  className="retro-button py-0 px-1 flex items-center"
                >
                  <X className="w-3 h-3 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {friends.length > 0 ? (
        <div className="space-y-2">
          <Label className="text-sm font-bold">Your Friends</Label>
          {friends.map((friend) => (
            <div 
              key={friend.id} 
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{friend.name}</span>
              </div>
              <Button 
                onClick={() => navigate(`/direct-messages/${friend.id}`)}
                className="retro-button py-0 px-1 flex items-center"
              >
                <MessageCircle className="w-3 h-3 mr-1" /> Message
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">You haven't added any friends yet.</div>
      )}
    </div>
  );
};
