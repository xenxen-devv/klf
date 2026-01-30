
import React, { useState } from 'react';
import { FocusSession } from '../types';
// Fix: Use native Date logic for startOfMonth and substitute subMonths with addMonths
import { format, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Tag as TagIcon } from 'lucide-react';

interface ReviewPageProps {
  sessions: FocusSession[];
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ sessions }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const days = eachDayOfInterval({
    // Fix: Use native Date for start of month
    start: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
    end: endOfMonth(currentMonth)
  });

  const selectedSessions = sessions.filter(s => 
    selectedDate && isSameDay(new Date(s.startTime), selectedDate)
  );

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Review</h1>
          <p className="text-slate-500">Track your daily focus sessions over time.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-800/40 border border-slate-800 p-1.5 rounded-xl">
           <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
           </button>
           <span className="text-sm font-bold min-w-[120px] text-center">{format(currentMonth, 'MMMM yyyy')}</span>
           <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-800 rounded-3xl p-6">
          <div className="grid grid-cols-7 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => {
              const hasSession = sessions.some(s => isSameDay(new Date(s.startTime), day));
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all relative group ${
                    isSelected ? 'bg-[#00D9A3] text-[#0b1121] scale-105 shadow-xl shadow-[#00D9A3]/20' : 
                    isSameMonth(day, currentMonth) ? 'bg-slate-800/50 hover:bg-slate-800 text-white' : 'text-slate-600'
                  }`}
                >
                  <span className="text-sm font-bold">{format(day, 'd')}</span>
                  {hasSession && !isSelected && (
                    <div className="absolute bottom-2 w-1 h-1 rounded-full bg-[#00D9A3]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8 overflow-y-auto custom-scrollbar max-h-[600px]">
          <h3 className="font-bold text-lg mb-6">
            Sessions on {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Selected Date'}
          </h3>
          <div className="space-y-4">
            {selectedSessions.length === 0 ? (
              <p className="text-slate-500 text-center py-10">No focus sessions found for this day.</p>
            ) : (
              selectedSessions.map(session => (
                <div key={session.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-[#00D9A3] font-bold">{format(session.startTime, 'h:mm a')}</span>
                    <span className="text-xs text-slate-500">{Math.round(session.actualDurationSeconds / 60)}m</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {session.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400">#{t}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
