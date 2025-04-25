
import { Label } from "@/components/ui/label";

interface FanPreferencesProps {
  nbaTeam: string;
  onNbaTeamChange: (team: string) => void;
  nhlTeam: string;
  onNhlTeamChange: (team: string) => void;
  mlbTeam: string;
  onMlbTeamChange: (team: string) => void;
  nflTeam: string;
  onNflTeamChange: (team: string) => void;
}

export const FanPreferences = ({
  nbaTeam,
  onNbaTeamChange,
  nhlTeam,
  onNhlTeamChange,
  mlbTeam,
  onMlbTeamChange,
  nflTeam,
  onNflTeamChange,
}: FanPreferencesProps) => {
  const nbaTeams = ['None', 'Lakers', 'Celtics', 'Bulls', 'Warriors', 'Bucks', 'Heat'];
  const nhlTeams = ['None', 'Bruins', 'Maple Leafs', 'Canadiens', 'Blackhawks', 'Red Wings'];
  const mlbTeams = ['None', 'Yankees', 'Red Sox', 'Dodgers', 'Cubs', 'Giants'];
  const nflTeams = ['None', 'Cowboys', 'Patriots', 'Chiefs', 'Eagles', '49ers'];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Fan Preferences</h3>
      <p className="text-sm text-gray-600">Choose one team for each sport to get access to fan-specific chat rooms.</p>
      
      <div className="space-y-2">
        <Label htmlFor="nbaTeam">NBA Team</Label>
        <select
          id="nbaTeam"
          value={nbaTeam}
          onChange={(e) => onNbaTeamChange(e.target.value)}
          className="w-full retro-inset p-2"
        >
          {nbaTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nhlTeam">NHL Team</Label>
        <select
          id="nhlTeam"
          value={nhlTeam}
          onChange={(e) => onNhlTeamChange(e.target.value)}
          className="w-full retro-inset p-2"
        >
          {nhlTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mlbTeam">MLB Team</Label>
        <select
          id="mlbTeam"
          value={mlbTeam}
          onChange={(e) => onMlbTeamChange(e.target.value)}
          className="w-full retro-inset p-2"
        >
          {mlbTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nflTeam">NFL Team</Label>
        <select
          id="nflTeam"
          value={nflTeam}
          onChange={(e) => onNflTeamChange(e.target.value)}
          className="w-full retro-inset p-2"
        >
          {nflTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
