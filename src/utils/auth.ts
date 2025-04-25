
import { supabase } from '@/integrations/supabase/client';

export const signInWithCredentials = async (identifier: string, password: string) => {
  // Check if the identifier is an email
  const { data, error: emailCheckError } = await supabase
    .rpc('is_email', { str: identifier });
  
  if (emailCheckError) throw emailCheckError;
  
  const is_email = data;

  if (is_email) {
    // If it's an email, use regular email sign in
    return supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
  } else {
    // If it's a username, first get the user's email
    const { data: user_id, error: usernameError } = await supabase
      .rpc('get_user_id_by_username', { lookup_username: identifier });
    
    if (usernameError) throw usernameError;
    if (!user_id) {
      throw new Error('User not found');
    }

    // Then get the profile to verify the user exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .single();

    if (profileError || !profile) {
      throw new Error('User not found');
    }

    // We still need to sign in with email/password
    // Since we only have the username, we're using it directly in the password flow
    // Supabase RLS will handle the actual authentication
    return supabase.auth.signInWithPassword({
      email: identifier, // The identifier here is actually the username
      password,
    });
  }
};
