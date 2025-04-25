
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

const Profile = () => {
  const { user } = useAuth();
  const { currentUser, updateUserSettings } = useChatContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [font, setFont] = useState(currentUser?.font || 'system');
  const [color, setColor] = useState(currentUser?.color || '#000000');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUsername(data.username);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarURL = avatarUrl;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${user!.id}-${Math.random().toString(36).substring(2)}`;
        const filePath = `${fileName}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        avatarURL = data.publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url: avatarURL,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) throw error;

      updateUserSettings(font, color);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordReset.newPassword !== passwordReset.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Your new password and confirm password must match.",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwordReset.newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      setPasswordReset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating password",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="retro-window">
          <div className="title-bar">
            <ProfileHeader />
          </div>
          
          <div className="p-4 grid md:grid-cols-2 gap-6">
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <ProfileSettings
                  username={username}
                  font={font}
                  color={color}
                  onUsernameChange={setUsername}
                  onFontChange={setFont}
                  onColorChange={setColor}
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
            </div>
            
            <div>
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
                    color: color
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
