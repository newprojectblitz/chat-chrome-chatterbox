
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  sender: string;
  font: string;
  color: string;
}

export interface ChatUser {
  id: string;
  name: string;
  font: string;
  color: string;
  isOnline: boolean;
}
