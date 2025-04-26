
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useChatContext } from '@/context/ChatContext';

export const useProfileData = (userId: string | undefined) => {
  const { currentUser, updateUserSettings } = useChatContext();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');

  // Text styling state
  const [font, setFont] = useState(currentUser?.font || 'system');
  const [fontSize, setFontSize] = useState(currentUser?.fontSize || 'regular');
  const [isBold, setIsBold] = useState(currentUser?.isBold || false);
  const [isItalic, setIsItalic] = useState(currentUser?.isItalic || false);
  const [isUnderline, setIsUnderline] = useState(currentUser?.isUnderline || false);
  const [color, setColor] = useState(currentUser?.color || '#000000');

  // Team preferences state
  const [nbaTeam, setNbaTeam] = useState(currentUser?.nbaTeam || 'None');
  const [nhlTeam, setNhlTeam] = useState(currentUser?.nhlTeam || 'None');
  const [mlbTeam, setMlbTeam] = useState(currentUser?.mlbTeam || 'None');
  const [nflTeam, setNflTeam] = useState(currentUser?.nflTeam || 'None');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setLoading(true);
    console.log('Submitting profile update...');

    try {
      let avatarURL = avatarUrl;
      if (avatar) {
        console.log('Uploading new avatar...');
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${userId}-${Math.random().toString(36).substring(2)}`;
        const filePath = `${fileName}.${fileExt}`;

        const { data: buckets } = await supabase.storage.listBuckets();
        const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
        
        if (!avatarBucketExists) {
          console.log('Creating avatars bucket...');
          const { data, error: bucketError } = await supabase.storage.createBucket('avatars', {
            public: true
          });
          
          if (bucketError) {
            throw bucketError;
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        avatarURL = data.publicUrl;
      }

      const updateData = {
        username,
        avatar_url: avatarURL,
        nba_team: nbaTeam,
        nhl_team: nhlTeam,
        mlb_team: mlbTeam,
        nfl_team: nflTeam,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

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

  return {
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
  };
};
