
import { supabase } from '@/integrations/supabase/client';

export const signInWithCredentials = async (identifier: string, password: string) => {
  console.log("Auth utility: signing in with", identifier);
  
  try {
    // Check if the identifier is an email
    const { data: isEmail, error: emailCheckError } = await supabase
      .rpc('is_email', { str: identifier });
    
    if (emailCheckError) {
      console.error("Email check error:", emailCheckError);
      throw emailCheckError;
    }
    
    console.log("Is email check:", isEmail);
    
    if (isEmail) {
      // If it's an email, use regular email sign in
      console.log("Signing in with email");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } else {
      // If it's a username, first get the user's email
      console.log("Getting user ID by username");
      const { data: user_id, error: usernameError } = await supabase
        .rpc('get_user_id_by_username', { lookup_username: identifier });
      
      if (usernameError) {
        console.error("Username lookup error:", usernameError);
        throw usernameError;
      }
      
      if (!user_id) {
        console.error("User not found");
        throw new Error('User not found');
      }
      
      console.log("Found user ID:", user_id);

      // Then get the profile to verify the user exists and get the email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', user_id)
        .single();

      if (profileError || !profile) {
        console.error("Profile fetch error:", profileError);
        throw new Error('User not found');
      }
      
      console.log("Found profile:", profile);
      
      // If we don't have the email in the profile, try to get it from auth.users via RPC
      if (!profile.email) {
        console.error("Email not found in profile");
        throw new Error("Email not found for this username. Please use your email to log in.");
      }
      
      // Sign in with the email we found
      console.log("Signing in with retrieved email");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error("Sign in error in utility:", error);
    return { data: null, error };
  }
};
