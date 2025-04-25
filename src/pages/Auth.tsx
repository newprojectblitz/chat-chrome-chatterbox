
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { signInWithCredentials, signInWithGoogle, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithCredentials(identifier, password);
      } else {
        await signUp(email, password, username);
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
      setIsForgotPassword(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-[#008080] p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="retro-window">
            <div className="title-bar">
              <span>TrashTok Password Reset</span>
            </div>
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
              <Button type="submit" className="w-full retro-button">
                Send Reset Link
              </Button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Back to login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="retro-window">
          <div className="title-bar">
            <span>TrashTok {isLogin ? 'Login' : 'Sign Up'}</span>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {isLogin ? (
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Username</Label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            ) : (
              <>
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
              </>
            )}
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
            <Button type="submit" className="w-full retro-button">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full retro-button mt-2"
            >
              Continue with Google
            </Button>
            <div className="flex flex-col gap-2 mt-2">
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  Forgot password?
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setIdentifier('');
                  setEmail('');
                  setUsername('');
                  setPassword('');
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
