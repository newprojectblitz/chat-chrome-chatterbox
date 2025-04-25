
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileSettingsProps {
  username: string;
  font: string;
  color: string;
  onUsernameChange: (value: string) => void;
  onFontChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

export const ProfileSettings = ({
  username,
  font,
  color,
  onUsernameChange,
  onFontChange,
  onColorChange,
}: ProfileSettingsProps) => {
  const fonts = [
    { id: 'system', label: 'System Sans' },
    { id: 'comic', label: 'Comic Sans' },
    { id: 'typewriter', label: 'Typewriter' }
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="font">Font Style</Label>
        <select
          id="font"
          value={font}
          onChange={(e) => onFontChange(e.target.value)}
          className="w-full retro-inset p-2"
        >
          {fonts.map(f => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="color">Text Color</Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-10 retro-inset"
        />
      </div>
    </div>
  );
};
