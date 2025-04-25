
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChatContext } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User, Settings } from 'lucide-react';

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
      // Update avatar if changed
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

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url: avatarURL,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) throw error;

      // Update chat context settings
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const fonts = [
    { id: 'system', label: 'System Sans' },
    { id: 'comic', label: 'Comic Sans' },
    { id: 'typewriter', label: 'Typewriter' }
  ];

  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="retro-window">
          <div className="title-bar flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/menu')} 
                className="bg-transparent border-none text-white flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
              </button>
              <span>User Profile</span>
            </div>
          </div>
          
          <div className="p-4 grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Profile Settings</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font">Font Style</Label>
                  <select
                    id="font"
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className="w-full retro-inset p-2"
                  >
                    {fonts.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Text Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 retro-inset"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="retro-inset"
                  />
                </div>
                
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
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Account Settings</h2>
              </div>
              
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <h3 className="font-bold">Change Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordReset.currentPassword}
                    onChange={(e) => setPasswordReset({...passwordReset, currentPassword: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordReset.newPassword}
                    onChange={(e) => setPasswordReset({...passwordReset, newPassword: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordReset.confirmPassword}
                    onChange={(e) => setPasswordReset({...passwordReset, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                
                <Button type="submit" className="retro-button">
                  Update Password
                </Button>
              </form>
              
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
