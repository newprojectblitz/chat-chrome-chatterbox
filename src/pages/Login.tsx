
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('chat-username', username);
      navigate('/menu');
    }
  };

  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="retro-window">
          <div className="title-bar">
            <span>TrashTok Login</span>
          </div>
          <form onSubmit={handleLogin} className="p-4 space-y-4">
            <div>
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="retro-inset w-full p-2"
                maxLength={20}
                required
              />
            </div>
            <button type="submit" className="retro-button w-full">
              Enter Chat
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
