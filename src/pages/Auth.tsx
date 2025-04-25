
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { signInWithCredentials, signInWithGoogle, signUp, isLoading, user } = useAuth();

  // If user is already logged in, redirect to menu
  if (user) {
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
