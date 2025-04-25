
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface PasswordSettingsProps {
  passwordReset: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onPasswordChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PasswordSettings = ({
  passwordReset,
  onPasswordChange,
  onSubmit,
}: PasswordSettingsProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center mb-4">
        <Settings className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-bold">Account Settings</h2>
      </div>

      <h3 className="font-bold">Change Password</h3>
      
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={passwordReset.currentPassword}
          onChange={(e) => onPasswordChange('currentPassword', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={passwordReset.newPassword}
          onChange={(e) => onPasswordChange('newPassword', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={passwordReset.confirmPassword}
          onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="retro-button">
        Update Password
      </Button>
    </form>
  );
};
