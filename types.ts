
export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export type SessionStatus = 'completed' | 'partial';

export interface FocusSession {
  id: string;
  startTime: number;
  endTime: number;
  actualDurationSeconds: number; // In seconds
  targetDurationSeconds: number;
  tags: string[];
  status: SessionStatus;
  date: string; // YYYY-MM-DD
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  estimatedTime?: number; // in minutes
}

export interface TimerPreset {
  id: string;
  name: string;
  durationMinutes: number;
}

export type ViewType = 'plan' | 'focus' | 'review' | 'analyze' | 'leaderboard' | 'challenges' | 'friends';

export interface UserStats {
  streak: number;
  longestStreak: number;
  todayMinutes: number;
  todaySessions: number;
}

export interface Badge {
  label: string;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  location: string;
  badges: Badge[];
  hasTrophy?: boolean;
  timeLogged: string; // Formatted as "10h 28m"
  kudos: number;
  isCurrentUser?: boolean;
}
