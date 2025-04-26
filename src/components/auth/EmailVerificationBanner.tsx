
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface EmailVerificationBannerProps {
  email: string;
}

export const EmailVerificationBanner = ({ email }: EmailVerificationBannerProps) => {
  const [isResending, setIsResending] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  if (isDismissed) {
    return null;
  }
  
  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Verification email resent. Please check your inbox.");
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <Alert className="mb-4">
      <AlertDescription className="flex items-center justify-between">
        <div>
          Please verify your email address to access all features. 
          Check your inbox at <strong>{email}</strong>.
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsDismissed(true)}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
