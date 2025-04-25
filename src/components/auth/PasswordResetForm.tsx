
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface PasswordResetFormProps {
  onBack: () => void;
  isLoading: boolean;
}

export const PasswordResetForm = ({ onBack, isLoading }: PasswordResetFormProps) => {
  const [resetEmail, setResetEmail] = useState('');
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting password reset for:', resetEmail);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
      onBack();
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
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
          required
        />
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
