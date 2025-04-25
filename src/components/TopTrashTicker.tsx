
import { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useParams } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';

export const TopTrashTicker = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { getTopMessage } = useChatContext();
  const [topMessage, setTopMessage] = useState<any>(null);

  useEffect(() => {
    // Initial fetch of top message
    if (channelId) {
      const message = getTopMessage(channelId);
      setTopMessage(message);
    }
    
    // Set up an interval to check for top message changes
    const interval = setInterval(() => {
      if (channelId) {
        const message = getTopMessage(channelId);
        setTopMessage(message);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [channelId, getTopMessage]);

  // Fall back to default messages if there's no top message
  const defaultMessages = [
    { text: "OMG did you see that elimination?! 😱", font: 'comic', color: '#FF0000' },
    { text: "They totally deserved to go home!", font: 'system', color: '#0000FF' },
    { text: "Next episode's gonna be wild", font: 'typewriter', color: '#008000' },
  ];

  const [defaultIndex, setDefaultIndex] = useState(0);

  useEffect(() => {
    if (!topMessage) {
      const timer = setInterval(() => {
        setDefaultIndex((prev) => (prev + 1) % defaultMessages.length);
      }, 15000);
      
      return () => clearInterval(timer);
    }
  }, [topMessage]);

  const message = topMessage || defaultMessages[defaultIndex];

  return (
    <div className="bg-accent text-white p-1 overflow-hidden whitespace-nowrap">
      <div
        className="animate-[marquee_20s_linear_infinite] flex items-center"
        style={{
          fontFamily: message.font === 'comic' ? 'Comic Neue' : 
                    message.font === 'typewriter' ? 'Courier New' : 
                    'system-ui',
          color: message.color
        }}
      >
        {topMessage && (
          <ThumbsUp className="w-4 h-4 mr-2" style={{ color: message.color }} />
        )}
        <span>{message.text}</span>
        {topMessage && (
          <span className="ml-2 text-xs">- {topMessage.sender}</span>
        )}
      </div>
    </div>
  );
};
