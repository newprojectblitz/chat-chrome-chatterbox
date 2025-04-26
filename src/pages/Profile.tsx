import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { PasswordSettings } from '@/components/profile/PasswordSettings';
import { FanPreferences } from '@/components/profile/FanPreferences';
import { FriendsList } from '@/components/profile/FriendsList';
import { TextPreview } from '@/components/profile/TextPreview';
import { toast } from '@/components/ui/sonner';
import { useProfileData } from '@/hooks/useProfileData';

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    loading,
    avatar,
    setAvatar,
    avatarUrl,
    setAvatarUrl,
    username,
    setUsername,
    font,
    setFont,
    fontSize,
    setFontSize,
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    isUnderline,
    setIsUnderline,
    color,
    setColor,
    nbaTeam,
    setNbaTeam,
    nhlTeam,
    setNhlTeam,
    mlbTeam,
    setMlbTeam,
    nflTeam,
    setNflTeam,
    handleSubmit,
  } = useProfileData(user?.id);
  
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
    return (
      <div className="min-h-screen bg-[#008080] p-4 flex items-center justify-center">
        <div className="text-white text-lg">Please log in to view your profile</div>
      </div>
    );
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
              
              <TextPreview
                font={font}
                color={color}
                fontSize={fontSize}
                isBold={isBold}
                isItalic={isItalic}
                isUnderline={isUnderline}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
