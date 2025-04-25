
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileSettingsProps {
  username: string;
  font: string;
  color: string;
  onUsernameChange: (value: string) => void;
  onFontChange: (value: string) => void;
  onColorChange: (value: string) => void;
  fontSize: string;
  onFontSizeChange: (value: string) => void;
  isBold: boolean;
  onBoldChange: (value: boolean) => void;
  isItalic: boolean;
  onItalicChange: (value: boolean) => void;
  isUnderline: boolean;
  onUnderlineChange: (value: boolean) => void;
}

export const ProfileSettings = ({
  username,
  font,
  color,
  onUsernameChange,
  onFontChange,
  onColorChange,
  fontSize,
  onFontSizeChange,
  isBold,
  onBoldChange,
  isItalic,
  onItalicChange,
  isUnderline,
  onUnderlineChange,
}: ProfileSettingsProps) => {
  const fonts = [
    { id: 'system', label: 'System Sans' },
    { id: 'comic', label: 'Comic Sans' },
    { id: 'typewriter', label: 'Typewriter' }
  ];

  const fontSizes = [
    { id: 'small', label: 'Small' },
    { id: 'regular', label: 'Regular' },
    { id: 'large', label: 'Large' }
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
        <Label htmlFor="fontSize">Font Size</Label>
        <select
          id="fontSize"
          value={fontSize}
          onChange={(e) => onFontSizeChange(e.target.value)}
          className="w-full retro-inset p-2"
        >
          {fontSizes.map(f => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label>Text Style</Label>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <input
              id="bold"
              type="checkbox"
              checked={isBold}
              onChange={(e) => onBoldChange(e.target.checked)}
              className="retro-inset"
            />
            <Label htmlFor="bold" className="font-bold">Bold</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="italic"
              type="checkbox"
              checked={isItalic}
              onChange={(e) => onItalicChange(e.target.checked)}
              className="retro-inset"
            />
            <Label htmlFor="italic" className="italic">Italic</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="underline"
              type="checkbox"
              checked={isUnderline}
              onChange={(e) => onUnderlineChange(e.target.checked)}
              className="retro-inset"
            />
            <Label htmlFor="underline" className="underline">Underline</Label>
          </div>
        </div>
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
