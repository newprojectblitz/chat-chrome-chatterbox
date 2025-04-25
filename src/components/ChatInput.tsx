
import { useState, FormEvent } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useParams } from 'react-router-dom';

export const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChatContext();
  const { channelId } = useParams<{ channelId: string }>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && channelId) {
      sendMessage(message, channelId);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="retro-inset w-full p-2"
        placeholder="Type your message..."
      />
      <button type="submit" className="retro-button px-4">Send</button>
    </form>
  );
};
