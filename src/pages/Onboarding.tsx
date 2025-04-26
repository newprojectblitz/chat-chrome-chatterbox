
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Onboarding as OnboardingForm } from '@/components/auth/Onboarding';

const Onboarding = () => {
  const { user, profile, isLoading } = useAuth();
  
  useEffect(() => {
    console.log("Onboarding page: user state:", user ? "Logged in" : "Not logged in");
    console.log("Onboarding page: profile state:", profile ? "Loaded" : "Not loaded");
    console.log("Onboarding page: is_onboarded:", profile?.is_onboarded);
  }, [user, profile]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  
  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect to menu if already onboarded
  if (profile?.is_onboarded) {
    return <Navigate to="/menu" replace />;
  }
  
  return <OnboardingForm />;
};

export default Onboarding;
