
import React, { useState } from 'react';
import { NAV_ITEMS, COLORS } from '../constants';
import { UserStats, ViewType } from '../types';
import { Settings, MessageSquare, LogOut, Sun, Moon, Flame, Clock, CheckCircle, Cloud, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  stats: UserStats;
  user: { name: string; email: string };
  onLogout: () => void;
  isSyncing?: boolean;
  lastSynced?: Date;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, currentView, onNavigate, stats, user, onLogout, isSyncing, lastSynced 
}) => {
  const [darkMode, setDarkMode] = useState(true);
  const [leaderboardTab, setLeaderboardTab] = useState<'day' | 'week' | 'month'>('day');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0b1121] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] flex flex-col border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#00D9A3] flex items-center justify-center font-bold text-black">K</div>
            <h1 className="text-xl font-bold tracking-tight">Kairu</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">Stay focused, achieve more</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <React.Fragment key={item.id}>
              <button
                onClick={() => onNavigate(item.id as ViewType)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  currentView === item.id 
                    ? 'bg-slate-800 text-[#00D9A3]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 text-xs">›</span>
              </button>
              
              {item.id === 'leaderboard' && currentView === 'leaderboard' && (
                <div className="mt-2 mb-4 ml-4 space-y-1 border-l border-slate-800 pl-4 animate-in slide-in-from-top-2 duration-300">
                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 px-3">Time</p>
                   {['day', 'week', 'month'].map((tab) => (
                     <button
                       key={tab}
                       onClick={() => setLeaderboardTab(tab as any)}
                       className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                         leaderboardTab === tab ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'
                       }`}
                     >
                       {tab.charAt(0).toUpperCase() + tab.slice(1)}
                     </button>
                   ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="mt-auto flex flex-col p-4 border-t border-slate-800 gap-4">
          {/* Cloud Sync Status */}
          <div className="px-3 py-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isSyncing ? 'Syncing...' : 'Cloud Connected'}
                </span>
              </div>
              <button className="text-slate-600 hover:text-white transition-colors">
                <RefreshCcw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-[10px] text-slate-600 font-medium">
              Last synced: {lastSynced ? format(lastSynced, 'HH:mm:ss') : 'Never'}
            </p>
          </div>

          <div className="flex items-center gap-3 px-2">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
            />
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500">Welcome</p>
              <p className="text-sm font-semibold truncate">{user.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <button className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-3">
               <button className="text-slate-500 hover:text-white transition-colors"><Sun className="w-4 h-4" /></button>
               <button className="text-slate-500 hover:text-white transition-colors"><Moon className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-full w-12 h-6 relative cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
               <div className={`absolute w-5 h-5 bg-white rounded-full transition-all duration-300 ${darkMode ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Sync Indicator for Main View */}
        {isSyncing && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#00D9A3] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Cloud className="w-3 h-3 animate-pulse" />
            Syncing...
          </div>
        )}

        <header className="absolute top-0 right-0 p-6 flex items-center gap-6 z-10">
          <div className="flex items-center gap-1.5 group cursor-default">
            <Flame className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm text-orange-500">{stats.streak}</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-default">
            <Clock className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm text-sky-400">{stats.todayMinutes}m</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-default">
            <CheckCircle className="w-4 h-4 text-[#00D9A3] group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm text-[#00D9A3]">{stats.todaySessions}</span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </section>
      </main>
    </div>
  );
};
