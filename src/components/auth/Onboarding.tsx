
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { FanPreferences } from '@/components/profile/FanPreferences';
import { TextPreview } from '@/components/profile/TextPreview';

export const Onboarding = () => {
  const { user, profile, updateProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Text styling preferences
  const [font, setFont] = useState(profile?.font || 'system');
  const [color, setColor] = useState(profile?.color || '#000000');
  const [fontSize, setFontSize] = useState(profile?.font_size || 'regular');
  const [isBold, setIsBold] = useState(profile?.is_bold || false);
  const [isItalic, setIsItalic] = useState(profile?.is_italic || false);
  const [isUnderline, setIsUnderline] = useState(profile?.is_underline || false);
  
  // Sports team preferences
  const [nbaTeam, setNbaTeam] = useState(profile?.nba_team || 'None');
  const [nhlTeam, setNhlTeam] = useState(profile?.nhl_team || 'None');
  const [mlbTeam, setMlbTeam] = useState(profile?.mlb_team || 'None');
  const [nflTeam, setNflTeam] = useState(profile?.nfl_team || 'None');
  
  // Bio
  const [bio, setBio] = useState(profile?.bio || '');
  
  const handleAvatarChange = (file: File) => {
    setAvatar(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }
    
    try {
      setLoading(true);
      
      let avatarUrl = profile?.avatar_url || null;
      
      // If a new avatar was uploaded, store it in Supabase Storage
      if (avatar) {
        const avatarFileName = `${user?.id}/${Date.now()}_${avatar.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatar);
        
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName);
        
        avatarUrl = urlData.publicUrl;
      }
      
      // Update profile with all settings
      const { error } = await updateProfile({
        username,
        avatar_url: avatarUrl,
        bio,
        font,
        color,
        font_size: fontSize,
        is_bold: isBold,
        is_italic: isItalic,
        is_underline: isUnderline,
        nba_team: nbaTeam,
        nhl_team: nhlTeam,
        mlb_team: mlbTeam,
        nfl_team: nflTeam,
        is_onboarded: true
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#008080] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="retro-window">
          <div className="title-bar">
            <span>Welcome to TrashTok - Complete Your Profile</span>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username (required)</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="retro-inset"
                  required
                />
                <p className="text-xs text-gray-500">This will be your @handle for mentions.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full retro-inset p-2 h-20"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">{bio.length}/160 - Tell us about yourself</p>
              </div>
              
              <AvatarUpload
                onAvatarChange={handleAvatarChange}
                avatarUrl={profile?.avatar_url || undefined}
              />
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Choose Your Chat Style</h3>
                
                {/* Reuse existing ProfileSettings component */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="font">Font</Label>
                    <select
                      id="font"
                      value={font}
                      onChange={(e) => setFont(e.target.value)}
                      className="w-full retro-inset p-2"
                    >
                      <option value="system">System Default</option>
                      <option value="comic">Comic Sans</option>
                      <option value="times">Times New Roman</option>
                      <option value="courier">Courier New</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <input
                      type="color"
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10 retro-inset p-1"
                    />
                  </div>
                </div>
                
                <TextPreview
                  font={font}
                  color={color}
                  fontSize={fontSize}
                  isBold={isBold}
                  isItalic={isItalic}
                  isUnderline={isUnderline}
                />
              </div>
              
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
              
              <Button 
                type="submit" 
                className="w-full retro-button" 
                disabled={loading || !username}
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full retro-button"
                onClick={() => {
                  // Skip onboarding, just set is_onboarded to true
                  updateProfile({ is_onboarded: true });
                }}
              >
                Skip for Now
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
