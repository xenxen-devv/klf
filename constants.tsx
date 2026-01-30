
import React from 'react';
import { Layout, Timer, Calendar, BarChart3, Trophy, Zap, Users } from 'lucide-react';
import { LeaderboardEntry } from './types';

export const COLORS = {
  primary: '#00D9A3',
  background: '#0b1121',
  sidebar: '#0f172a',
  card: '#1e293b',
  accent: '#38bdf8',
};

export const NAV_ITEMS = [
  { id: 'plan', label: 'Plan', icon: <Layout className="w-5 h-5" /> },
  { id: 'focus', label: 'Focus', icon: <Timer className="w-5 h-5" /> },
  { id: 'review', label: 'Review', icon: <Calendar className="w-5 h-5" /> },
  { id: 'analyze', label: 'Analyze', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
  { id: 'challenges', label: 'Challenges', icon: <Zap className="w-5 h-5" /> },
  { id: 'friends', label: 'Friends', icon: <Users className="w-5 h-5" /> },
];

export const INITIAL_TAGS = [
  { id: '1', name: 'Maths' },
  { id: '2', name: 'Notes' },
  { id: '3', name: 'Deep Work' },
  { id: '4', name: 'Coding' }
];

export const DEFAULT_PRESETS = [
  { id: 'p1', name: 'Quick Focus', durationMinutes: 15 },
  { id: 'p2', name: 'Pomodoro', durationMinutes: 25 },
  { id: 'p3', name: 'Deep Work', durationMinutes: 45 },
  { id: 'p4', name: 'Extreme Focus', durationMinutes: 90 },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u1',
    username: 'THE KING OF H#LL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=King',
    location: '',
    badges: [],
    timeLogged: '10h 28m',
    kudos: 237
  },
  {
    rank: 2,
    userId: 'u2',
    username: 'Pinkman',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pinkman',
    location: 'CA',
    badges: [],
    hasTrophy: true,
    timeLogged: '10h 8m',
    kudos: 594
  },
  {
    rank: 3,
    userId: 'u3',
    username: 'Tyler Durden',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler',
    location: 'IN',
    badges: [{ label: '10TH GRADE', color: 'bg-blue-600/30 text-blue-400' }],
    timeLogged: '9h 57m',
    kudos: 62
  },
  {
    rank: 4,
    userId: 'u4',
    username: 'The Perfect and Remarkable Newt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Newt',
    location: 'CA',
    badges: [{ label: 'Celpib Till Feb', color: 'bg-blue-600/30 text-blue-400' }],
    timeLogged: '9h 23m',
    kudos: 11
  },
  {
    rank: 5,
    userId: 'u5',
    username: 'The Fearless and Glorious Fox',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fox',
    location: 'IN',
    badges: [{ label: 'GATE', color: 'bg-blue-600/30 text-blue-400' }],
    hasTrophy: true,
    timeLogged: '9h 0m',
    kudos: 1533
  },
  {
    rank: 6,
    userId: 'u6',
    username: 'SBS(7)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SBS',
    location: 'NP',
    badges: [{ label: 'NRB', color: 'bg-blue-600/30 text-blue-400' }],
    timeLogged: '8h 55m',
    kudos: 215
  }
];
