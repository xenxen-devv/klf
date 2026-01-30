
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Globe, User as UserIcon, Clock, Flame, ChevronDown } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../constants';
import { FocusSession, LeaderboardEntry } from '../types';
// Fix: Use native Date constructor instead of missing parseISO
import { isSameDay, isSameWeek, isSameMonth } from 'date-fns';

interface LeaderboardPageProps {
  user: { name: string; email: string };
  sessions: FocusSession[];
}

const MedalIcon = ({ type }: { type: 'gold' | 'silver' | 'bronze' }) => {
  const colors = {
    gold: { circle: 'fill-orange-500', number: 'text-orange-900', ring: 'stroke-orange-400' },
    silver: { circle: 'fill-slate-300', number: 'text-slate-800', ring: 'stroke-slate-200' },
    bronze: { circle: 'fill-amber-600', number: 'text-amber-950', ring: 'stroke-amber-500' }
  };
  const { circle, number, ring } = colors[type];
  const medalNum = type === 'gold' ? '1' : type === 'silver' ? '2' : '3';

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md">
        <circle cx="16" cy="16" r="14" className={circle} />
        <circle cx="16" cy="16" r="11" fill="none" strokeWidth="1" className={ring} />
      </svg>
      <span className={`absolute font-black text-xs ${number}`}>{medalNum}</span>
    </div>
  );
};

const TrophyIcon = () => (
  <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-500">
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 10V7h2v3c0 1.21-.88 2.22-2 2.39V10zm14 0c-1.12.17-2 1.18-2 2.39V7h2v3z"/>
    </svg>
  </div>
);

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ user, sessions }) => {
  const [activeTab, setActiveTab] = useState<'Day' | 'Week' | 'Month' | 'Year' | 'All Time'>('Day');
  const [scope, setScope] = useState<'everyone' | 'friends'>('everyone');
  const [countdown, setCountdown] = useState('07:50:00');

  // Format time helper: seconds to "Xh Ym"
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  // Convert "Xh Ym" back to seconds for sorting
  const timeToSeconds = (timeStr: string) => {
    const parts = timeStr.match(/(\d+)h\s+(\d+)m/);
    if (!parts) return 0;
    return parseInt(parts[1]) * 3600 + parseInt(parts[2]) * 60;
  };

  // Dynamic ranking logic
  const leaderboardEntries = useMemo(() => {
    const now = new Date();
    
    // Filter user sessions based on period
    const filteredSessions = sessions.filter(s => {
      // Fix: Substitute missing parseISO with native Date constructor
      const sessionDate = new Date(s.date);
      if (activeTab === 'Day') return isSameDay(sessionDate, now);
      if (activeTab === 'Week') return isSameWeek(sessionDate, now);
      if (activeTab === 'Month') return isSameMonth(sessionDate, now);
      return true; // For All Time/Year
    });

    const totalUserSeconds = filteredSessions.reduce((acc, s) => acc + s.actualDurationSeconds, 0);

    // Create entry for current user
    const currentUserEntry: LeaderboardEntry = {
      rank: 0, // Calculated after sorting
      userId: 'current-user',
      username: user.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      location: 'ME',
      badges: [{ label: 'PRO', color: 'bg-emerald-500/20 text-emerald-400' }],
      timeLogged: formatTime(totalUserSeconds),
      kudos: 0,
      isCurrentUser: true
    };

    // Merge with mock data and sort
    let allEntries = [...MOCK_LEADERBOARD, currentUserEntry].sort((a, b) => {
      return timeToSeconds(b.timeLogged) - timeToSeconds(a.timeLogged);
    });

    // Assign final ranks
    allEntries = allEntries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    // Filter by scope
    if (scope === 'friends') {
      // In this app, only you are in the "database", so Friends only includes you
      return allEntries.filter(e => e.isCurrentUser);
    }

    return allEntries;
  }, [user, sessions, activeTab, scope]);

  // Simple countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        const parts = prev.split(':').map(Number);
        let [h, m, s] = parts;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full bg-[#0b1121] flex flex-col">
      {/* Top Filter Bar */}
      <div className="bg-[#0f172a] border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg text-sm text-slate-400 font-medium border border-slate-700">
            Time <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl">
            {(['Day', 'Week', 'Month', 'Year', 'All Time'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setScope('everyone')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === 'everyone' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Everyone
            </button>
            <button
              onClick={() => setScope('friends')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === 'friends' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Friends
            </button>
          </div>
          <button className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg text-sm text-slate-400 font-medium border border-slate-700">
            <Globe className="w-4 h-4" />
            All Countries
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leaderboard Header Section */}
      <div className="px-8 py-10 relative">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">{activeTab} Leaderboard</h2>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <button className="text-slate-600 hover:text-white transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-300">Today</p>
              <p className="text-slate-500 font-medium">January 29, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
              <button className="text-slate-600 hover:text-white transition-colors">
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>

        {/* Competition Status Bar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-start gap-3">
             <div className="bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-500/30">Active</div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-slate-200">Unranked</span>
               <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">{activeTab} - {scope === 'friends' ? 'Friends' : 'Everyone'} - World</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ends in</span>
               <span className="text-sm font-black text-slate-300 tabular-nums">{countdown}</span>
            </div>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors">
              Get More Info
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20">
              Kudos
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="flex-1 px-8 pb-10">
        <div className="w-full">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-800">
            <div className="col-span-8">User</div>
            <div className="col-span-2 text-right">Time</div>
            <div className="col-span-2 text-right">Kudos</div>
          </div>

          <div className="space-y-px mt-1">
            {leaderboardEntries.map((entry) => (
              <div 
                key={entry.userId} 
                className={`grid grid-cols-12 gap-4 px-6 py-5 hover:bg-[#1a2332] border transition-all cursor-pointer group rounded-xl ${
                  entry.isCurrentUser 
                  ? 'bg-blue-600/5 border-blue-600/20 shadow-inner' 
                  : 'bg-[#141d2e]/40 border-transparent hover:border-slate-800'
                }`}
              >
                <div className="col-span-8 flex items-center gap-6">
                  <div className="flex items-center gap-3 w-16">
                    <span className="text-slate-500 font-black text-sm w-4">{entry.rank}</span>
                    {entry.rank === 1 && <MedalIcon type="gold" />}
                    {entry.rank === 2 && <MedalIcon type="silver" />}
                    {entry.rank === 3 && <MedalIcon type="bronze" />}
                    {entry.hasTrophy && <TrophyIcon />}
                  </div>

                  {entry.location && (
                    <div className="bg-slate-800 px-2 py-1 rounded text-[10px] font-black text-slate-400">
                      {entry.location}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={entry.avatar} className="w-11 h-11 rounded-full border border-slate-700 bg-slate-800" alt={entry.username} />
                      <div className="absolute -right-1 -bottom-1 bg-slate-800 p-1 rounded-full border border-slate-900">
                        <UserIcon className="w-2 h-2 text-slate-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-[15px] ${entry.isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                        {entry.username} {entry.isCurrentUser && '(You)'}
                      </span>
                      <div className="flex gap-2">
                        {entry.badges.map((badge, i) => (
                          <span 
                            key={i} 
                            className={`${badge.color} px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider`}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2 text-slate-400 font-bold text-sm tabular-nums">
                  <Clock className="w-4 h-4 text-slate-600" />
                  {entry.timeLogged}
                </div>

                <div className="col-span-2 flex items-center justify-end gap-3">
                  <span className="text-white font-bold tabular-nums">{entry.kudos}</span>
                  <div className="p-2 bg-orange-500/10 rounded-full border border-orange-500/20">
                    <Flame className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
              </div>
            ))}

            {leaderboardEntries.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">No activity found for this period.</p>
                <p className="text-sm">Start a focus session to see yourself here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
