
import { useState, FormEvent } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useParams } from 'react-router-dom';
import { FontControls } from './FontControls';

export const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, currentUser } = useChatContext();
  const { channelId } = useParams<{ channelId: string }>();
  
  // Initialize state with values from currentUser or defaults
  const [isBold, setIsBold] = useState(currentUser?.isBold || false);
  const [isItalic, setIsItalic] = useState(currentUser?.isItalic || false);
  const [isUnderline, setIsUnderline] = useState(currentUser?.isUnderline || false);
  const [font, setFont] = useState(currentUser?.font || 'system');
  const [color, setColor] = useState(currentUser?.color || '#000000');
  const [fontSize, setFontSize] = useState(currentUser?.fontSize || 'regular');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && channelId && currentUser) {
      sendMessage(message, channelId);
      setMessage('');
    }
  };

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="retro-inset w-full p-2"
          placeholder="Type your message..."
          style={{
            fontFamily: font === 'comic' ? 'Comic Neue' : 
                       font === 'typewriter' ? 'Courier New' : 
                       'system-ui',
            color: color,
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textDecoration: isUnderline ? 'underline' : 'none',
            fontSize: fontSize === 'small' ? '0.875rem' : 
                     fontSize === 'large' ? '1.125rem' : 
                     '1rem'
          }}
        />
        <button type="submit" className="retro-button px-4">Send</button>
      </form>
      
      <FontControls
        onFontChange={handleFontChange}
        onColorChange={handleColorChange}
        onBoldToggle={() => setIsBold(!isBold)}
        onItalicToggle={() => setIsItalic(!isItalic)}
        onUnderlineToggle={() => setIsUnderline(!isUnderline)}
        onFontSizeChange={handleFontSizeChange}
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        currentFont={font}
        currentColor={color}
        currentFontSize={fontSize}
      />
    </div>
  );
};
