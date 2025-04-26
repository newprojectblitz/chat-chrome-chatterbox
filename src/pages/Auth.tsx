
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
  
  const { user, session, isLoading, signInWithCredentials, signInWithGoogle, signUp } = useAuth();

  // Check for password reset confirmation
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('reset') === 'true') {
      toast.success("Password has been reset. Please sign in with your new password.");
    }
  }, [location]);

  // Add console logs to help debug the authentication flow
  useEffect(() => {
    console.log("Auth page: user state:", user ? "Logged in" : "Not logged in");
    console.log("Auth page: session state:", session ? "Active" : "None");
    console.log("Auth page: loading state:", isLoading);
  }, [user, session, isLoading]);

  // Redirect to menu if user is already logged in
  if (user && session) {
    console.log("Auth page: Redirecting to /menu");
    return <Navigate to="/menu" replace />;
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
            />
          ) : isLogin ? (
            <LoginForm
              onForgotPassword={() => setIsForgotPassword(true)}
              onToggleMode={() => setIsLogin(false)}
              onSignIn={signInWithCredentials}
              onGoogleSignIn={signInWithGoogle}
              isLoading={isLoading}
            />
          ) : (
            <SignUpForm
              onToggleMode={() => setIsLogin(true)}
              onSignUp={signUp}
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
