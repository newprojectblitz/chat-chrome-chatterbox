
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChatContext } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { PasswordSettings } from '@/components/profile/PasswordSettings';
import { FanPreferences } from '@/components/profile/FanPreferences';
import { FriendsList } from '@/components/profile/FriendsList';
import { toast } from '@/components/ui/sonner';

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { currentUser, updateUserSettings } = useChatContext();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [font, setFont] = useState(currentUser?.font || 'system');
  const [fontSize, setFontSize] = useState(currentUser?.fontSize || 'regular');
  const [isBold, setIsBold] = useState(currentUser?.isBold || false);
  const [isItalic, setIsItalic] = useState(currentUser?.isItalic || false);
  const [isUnderline, setIsUnderline] = useState(currentUser?.isUnderline || false);
  const [color, setColor] = useState(currentUser?.color || '#000000');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Fan preferences
  const [nbaTeam, setNbaTeam] = useState(currentUser?.nbaTeam || 'None');
  const [nhlTeam, setNhlTeam] = useState(currentUser?.nhlTeam || 'None');
  const [mlbTeam, setMlbTeam] = useState(currentUser?.mlbTeam || 'None');
  const [nflTeam, setNflTeam] = useState(currentUser?.nflTeam || 'None');
  
  // Friends
  const [friends, setFriends] = useState<{ id: string; name: string; isOnline: boolean }[]>([]);
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  
  const [passwordReset, setPasswordReset] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url, nba_team, nhl_team, mlb_team, nfl_team')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile data');
          return;
        }

        if (data) {
          console.log('Profile data loaded:', data);
          setUsername(data.username || '');
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
          if (data.nba_team) setNbaTeam(data.nba_team);
          if (data.nhl_team) setNhlTeam(data.nhl_team);
          if (data.mlb_team) setMlbTeam(data.mlb_team);
          if (data.nfl_team) setNflTeam(data.nfl_team);
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [user, navigate, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting profile update...');

    try {
      if (!user) {
        throw new Error('You must be logged in to update your profile');
      }
      
      let avatarURL = avatarUrl;
      if (avatar) {
        console.log('Uploading new avatar...');
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}`;
        const filePath = `${fileName}.${fileExt}`;

        // Check if storage bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
        
        // Create bucket if it doesn't exist
        if (!avatarBucketExists) {
          console.log('Creating avatars bucket...');
          const { data, error: bucketError } = await supabase.storage.createBucket('avatars', {
            public: true
          });
          
          if (bucketError) {
            console.error('Error creating bucket:', bucketError);
            throw bucketError;
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar);

        if (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        avatarURL = data.publicUrl;
        console.log('Avatar uploaded successfully:', avatarURL);
      }

      console.log('Updating profile data...');
      const updateData = {
        username,
        avatar_url: avatarURL,
        nba_team: nbaTeam,
        nhl_team: nhlTeam,
        mlb_team: mlbTeam,
        nfl_team: nflTeam,
        updated_at: new Date().toISOString(),
      };
      
      console.log('Update data:', updateData);
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log('Updating user settings in context...');
      updateUserSettings(
        font, 
        color, 
        fontSize, 
        isBold, 
        isItalic, 
        isUnderline,
        nbaTeam,
        nhlTeam,
        mlbTeam,
        nflTeam
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(error instanceof Error ? error.message : "An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordReset.newPassword !== passwordReset.confirmPassword) {
      toast.error("New password and confirm password don't match");
      return;
    }
    
    try {
      setLoading(true);
      console.log('Updating password...');
      const { error } = await supabase.auth.updateUser({ 
        password: passwordReset.newPassword 
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully!");
      
      setPasswordReset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error instanceof Error ? error.message : "An error occurred while updating your password");
    } finally {
      setLoading(false);
    }
  };

  // Friend management
  const handleAddFriend = (friendName: string) => {
    setFriendRequests(prev => [...prev, friendName]);
  };

  const handleAcceptFriend = (friendName: string) => {
    setFriends(prev => [...prev, { id: `friend_${Date.now()}`, name: friendName, isOnline: true }]);
    setFriendRequests(prev => prev.filter(req => req !== friendName));
  };

  const handleRejectFriend = (friendName: string) => {
    setFriendRequests(prev => prev.filter(req => req !== friendName));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
      <div className="text-white text-lg">Please log in to view your profile</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="retro-window">
          <div className="title-bar">
            <ProfileHeader />
          </div>
          
          <div className="p-4 grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <ProfileSettings
                  username={username}
                  font={font}
                  color={color}
                  onUsernameChange={setUsername}
                  onFontChange={setFont}
                  onColorChange={setColor}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  isBold={isBold}
                  onBoldChange={setIsBold}
                  isItalic={isItalic}
                  onItalicChange={setIsItalic}
                  isUnderline={isUnderline}
                  onUnderlineChange={setIsUnderline}
                />
                
                <AvatarUpload
                  onAvatarChange={setAvatar}
                  avatarUrl={avatarUrl}
                />
                
                <Button 
                  type="submit" 
                  className="retro-button" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
              
              <FanPreferences
                nbaTeam={nbaTeam}
                onNbaTeamChange={setNbaTeam}
                nhlTeam={nhlTeam}
                onNhlTeamChange={setNhlTeam}
                mlbTeam={mlbTeam}
                onMlbTeamChange={setMlbTeam}
                nflTeam={nflTeam}
                onNflTeamChange={setNflTeam}
              />
            </div>
            
            <div className="space-y-6">
              <FriendsList
                friends={friends}
                friendRequests={friendRequests}
                onAddFriend={handleAddFriend}
                onAcceptFriend={handleAcceptFriend}
                onRejectFriend={handleRejectFriend}
              />
              
              <PasswordSettings
                passwordReset={passwordReset}
                onPasswordChange={(field, value) => 
                  setPasswordReset(prev => ({ ...prev, [field]: value }))
                }
                onSubmit={handlePasswordReset}
              />
              
              <div className="mt-6">
                <div className="text-sample p-3 retro-inset">
                  <h3 className="font-bold mb-2">Text Preview</h3>
                  <p style={{
                    fontFamily: font === 'comic' ? 'Comic Neue' : 
                              font === 'typewriter' ? 'Courier New' : 
                              'system-ui',
                    color: color,
                    fontSize: fontSize === 'small' ? '0.9rem' : 
                             fontSize === 'large' ? '1.1rem' : '1rem',
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textDecoration: isUnderline ? 'underline' : 'none'
                  }}>
                    This is how your text will look in the chat!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
