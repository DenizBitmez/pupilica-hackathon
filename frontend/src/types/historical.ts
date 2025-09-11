export interface HistoricalFigure {
  id: string;
  name: string;
  personality: string;
  era: string;
  location: string;
  image?: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
  figureName?: string;
}

export interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  description: string;
  era: string;
  relatedFigure?: string;
  events?: HistoricalEvent[];
}

export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: MapLocation;
  significance: string;
}

export interface AvatarState {
  isSpeaking: boolean;
  isListening: boolean;
  currentAnimation: 'idle' | 'speaking' | 'listening' | 'thinking';
}
