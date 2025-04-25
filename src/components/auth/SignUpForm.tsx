
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignUpFormProps {
  onToggleMode: () => void;
  onSignUp: (email: string, password: string, username: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
}

export const SignUpForm = ({ 
  onToggleMode, 
  onSignUp, 
  onGoogleSignIn,
  isLoading 
}: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignUp(email, password, username);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </Button>
      <Button
        type="button"
        onClick={onGoogleSignIn}
        className="w-full retro-button mt-2"
        disabled={isLoading}
      >
        Continue with Google
      </Button>
      <button
        type="button"
        onClick={onToggleMode}
        className="w-full text-sm text-gray-600 hover:text-gray-900"
      >
        Already have an account? Sign in
      </button>
    </form>
  );
};
