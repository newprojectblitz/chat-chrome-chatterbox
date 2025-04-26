
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!identifier.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setFormLoading(true);
      await onSignIn(identifier, password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Invalid email or password');
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
        <Label htmlFor="identifier">Email</Label>
        <Input
          id="identifier"
          type="email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={error && !identifier ? 'border-red-500' : ''}
          required
          autoComplete="email"
        />
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
          autoComplete="current-password"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full retro-button" 
        disabled={isLoading || formLoading}
      >
        {(isLoading || formLoading) ? 'Signing In...' : 'Sign In'}
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
