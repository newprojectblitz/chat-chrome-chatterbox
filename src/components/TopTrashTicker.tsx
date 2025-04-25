
import { useEffect, useState } from 'react';

const topMessages = [
  { text: "OMG did you see that elimination?! 😱", font: 'comic', color: '#FF0000' },
  { text: "They totally deserved to go home!", font: 'system', color: '#0000FF' },
  { text: "Next episode's gonna be wild", font: 'typewriter', color: '#008000' },
];

export const TopTrashTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topMessages.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const message = topMessages[currentIndex];

  return (
    <div className="bg-accent text-white p-1 overflow-hidden whitespace-nowrap">
      <div
        className="animate-[marquee_20s_linear_infinite]"
        style={{
          fontFamily: message.font === 'comic' ? 'Comic Neue' : 
                     message.font === 'typewriter' ? 'Courier New' : 
                     'system-ui',
          color: message.color
        }}
      >
        {message.text}
      </div>
    </div>
  );
};
