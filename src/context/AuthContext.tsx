
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { AuthState, AuthContextType, UserProfile, UserRole } from '@/types/auth';
import * as AuthService from '@/services/authService';

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state for the auth context
const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();
  const location = useLocation();

  // Load profile data based on user ID
  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const { profile, error } = await AuthService.fetchUserProfile(userId);
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      return profile;
    } catch (error) {
      console.error("Load profile error:", error);
      return null;
    }
  }, []);

  // Initialize auth state and set up listeners
  useEffect(() => {
    // Flag to prevent state updates after unmount
    let isMounted = true;
    
    const initialize = async () => {
      try {
        // First, set up the auth state listener to catch future changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed:", event, "User:", currentSession?.user?.email);
            
            if (event === 'SIGNED_IN') {
              // Wait to prevent race conditions
              setTimeout(async () => {
                if (!isMounted) return;
                
                const profile = currentSession?.user 
                  ? await loadUserProfile(currentSession.user.id)
                  : null;
                
                setState({
                  user: currentSession?.user ?? null,
                  session: currentSession,
                  profile,
                  isLoading: false,
                  isInitialized: true,
                });
                
                // Redirect to onboarding if needed or to main page
                if (profile && !profile.is_onboarded) {
                  navigate('/onboarding');
                } else if (profile && location.pathname === '/auth') {
                  navigate('/menu');
                }
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              if (!isMounted) return;
              
              setState({
                user: null,
                session: null,
                profile: null,
                isLoading: false,
                isInitialized: true,
              });
              
              // Only navigate to auth if we're on a protected route
              if (location.pathname !== '/auth') {
                navigate('/auth');
              }
            } else if (event === 'USER_UPDATED') {
              setTimeout(async () => {
                if (!isMounted) return;
                
                if (currentSession?.user) {
                  const profile = await loadUserProfile(currentSession.user.id);
                  
                  setState(prev => ({
                    ...prev,
                    user: currentSession.user,
                    session: currentSession,
                    profile,
                    isLoading: false,
                  }));
                }
              }, 0);
            }
          }
        );
        
        // Then check for existing session
        const { data } = await supabase.auth.getSession();
        
        if (data?.session) {
          const profile = data.session.user 
            ? await loadUserProfile(data.session.user.id)
            : null;
          
          if (isMounted) {
            setState({
              user: data.session.user,
              session: data.session,
              profile,
              isLoading: false,
              isInitialized: true,
            });
            
            // Redirect to onboarding if needed
            if (profile && !profile.is_onboarded) {
              navigate('/onboarding');
            }
          }
        } else {
          if (isMounted) {
            setState({
              ...initialState,
              isLoading: false,
              isInitialized: true,
            });
            
            // Only redirect to auth if we're on a protected route
            if (location.pathname !== '/auth') {
              navigate('/auth');
            }
          }
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        
        if (isMounted) {
          setState({
            ...initialState,
            isLoading: false,
            isInitialized: true,
          });
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [navigate, loadUserProfile, location.pathname]);
  
  // Sign in handler
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await AuthService.signIn(email, password);
      
      if (error) {
        const errorMsg = AuthService.handleAuthError(error);
        toast.error(errorMsg);
        return { error };
      }
      
      // onAuthStateChange will handle the state update and navigation
      return { error: null };
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
      return { error: error as Error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Sign up handler
  const signUp = async (email: string, password: string, username: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await AuthService.signUp(email, password, username);
      
      if (error) {
        const errorMsg = AuthService.handleAuthError(error);
        toast.error(errorMsg);
        return { error };
      }
      
      toast.success(
        "Account created! Please check your email for verification."
      );
      
      return { error: null };
    } catch (error) {
      toast.error("Failed to sign up. Please try again.");
      return { error: error as Error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Sign out handler
  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await AuthService.signOut();
      
      if (error) {
        toast.error("Failed to sign out. Please try again.");
        return { error };
      }
      
      // onAuthStateChange will handle the state update and navigation
      return { error: null };
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
      return { error: error as Error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Google sign in handler
  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await AuthService.signInWithGoogle();
      // Redirect is handled by Supabase OAuth
    } catch (error) {
      toast.error("Failed to sign in with Google. Please try again.");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Reset password handler
  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await AuthService.resetPassword(email);
      
      if (error) {
        toast.error("Failed to reset password. Please try again.");
        return { error };
      }
      
      toast.success("Password reset email sent. Please check your inbox.");
      return { error: null };
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      return { error: error as Error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Update profile handler
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!state.user) {
      return { error: new Error("User not authenticated") };
    }
    
    try {
      const { error } = await AuthService.updateUserProfile(state.user.id, data);
      
      if (error) {
        toast.error("Failed to update profile. Please try again.");
        return { error };
      }
      
      // Update local state
      const updatedProfile = await loadUserProfile(state.user.id);
      
      setState(prev => ({
        ...prev,
        profile: updatedProfile
      }));
      
      return { error: null };
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      return { error: error as Error };
    }
  };
  
  // Check if user has specified role
  const hasRole = (requiredRoles: UserRole[]): boolean => {
    // Unauthenticated users have public role only
    if (!state.user) {
      return requiredRoles.includes('public');
    }
    
    // If user profile isn't loaded yet, default to false
    if (!state.profile) {
      return false;
    }
    
    // Check if user has any of the required roles
    return requiredRoles.includes(state.profile.role);
  };
  
  // Provide the auth context to children
  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      updateProfile,
      resetPassword,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
