
import React, { useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { UserPlus } from 'lucide-react';

export const UserRoster = () => {
  const { users } = useChatContext();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);

  const handleAddFriend = () => {
    if (friendUsername && !friends.includes(friendUsername) && !friendRequests.includes(friendUsername)) {
      setFriendRequests([...friendRequests, friendUsername]);
      setFriendUsername('');
      setShowAddFriend(false);
    }
  };

  const acceptFriendRequest = (username: string) => {
    setFriends([...friends, username]);
    setFriendRequests(friendRequests.filter(req => req !== username));
  };

  return (
    <div className="h-full overflow-y-auto p-2">
      <div className="mb-2 flex justify-between items-center">
        <div className="font-bold">Online Users</div>
        <button 
          onClick={() => setShowAddFriend(!showAddFriend)} 
          className="text-xs retro-button py-1 px-2 flex items-center gap-1"
        >
          <UserPlus className="w-3 h-3" />
          Add
        </button>
      </div>
      
      {showAddFriend && (
        <div className="mb-2 p-2 retro-inset bg-gray-50">
          <input
            type="text"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            placeholder="Username"
            className="w-full retro-inset text-xs p-1 mb-1"
          />
          <button 
            onClick={handleAddFriend}
            className="w-full text-xs retro-button py-1"
          >
            Send Request
          </button>
        </div>
      )}
      
      {friendRequests.length > 0 && (
        <div className="mb-2">
          <div className="text-xs font-bold mb-1">Friend Requests</div>
          {friendRequests.map((req, i) => (
            <div key={i} className="flex items-center justify-between text-xs mb-1">
              <span>{req}</span>
              <button 
                onClick={() => acceptFriendRequest(req)}
                className="text-xs retro-button py-0 px-1"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}
      
      {friends.length > 0 && (
        <div className="mb-2">
          <div className="text-xs font-bold mb-1">Friends</div>
          {friends.map((friend, i) => (
            <div key={i} className="flex items-center gap-2 text-xs mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{friend}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-2">
        <div className="text-xs font-bold mb-1">All Users</div>
        {users.length === 0 ? (
          <div className="text-center text-gray-500 text-xs">No users online</div>
        ) : (
          <div className="space-y-1">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center gap-2 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span
                  style={{ 
                    fontFamily: user.font === 'comic' ? 'Comic Neue' : 
                              user.font === 'typewriter' ? 'Courier New' : 
                              'system-ui',
                    color: user.color 
                  }}
                >
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
