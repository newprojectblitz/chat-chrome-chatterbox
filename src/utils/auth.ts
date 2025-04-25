
import { supabase } from '@/integrations/supabase/client';

export const signInWithCredentials = async (identifier: string, password: string) => {
  // Check if the identifier is an email
  const { data: { is_email } } = await supabase
    .rpc('is_email', { str: identifier });

  if (is_email) {
    // If it's an email, use regular email sign in
    return supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
  } else {
    // If it's a username, first get the user's email
    const { data: user_id } = await supabase
      .rpc('get_user_id_by_username', { lookup_username: identifier });
    
    if (!user_id) {
      throw new Error('User not found');
    }

    // Then sign in with the email
    const { data: { user }, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }

    return supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
  }
};
