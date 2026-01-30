
import React from 'react';
import { FocusSession } from '../types';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface LogOverlayProps {
  sessions: FocusSession[];
  onClose: () => void;
}

export const LogOverlay: React.FC<LogOverlayProps> = ({ sessions, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Session History</h2>
            <p className="text-xs text-slate-500 mt-1">Review your recent focus activities</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {sessions.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No sessions logged yet.</p>
              <p className="text-sm">Start focusing to see your history here!</p>
            </div>
          ) : (
            sessions.map(session => (
              <div key={session.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${session.status === 'completed' ? 'bg-[#00D9A3]' : 'bg-amber-500'}`} />
                    <span className="text-sm font-semibold capitalize">{session.status}</span>
                  </div>
                  <span className="text-xs text-slate-500">{format(session.startTime, 'MMM d, h:mm a')}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{Math.round(session.actualDurationSeconds / 60)}m / {Math.round(session.targetDurationSeconds / 60)}m</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{session.date}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {session.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-900 rounded text-[10px] text-slate-300 font-medium">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
