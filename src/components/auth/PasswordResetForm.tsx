
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordResetFormProps {
  onBack: () => void;
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

export const PasswordResetForm = ({ onBack, onSubmit, isLoading }: PasswordResetFormProps) => {
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!resetEmail.trim()) {
      setError('Email is required');
      return;
    }
    
    try {
      await onSubmit(resetEmail);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handlePasswordReset} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resetEmail">Email</Label>
        <Input
          id="resetEmail"
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          className={error ? 'border-red-500' : ''}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <Button type="submit" className="w-full retro-button" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-600 hover:text-gray-900"
      >
        Back to login
      </button>
    </form>
  );
};
