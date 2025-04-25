
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  sender: string;
  font: string;
  color: string;
  fontSize?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  font: string;
  color: string;
  fontSize?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  nbaTeam?: string;
  nhlTeam?: string;
  mlbTeam?: string;
  nflTeam?: string;
  isOnline: boolean;
}
