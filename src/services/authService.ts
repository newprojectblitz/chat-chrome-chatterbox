
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '@/types/auth';
import { toast } from '@/components/ui/sonner';

export async function signIn(email: string, password: string): Promise<{ 
  user: User | null; 
  session: Session | null; 
  error: Error | null 
}> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error("Sign in error:", error);
    return { user: null, session: null, error: error as Error };
  }
}

export async function signUp(email: string, password: string, username: string): Promise<{ error: Error | null }> {
  try {
    // Check if username exists
    const { data: existingUser, error: usernameCheckError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();
    
    if (usernameCheckError && usernameCheckError.code !== 'PGRST116') {
      throw usernameCheckError;
    }
    
    if (existingUser) {
      throw new Error('Username is already taken.');
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: error as Error };
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return { error: error as Error };
  }
}

export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/menu`,
      }
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Google sign in error:", error);
    return { error: error as Error };
  }
}

export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: error as Error };
  }
}

export async function updatePassword(password: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Update password error:", error);
    return { error: error as Error };
  }
}

export async function fetchUserProfile(userId: string): Promise<{ 
  profile: UserProfile | null; 
  error: Error | null 
}> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return { 
      profile: data as UserProfile, 
      error: null 
    };
  } catch (error) {
    console.error("Fetch profile error:", error);
    return { 
      profile: null, 
      error: error as Error 
    };
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: error as Error };
  }
}

export function handleAuthError(error: Error | null): string {
  if (!error) return '';
  
  // Map Supabase error messages to user-friendly messages
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('email already in use')) {
    return 'This email is already registered. Please sign in instead.';
  } else if (errorMessage.includes('invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  } else if (errorMessage.includes('rate limit')) {
    return 'Too many attempts. Please try again later.';
  }
  
  return error.message;
}
