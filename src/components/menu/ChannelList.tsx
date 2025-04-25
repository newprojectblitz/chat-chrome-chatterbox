
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  type: string;
  icon: LucideIcon;
}

interface ChannelListProps {
  channels: Channel[];
}

export const ChannelList = ({ channels }: ChannelListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {channels.map((channel) => {
        const Icon = channel.icon;
        return (
          <Link 
            key={channel.id}
            to={`/chat/${channel.id}`}
            className="retro-button flex items-center gap-2 p-4 hover:shadow-[inset_1px_1px_#7F7F7F]"
          >
            <Icon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-bold">{channel.name}</div>
              <div className="text-sm text-gray-600">{channel.type}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
