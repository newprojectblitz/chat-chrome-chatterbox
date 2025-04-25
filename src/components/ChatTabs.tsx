
import { List } from 'lucide-react';

export const ChatTabs = ({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { id: 'public', label: 'Public' },
    { id: 'friends', label: 'Friends' },
    { id: 'fans', label: 'Fans' }
  ];

  return (
    <div className="flex gap-1 p-2 bg-window border-b-2 border-bevel-dark">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`retro-button flex items-center gap-2 ${
            activeTab === tab.id ? 'shadow-[inset_1px_1px_#7F7F7F]' : ''
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <List className="w-4 h-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
