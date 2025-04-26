
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'moderator' | 'member' | 'public';

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  font: string | null;
  color: string | null;
  font_size: string | null;
  is_bold: boolean | null;
  is_italic: boolean | null;
  is_underline: boolean | null;
  nba_team: string | null;
  nhl_team: string | null;
  mlb_team: string | null;
  nfl_team: string | null;
  role?: UserRole; // Made optional
  is_onboarded?: boolean; // Made optional
  email_verified?: boolean; // Made optional
  created_at?: string; // Added missing field
  is_online?: boolean; // Added missing field
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  hasRole: (requiredRoles: UserRole[]) => boolean;
}
