
import React from 'react';
import { TimerPreset } from '../types';
import { X, Clock, Play } from 'lucide-react';

interface PresetOverlayProps {
  presets: TimerPreset[];
  onApply: (minutes: number) => void;
  onClose: () => void;
}

export const PresetOverlay: React.FC<PresetOverlayProps> = ({ presets, onApply, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Presets</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => onApply(preset.durationMinutes)}
              className="w-full flex items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-2xl hover:border-[#00D9A3] group transition-all"
            >
              <div className="text-left">
                <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{preset.name}</p>
                <p className="text-xs text-slate-500">{preset.durationMinutes} minutes</p>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-[#00D9A3] group-hover:text-[#0b1121] transition-all">
                <Clock className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <p className="text-xs text-slate-500 text-center">Select a duration to update the timer</p>
        </div>
      </div>
    </div>
  );
};
