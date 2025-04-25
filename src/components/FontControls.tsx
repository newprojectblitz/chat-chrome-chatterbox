
import React from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FontControlsProps {
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onBoldToggle: () => void;
  onItalicToggle: () => void;
  onUnderlineToggle: () => void;
  onFontSizeChange: (size: string) => void;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  currentFont: string;
  currentColor: string;
  currentFontSize: string;
}

export const FontControls = ({
  onFontChange,
  onColorChange,
  onBoldToggle,
  onItalicToggle,
  onUnderlineToggle,
  onFontSizeChange,
  isBold,
  isItalic,
  isUnderline,
  currentFont,
  currentColor,
  currentFontSize
}: FontControlsProps) => {
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00'];
  const fonts = ['system', 'comic', 'typewriter'];
  const fontSizes = ['small', 'regular', 'large'];

  return (
    <div className="flex items-center gap-2 p-2 border-t border-gray-200">
      <ToggleGroup type="multiple" className="flex gap-1">
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onClick={onBoldToggle}
          data-state={isBold ? "on" : "off"}
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onClick={onItalicToggle}
          data-state={isItalic ? "on" : "off"}
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-label="Toggle underline"
          onClick={onUnderlineToggle}
          data-state={isUnderline ? "on" : "off"}
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8">Font</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fonts.map((font) => (
            <DropdownMenuItem
              key={font}
              onClick={() => onFontChange(font)}
              className={currentFont === font ? "bg-accent" : ""}
            >
              {font.charAt(0).toUpperCase() + font.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="h-8"
            style={{ backgroundColor: currentColor }}
          >
            Color
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="grid grid-cols-4 gap-1 p-1">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => onColorChange(color)}
                className="w-6 h-6 rounded cursor-pointer hover:opacity-80"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8">Size</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fontSizes.map((size) => (
            <DropdownMenuItem
              key={size}
              onClick={() => onFontSizeChange(size)}
              className={currentFontSize === size ? "bg-accent" : ""}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
