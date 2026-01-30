
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { FocusPage } from './components/FocusPage';
import { AnalyzePage } from './components/AnalyzePage';
import { ReviewPage } from './components/ReviewPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { AuthPage } from './components/AuthPage';
import { Tag, FocusSession, Todo, ViewType, TimerPreset, UserStats } from './types';
import { INITIAL_TAGS, DEFAULT_PRESETS } from './constants';
import { cloudDB } from './services/db';
import { format, addDays } from 'date-fns';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('kairu_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  
  const [currentView, setCurrentView] = useState<ViewType>('focus');
  const [tags, setTags] = useState<Tag[]>([]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [presets, setPresets] = useState<TimerPreset[]>([]);

  // Hydrate from Firebase
  useEffect(() => {
    if (!user) {
      setIsInitialLoading(false);
      return;
    }

    const hydrate = async () => {
      try {
        const [cloudSessions, cloudTags, cloudTodos, cloudPresets] = await Promise.all([
          cloudDB.getSessions(user.email),
          cloudDB.getTags(user.email),
          cloudDB.getTodos(user.email),
          cloudDB.getPresets(user.email)
        ]);

        setSessions(cloudSessions);
        setTags(cloudTags.length > 0 ? cloudTags : INITIAL_TAGS);
        setTodos(cloudTodos);
        setPresets(cloudPresets.length > 0 ? cloudPresets : DEFAULT_PRESETS);
      } catch (e) {
        console.error("Firebase hydration failed", e);
      } finally {
        setIsInitialLoading(false);
        setLastSynced(new Date());
      }
    };

    hydrate();
  }, [user]);

  // Handle User Persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('kairu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kairu_user');
    }
  }, [user]);

  // Derived Stats
  const getStats = useCallback((): UserStats => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaySessions = sessions.filter(s => s.date === today);
    const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.actualDurationSeconds / 60), 0);
    
    let streak = 0;
    let checkDate = new Date();
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const dayHasSession = sessions.some(s => s.date === dateStr);
      if (dayHasSession) {
        streak++;
        checkDate = addDays(checkDate, -1);
      } else {
        break;
      }
    }

    return {
      streak,
      longestStreak: streak, 
      todayMinutes: Math.round(todayMinutes),
      todaySessions: todaySessions.length
    };
  }, [sessions]);

  const stats = getStats();

  // Firebase Write Handlers
  const handleAddSession = async (session: FocusSession) => {
    if (!user) return;
    setIsSyncing(true);
    setSessions(prev => [session, ...prev]); 
    await cloudDB.saveSession(user.email, session);
    setIsSyncing(false);
    setLastSynced(new Date());
  };

  const handleAddTag = async (name: string) => {
    if (!user) return { id: '', name: '' };
    setIsSyncing(true);
    const newTag: Tag = { id: Date.now().toString(), name };
    const updated = [...tags, newTag];
    setTags(updated);
    await cloudDB.saveTags(user.email, updated);
    setIsSyncing(false);
    setLastSynced(new Date());
    return newTag;
  };

  const handleDeleteTag = async (id: string) => {
    if (!user) return;
    setIsSyncing(true);
    const updated = tags.filter(t => t.id !== id);
    setTags(updated);
    await cloudDB.deleteTag(user.email, id);
    setIsSyncing(false);
    setLastSynced(new Date());
  };

  const handleAddTodo = async (text: string) => {
    if (!user) return;
    setIsSyncing(true);
    const updated = [...todos, { id: Date.now().toString(), text, completed: false }];
    setTodos(updated);
    await cloudDB.saveTodos(user.email, updated);
    setIsSyncing(false);
    setLastSynced(new Date());
  };

  const toggleTodo = async (id: string) => {
    if (!user) return;
    setIsSyncing(true);
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(updated);
    await cloudDB.saveTodos(user.email, updated);
    setIsSyncing(false);
    setLastSynced(new Date());
  };

  if (!user) {
    return <AuthPage onLogin={(email, name) => setUser({ email, name })} />;
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#0b1121] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-[#00D9A3] flex items-center justify-center font-black text-2xl text-black mb-6 animate-pulse shadow-2xl shadow-emerald-500/20">K</div>
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting to Firebase...
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'focus':
        return (
          <FocusPage 
            tags={tags} 
            onAddSession={handleAddSession} 
            onAddTag={handleAddTag} 
            onManageTags={handleDeleteTag}
            presets={presets}
            sessions={sessions}
            todos={todos}
            onToggleTodo={toggleTodo}
            onAddTodo={handleAddTodo}
          />
        );
      case 'analyze':
        return <AnalyzePage sessions={sessions} stats={stats} tags={tags} />;
      case 'review':
        return <ReviewPage sessions={sessions} />;
      case 'leaderboard':
        return <LeaderboardPage user={user} sessions={sessions} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{currentView.toUpperCase()}</h2>
              <p>This feature is coming soon to Kairu.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      stats={stats} 
      user={user}
      onLogout={() => {
        setUser(null);
        setSessions([]);
        setTags([]);
        setTodos([]);
      }}
      isSyncing={isSyncing}
      lastSynced={lastSynced}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
