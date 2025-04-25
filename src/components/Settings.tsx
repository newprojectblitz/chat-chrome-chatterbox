
import { useEffect, useState } from 'react';

const fonts = [
  { id: 'system', label: 'System Sans', className: 'font-system' },
  { id: 'comic', label: 'Comic Sans', className: 'font-comic' },
  { id: 'typewriter', label: 'Typewriter', className: 'font-typewriter' }
];

export const Settings = () => {
  const [font, setFont] = useState('system');
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const savedSettings = localStorage.getItem('chat-settings');
    if (savedSettings) {
      const { font: savedFont, color: savedColor } = JSON.parse(savedSettings);
      setFont(savedFont);
      setColor(savedColor);
    }
  }, []);

  const saveSettings = (newFont: string, newColor: string) => {
    localStorage.setItem('chat-settings', JSON.stringify({ font: newFont, color: newColor }));
    setFont(newFont);
    setColor(newColor);
  };

  return (
    <div className="bg-window p-2 border-b-2 border-bevel-dark">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Font:</label>
          <select 
            value={font}
            onChange={(e) => saveSettings(e.target.value, color)}
            className="retro-button text-sm"
          >
            {fonts.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Color:</label>
          <input 
            type="color" 
            value={color}
            onChange={(e) => saveSettings(font, e.target.value)}
            className="retro-button h-8 w-12 p-0"
          />
        </div>
      </div>
    </div>
  );
};
