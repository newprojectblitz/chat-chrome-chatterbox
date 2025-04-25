
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const fonts = [
  { id: 'system', label: 'System Sans', className: 'font-system' },
  { id: 'comic', label: 'Comic Sans', className: 'font-comic' },
  { id: 'typewriter', label: 'Typewriter', className: 'font-typewriter' }
];

export const Settings = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
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

  const tabs = [
    { id: 'public', label: 'Public' },
    { id: 'friends', label: 'Friends' },
    { id: 'fans', label: 'Fans' }
  ];

  return (
    <div className="bg-window p-2 border-b-2 border-bevel-dark">
      <div className="flex items-center justify-between gap-4">
        <Link to="/menu" className="retro-button p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`retro-button px-4 py-2 ${
                activeTab === tab.id ? 'shadow-[inset_1px_1px_#7F7F7F]' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

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
    </div>
  );
};
