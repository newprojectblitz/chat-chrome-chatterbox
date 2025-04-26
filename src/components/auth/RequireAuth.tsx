
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const RequireAuth = ({ 
  children, 
  allowedRoles = ['member', 'moderator', 'admin'], 
  redirectTo = '/auth' 
}: RequireAuthProps) => {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
        <div className="text-white text-lg">Authenticating...</div>
      </div>
    );
  }
  
  // If not logged in, redirect to auth page
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Check if user has required role
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/menu" state={{ from: location }} replace />;
  }
  
  // User is authenticated and has required role
  return <>{children}</>;
};
