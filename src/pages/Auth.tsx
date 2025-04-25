
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { useAuth } from '@/context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Mark page as loaded after initial render
    setPageLoaded(true);
  }, []);

  // Try-catch block to safely access auth context
  let user = null;
  let session = null;
  let isLoading = true;
  
  // Define the functions with the correct type signatures
  let signInWithCredentials: (identifier: string, password: string) => Promise<void> = async () => {};
  let signInWithGoogle: () => Promise<void> = async () => {};
  let signUp: (email: string, password: string, username: string) => Promise<void> = async () => {};

  try {
    const auth = useAuth();
    user = auth.user;
    session = auth.session;
    isLoading = auth.isLoading;
    signInWithCredentials = auth.signInWithCredentials;
    signInWithGoogle = auth.signInWithGoogle;
    signUp = auth.signUp;
  } catch (error) {
    console.error("Auth context error:", error);
    // If auth context fails, we'll show loading state
  }

  // Show loading state while checking authentication
  if ((isLoading || !pageLoaded) && !user) {
    return (
      <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading authentication...</div>
      </div>
    );
  }

  // Redirect to menu if user is already logged in
  if (user && session) {
    console.log("User already logged in, redirecting to menu");
    return <Navigate to="/menu" replace />;
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
