
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

export function useRolePermissions() {
  const { hasRole } = useAuth();
  
  const canAccessRoute = (route: string): boolean => {
    // Common routes
    if (route === '/auth') {
      return true; // Public route
    }
    
    if (route === '/menu') {
      return hasRole(['member', 'moderator', 'admin']);
    }
    
    // Profile routes
    if (route === '/profile') {
      return hasRole(['member', 'moderator', 'admin']);
    }
    
    // Admin routes
    if (route.startsWith('/admin/users')) {
      return hasRole(['admin']);
    }
    
    if (route.startsWith('/admin/channels')) {
      return hasRole(['moderator', 'admin']);
    }
    
    // Chat routes
    if (route.startsWith('/chat/')) {
      return hasRole(['member', 'moderator', 'admin']);
    }
    
    // DM routes
    if (route.startsWith('/direct-messages/')) {
      return hasRole(['member', 'moderator', 'admin']);
    }
    
    return false;
  };
  
  return { canAccessRoute };
}
