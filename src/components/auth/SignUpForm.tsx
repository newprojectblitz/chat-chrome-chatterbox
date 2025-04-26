
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    
    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return false;
    }
    
    if (!/^[A-Za-z0-9_-]+$/.test(username)) {
      setError('Username can only contain letters, numbers, underscores and hyphens');
      return false;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormLoading(true);
      await onSignUp(email, password, username);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to sign up');
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={error && !email ? 'border-red-500' : ''}
          required
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={error && !username ? 'border-red-500' : ''}
          required
          autoComplete="username"
        />
        <p className="text-xs text-gray-500">
          Letters, numbers, underscores and hyphens only (3-20 characters)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={error && !password ? 'border-red-500' : ''}
          required
          autoComplete="new-password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={error && password !== confirmPassword ? 'border-red-500' : ''}
          required
          autoComplete="new-password"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full retro-button" 
        disabled={isLoading || formLoading}
      >
        {(isLoading || formLoading) ? 'Signing Up...' : 'Sign Up'}
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
