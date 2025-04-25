
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";

interface AvatarUploadProps {
  onAvatarChange: (file: File) => void;
  avatarUrl?: string;
}

export const AvatarUpload = ({ onAvatarChange, avatarUrl }: AvatarUploadProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="avatar" className="flex items-center gap-2">
        <Camera className="h-4 w-4" />
        Profile Picture
      </Label>
      <Input
        id="avatar"
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAvatarChange(e.target.files[0]);
          }
        }}
        className="retro-inset"
      />
      {avatarUrl && (
        <div className="mt-2">
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
};
