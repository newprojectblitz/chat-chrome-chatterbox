
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onForgotPassword: () => void;
  onToggleMode: () => void;
  onSignIn: (identifier: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
}

export const LoginForm = ({ 
  onForgotPassword, 
  onToggleMode, 
  onSignIn, 
  onGoogleSignIn,
  isLoading 
}: LoginFormProps) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignIn(identifier, password);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Email or Username</Label>
        <Input
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full retro-button" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
      <Button
        type="button"
        onClick={onGoogleSignIn}
        className="w-full retro-button mt-2"
        disabled={isLoading}
      >
        Continue with Google
      </Button>
      <div className="flex flex-col gap-2 mt-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="w-full text-sm text-gray-600 hover:text-gray-900"
        >
          Forgot password?
        </button>
        <button
          type="button"
          onClick={onToggleMode}
          className="w-full text-sm text-gray-600 hover:text-gray-900"
        >
          Need an account? Sign up
        </button>
      </div>
    </form>
  );
};
