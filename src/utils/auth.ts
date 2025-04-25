
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

      // Get the user's email directly from auth.users via auth.signInWithPassword
      // We'll try a special approach to sign in with username by first getting the user's auth email
      // This is necessary because we can't directly query auth.users, but we can use auth endpoints
      
      // First attempt to get the user's email via admin functions (if available)
      console.log("Attempting to sign in with found user ID");
      
      // Since we can't directly access the email, we'll use a workaround approach
      // We'll try signing in with a special password pattern that will fail but will return
      // a specific error message containing the email
      
      // Instead, we'll get the profile data which we know exists, then use it to attempt sign-in
      // We'll rely on the error message from auth to tell us the correct email
      
      const { data: auth_error } = await supabase.auth.signInWithPassword({
        email: `${user_id}@placeholder.com`, // This will definitely fail
        password: 'incorrect-password-to-trigger-error'
      });
      
      // The above will fail, but we can catch users that have been found via username
      // and now attempt a proper login with the correct password
      
      // Now try the authentication again with the correct password and username as identifier
      // This is a "second attempt" approach that handles the case where the user is logging in with username
      console.log("Attempting sign in with username identifier and password");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier, // Try using the username as email (in case the username is an email)
        password,
      });
      
      if (error) {
        // If that fails, we need to tell the user to use their email instead
        console.error("Sign in attempt failed:", error);
        throw new Error("Please use your email address to log in instead of your username.");
      }
      
      return { data, error: null };
    }
  } catch (error) {
    console.error("Sign in error in utility:", error);
    return { data: null, error };
  }
};
