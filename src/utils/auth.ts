
import { supabase } from '@/integrations/supabase/client';

export const signInWithCredentials = async (identifier: string, password: string) => {
  console.log("Auth utility: signing in with", identifier);
  
  try {
    // First, try standard email and password login since this is the most common case
    console.log("Attempting regular email sign-in");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
    
    if (!error) {
      return { data, error: null };
    }
    
    console.error("Regular sign-in failed:", error);
    return { data: null, error };
  } catch (error) {
    console.error("Sign in error in utility:", error);
    return { data: null, error };
  }
};
