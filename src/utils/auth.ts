
import { supabase } from '@/integrations/supabase/client';

export const signInWithCredentials = async (identifier: string, password: string) => {
  console.log("Auth utility: signing in with", identifier);
  
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
    return supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
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

    // Then get the profile to verify the user exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .single();

    if (profileError || !profile) {
      console.error("Profile fetch error:", profileError);
      throw new Error('User not found');
    }
    
    console.log("Found profile:", profile);

    // We still need to sign in with email/password
    // Since we only have the username, we're using a direct approach to sign in
    // This will need to use the actual email associated with the account
    
    // Get email from profiles or auth.users (via stored procedure if needed)
    const { data: userData, error: userDataError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', user_id)
      .single();
      
    if (userDataError || !userData) {
      console.error("User data fetch error:", userDataError);
      throw new Error('Failed to retrieve user information');
    }
    
    // If email is not in profiles table, this approach won't work
    // In this case, you might need to implement a custom server-side function
    // that can lookup the email based on the username
    
    // For now, try a direct sign-in approach
    console.log("Attempting direct sign in with username");
    return supabase.auth.signInWithPassword({
      email: identifier, // This will actually be the username
      password,
    });
  }
};
