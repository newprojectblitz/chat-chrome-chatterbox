
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
