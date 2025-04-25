
import React from 'react';
import { useChatContext } from '../context/ChatContext';

export const UserRoster = () => {
  const { users } = useChatContext();

  return (
    <div className="h-full overflow-y-auto p-2">
      <div className="font-bold mb-2">Online Users</div>
      {users.length === 0 ? (
        <div className="text-center text-gray-500">No users online</div>
      ) : (
        <div className="space-y-1">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center gap-2"
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
  );
};
