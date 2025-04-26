
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const location = useLocation();
  const { user, session, isLoading, signIn, signInWithGoogle, signUp, resetPassword } = useAuth();
  
  // Check for password reset confirmation
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Handle password reset flow
    if (queryParams.get('reset') === 'true') {
      toast.success("Password has been reset. Please sign in with your new password.");
    }
    
    // Handle email verification flow
    if (queryParams.get('verification') === 'success') {
      toast.success("Email verified successfully! You can now sign in.");
    }
  }, [location.search]);
  
  // Add console logs to help debug the authentication flow
  useEffect(() => {
    console.log("Auth page: user state:", user ? "Logged in" : "Not logged in");
    console.log("Auth page: session state:", session ? "Active" : "None");
    console.log("Auth page: loading state:", isLoading);
  }, [user, session, isLoading]);
  
  // Handle sign in
  const handleSignIn = async (email: string, password: string) => {
    await signIn(email, password);
  };
  
  // Handle sign up
  const handleSignUp = async (email: string, password: string, username: string) => {
    await signUp(email, password, username);
  };
  
  // Handle password reset
  const handlePasswordReset = async (email: string) => {
    await resetPassword(email);
    setIsForgotPassword(false);
    toast.success("Password reset email sent. Please check your inbox.");
  };
  
  // Redirect to menu if user is already logged in
  if (user && session) {
    // Get the intended destination from location state or default to /menu
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/menu';
    console.log("Auth page: Redirecting to", from);
    return <Navigate to={from} replace />;
  }
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading authentication...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="retro-window">
          <div className="title-bar">
            <span>
              {isForgotPassword 
                ? 'TrashTok Password Reset'
                : `TrashTok ${isLogin ? 'Login' : 'Sign Up'}`
              }
            </span>
          </div>
          
          {isForgotPassword ? (
            <PasswordResetForm
              onBack={() => setIsForgotPassword(false)}
              isLoading={isLoading}
              onSubmit={handlePasswordReset}
            />
          ) : isLogin ? (
            <LoginForm
              onForgotPassword={() => setIsForgotPassword(true)}
              onToggleMode={() => setIsLogin(false)}
              onSignIn={handleSignIn}
              onGoogleSignIn={signInWithGoogle}
              isLoading={isLoading}
            />
          ) : (
            <SignUpForm
              onToggleMode={() => setIsLogin(true)}
              onSignUp={handleSignUp}
              onGoogleSignIn={signInWithGoogle}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
