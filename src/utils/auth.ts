
import { supabase } from '@/integrations/supabase/client';

export const signInWithCredentials = async (identifier: string, password: string) => {
  console.log("Auth utility: signing in with", identifier);
  
  try {
    // Attempt regular email and password login
    console.log("Attempting regular email sign-in");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
    
    if (!error) {
      console.log("Sign-in successful:", data.user?.email);
      return { data, error: null };
    }
    
    console.error("Sign-in failed:", error);
    return { data: null, error };
  } catch (error) {
    console.error("Sign in error in utility:", error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    console.log("Auth utility: signing out");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }
    
    console.log("Sign out successful");
    return { error: null };
  } catch (error) {
    console.error("Sign out error in utility:", error);
    return { error };
  }
};
