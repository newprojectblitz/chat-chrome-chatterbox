
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
    
    // If that failed, check if the identifier is an email
    console.log("Regular sign-in failed, checking if identifier is email or username");
    const { data: isEmail, error: emailCheckError } = await supabase
      .rpc('is_email', { str: identifier });
    
    if (emailCheckError) {
      console.error("Email check error:", emailCheckError);
      throw emailCheckError;
    }
    
    console.log("Is email check:", isEmail);
    
    if (!isEmail) {
      // If it's a username, try to get the user ID
      console.log("Getting user ID by username");
      const { data: userId, error: usernameError } = await supabase
        .rpc('get_user_id_by_username', { lookup_username: identifier });
      
      if (usernameError) {
        console.error("Username lookup error:", usernameError);
        throw usernameError;
      }
      
      if (!userId) {
        console.error("User not found");
        throw new Error('User not found. Please check your username or email address.');
      }
      
      console.log("Found user ID:", userId);
      
      // Since we can't directly use the user ID to log in, 
      // inform the user to use their email instead
      throw new Error("Please use your email address to log in instead of your username.");
    } else {
      // If the identifier is an email but login failed, it's likely a password issue
      console.error("Email sign-in failed:", error);
      throw error;
    }
  } catch (error) {
    console.error("Sign in error in utility:", error);
    return { data: null, error };
  }
};
