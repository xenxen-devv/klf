import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TagInput } from './TagInput';
import { TimerCircle } from './TimerCircle';
import { Tag, FocusSession, TimerPreset, Todo } from '../types';
import { Settings, List, ClipboardCheck, Volume2, VolumeX, Play, Square, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { LogOverlay } from './LogOverlay';
import { TodoOverlay } from './TodoOverlay';
import { PresetOverlay } from './PresetOverlay';

interface FocusPageProps {
  tags: Tag[];
  onAddTag: (name: string) => Tag;
  onAddSession: (session: FocusSession) => void;
  onManageTags: (id: string) => void;
  presets: TimerPreset[];
  sessions: FocusSession[];
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (text: string) => void;
}

export const FocusPage: React.FC<FocusPageProps> = ({ 
  tags, onAddTag, onAddSession, onManageTags, presets, sessions, todos, onToggleTodo, onAddTodo 
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [duration, setDuration] = useState(25 * 60); // 25 mins in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState<'log' | 'todo' | 'config' | null>(null);
  
  // Fix: Replaced NodeJS.Timeout with any to resolve "Cannot find namespace 'NodeJS'" error in browser-based environments.
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);

  const startSession = useCallback(() => {
    if (isActive) return;
    setIsActive(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    setTimeLeft(duration);
  }, [isActive, duration]);

  const pauseSession = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const stopSession = useCallback(() => {
    if (!isActive) return;
    
    // Log the session
    const actualSeconds = duration - timeLeft;
    const session: FocusSession = {
      id: Date.now().toString(),
      startTime: startTimeRef.current || Date.now(),
      endTime: Date.now(),
      actualDurationSeconds: actualSeconds,
      targetDurationSeconds: duration,
      tags: selectedTags,
      status: timeLeft === 0 ? 'completed' : 'partial',
      date: format(new Date(), 'yyyy-MM-dd')
    };

    onAddSession(session);
    
    // Reset timer
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [isActive, duration, timeLeft, selectedTags, onAddSession]);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      stopSession();
      // Play completion sound logic here
      if (volume) {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play();
        } catch(e) {}
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, timeLeft, stopSession, volume]);

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isActive) startSession();
        else pauseSession();
      } else if (e.code === 'Escape') {
        if (isActive) stopSession();
      } else if (e.key.toLowerCase() === 'l') {
        setActiveOverlay(prev => prev === 'log' ? null : 'log');
      } else if (e.key.toLowerCase() === 't') {
        setActiveOverlay(prev => prev === 'todo' ? null : 'todo');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, startSession, pauseSession, stopSession]);

  const handleApplyPreset = (minutes: number) => {
    setDuration(minutes * 60);
    setTimeLeft(minutes * 60);
    setActiveOverlay(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 pb-20">
      <div className="w-full max-w-sm mb-12">
        <TagInput 
          allTags={tags} 
          selectedTags={selectedTags} 
          onToggleTag={(tagName) => setSelectedTags(prev => 
            prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
          )}
          onAddTag={onAddTag}
          onManageTags={onManageTags}
        />
      </div>

      <div className="relative group mb-12">
        <TimerCircle 
          percent={isActive ? (timeLeft / duration) * 100 : 100} 
          timeLeft={timeLeft}
          isActive={isActive}
        />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-sm font-medium text-[#00D9A3] uppercase tracking-widest mb-1 opacity-80">Focus</p>
          <h2 className="text-7xl font-bold font-mono tracking-tighter">
            {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
            {(timeLeft % 60).toString().padStart(2, '0')}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-16">
        <button 
          onClick={isActive ? stopSession : startSession}
          className={`px-8 py-3.5 rounded-full flex items-center gap-3 font-bold transition-all duration-300 shadow-xl shadow-emerald-900/20 active:scale-95 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-[#00D9A3] hover:bg-[#00c092] text-[#0b1121]'
          }`}
        >
          {isActive ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          {isActive ? 'Stop Session' : 'Start Focus Session'}
        </button>
        
        <button 
          onClick={() => setVolume(!volume)}
          className="p-3.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          {volume ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setActiveOverlay('config')}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-800/40 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all text-sm font-medium"
        >
          <Settings className="w-4 h-4" /> Configure
        </button>
        <button 
          onClick={() => setActiveOverlay('log')}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-800/40 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all text-sm font-medium"
        >
          <List className="w-4 h-4" /> Log
        </button>
        <button 
          onClick={() => setActiveOverlay('todo')}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-800/40 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all text-sm font-medium"
        >
          <ClipboardCheck className="w-4 h-4" /> Todo
        </button>
      </div>

      {/* Overlays */}
      {activeOverlay === 'log' && <LogOverlay sessions={sessions} onClose={() => setActiveOverlay(null)} />}
      {activeOverlay === 'todo' && <TodoOverlay todos={todos} onToggle={onToggleTodo} onAdd={onAddTodo} onClose={() => setActiveOverlay(null)} />}
      {activeOverlay === 'config' && <PresetOverlay presets={presets} onApply={handleApplyPreset} onClose={() => setActiveOverlay(null)} />}
    </div>
  );
};