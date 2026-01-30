
import React, { useState, useMemo } from 'react';
import { FocusSession, UserStats, Tag } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
// Fix: Remove missing startOfMonth and unused endOfMonth; substitute subDays with addDays
import { format, addDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { Flame, Target, TrendingUp, Calendar, Hash } from 'lucide-react';

interface AnalyzePageProps {
  sessions: FocusSession[];
  stats: UserStats;
  tags: Tag[];
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ sessions, stats, tags }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'tags'>('overview');

  const dailyData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      // Fix: Use addDays with negative value
      start: addDays(new Date(), -6),
      end: new Date()
    });

    return last7Days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const daySessions = sessions.filter(s => s.date === dateStr);
      const totalHours = daySessions.reduce((acc, s) => acc + (s.actualDurationSeconds / 3600), 0);
      return {
        name: format(day, 'EEE'),
        hours: parseFloat(totalHours.toFixed(2)),
        isWeekend: day.getDay() === 0 || day.getDay() === 6
      };
    });
  }, [sessions]);

  const tagData = useMemo(() => {
    const map = new Map<string, number>();
    sessions.forEach(s => {
      s.tags.forEach(tag => {
        const hours = s.actualDurationSeconds / 3600;
        map.set(tag, (map.get(tag) || 0) + hours);
      });
    });

    return Array.from(map.entries()).map(([name, hours]) => ({
      name,
      value: parseFloat(hours.toFixed(2))
    })).sort((a, b) => b.value - a.value);
  }, [sessions]);

  const COLORS = ['#00D9A3', '#38bdf8', '#818cf8', '#fbbf24', '#f87171', '#c084fc'];

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Analyze</h1>
        <p className="text-slate-500">Visualize your productivity patterns and trends.</p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit mb-10">
        {(['overview', 'daily', 'tags'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-3 bg-slate-800/40 border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" /> Activity Map
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-slate-700" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-900" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <div className="w-3 h-3 rounded-sm bg-[#00D9A3]" />
                </div>
                <span>More</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-30 gap-1.5">
               {/* Simplified Heatmap Logic */}
               {Array.from({ length: 90 }).map((_, i) => {
                 const date = addDays(new Date(), -(89 - i));
                 const dateStr = format(date, 'yyyy-MM-dd');
                 const intensity = sessions.filter(s => s.date === dateStr).length;
                 const colorClass = intensity === 0 ? 'bg-slate-800' :
                                  intensity < 2 ? 'bg-emerald-900' :
                                  intensity < 4 ? 'bg-emerald-700' :
                                  'bg-[#00D9A3]';
                 return (
                   <div 
                    key={i} 
                    className={`aspect-square w-full min-w-[12px] rounded-[2px] ${colorClass} transition-colors hover:ring-2 hover:ring-white`}
                    title={`${dateStr}: ${intensity} sessions`}
                   />
                 );
               })}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8">
            <Flame className="w-8 h-8 text-orange-500 mb-4" />
            <p className="text-slate-500 text-sm font-medium mb-1">Current Streak</p>
            <h4 className="text-4xl font-black">{stats.streak} days</h4>
            <p className="text-xs text-slate-400 mt-4">Longest: {stats.longestStreak} days</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8">
            <Target className="w-8 h-8 text-sky-500 mb-4" />
            <p className="text-slate-500 text-sm font-medium mb-1">Total Time Today</p>
            <h4 className="text-4xl font-black">{stats.todayMinutes}m</h4>
            <p className="text-xs text-slate-400 mt-4">Target: 120m</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8">
            <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
            <p className="text-slate-500 text-sm font-medium mb-1">Sessions Today</p>
            <h4 className="text-4xl font-black">{stats.todaySessions}</h4>
            <p className="text-xs text-slate-400 mt-4">Weekly avg: 4.2</p>
          </div>
        </div>
      )}

      {activeTab === 'daily' && (
        <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8 h-[500px] animate-in fade-in zoom-in-95 duration-500">
           <h3 className="font-bold text-lg mb-8">Daily Focus Hours</h3>
           <ResponsiveContainer width="100%" height="90%">
             <BarChart data={dailyData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
               <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
               />
               <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
               />
               <Tooltip 
                cursor={{ fill: '#334155' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#00D9A3' }}
               />
               <Bar 
                dataKey="hours" 
                radius={[6, 6, 0, 0]}
                fill="#00D9A3"
               />
             </BarChart>
           </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'tags' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8 h-[400px]">
             <h3 className="font-bold text-lg mb-4">Time Distribution</h3>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={tagData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={100}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {tagData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>

           <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8 overflow-y-auto custom-scrollbar">
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Hash className="w-5 h-5 text-emerald-500" /> Tag Statistics
             </h3>
             <div className="space-y-4">
               {tagData.length === 0 ? (
                 <p className="text-slate-500 text-center py-12">No tags logged yet.</p>
               ) : (
                 tagData.map((tag, idx) => (
                   <div key={tag.name} className="flex flex-col gap-2">
                     <div className="flex justify-between text-sm">
                       <span className="font-medium text-slate-300">{tag.name}</span>
                       <span className="text-emerald-500">{tag.value} hrs</span>
                     </div>
                     <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                       <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${(tag.value / tagData.reduce((acc, t) => acc + t.value, 0)) * 100}%`,
                          backgroundColor: COLORS[idx % COLORS.length]
                        }}
                       />
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
