
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Loader2, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, name: string) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mocking Auth delay
    setTimeout(() => {
      if (mode === 'forgot') {
        alert('Password reset link sent to ' + email);
        setMode('login');
        setIsLoading(false);
        return;
      }

      if (email && (mode === 'signup' ? name : true)) {
        onLogin(email, mode === 'signup' ? name : email.split('@')[0]);
      } else {
        setError('Please fill in all required fields.');
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setError(null);
    
    // Simulate OAuth redirect and handshake
    setTimeout(() => {
      onLogin('alex.focus@gmail.com', 'Alex Focus');
      setIsGoogleLoading(false);
    }, 1500);
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin('dev.kairu@github.com', 'Kairu Developer');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b1121] flex items-center justify-center p-4">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#00D9A3] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00D9A3] text-black font-black text-2xl mb-6 shadow-xl shadow-emerald-500/20">
            K
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Kairu</h1>
          <p className="text-slate-400 font-medium">Stay focused, achieve more</p>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-8 rounded-[32px] shadow-2xl relative">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in slide-in-from-top-2 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00D9A3] transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#00D9A3] outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00D9A3] transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#00D9A3] outline-none transition-all"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-[#00D9A3] hover:underline font-medium"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00D9A3] transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#00D9A3] outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-[#00D9A3] text-[#0b1121] font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#00c092] transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-4 shadow-xl shadow-emerald-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f172a] px-4 text-slate-500 tracking-widest font-bold">Or continue with</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Simulated Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-3.5 rounded-2xl transition-all font-bold text-sm shadow-lg hover:bg-slate-50 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span>{isGoogleLoading ? 'Authenticating...' : 'Continue with Google'}</span>
                </button>

                <button
                  onClick={handleGithubLogin}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 py-3.5 rounded-2xl transition-all font-medium text-sm group disabled:opacity-50"
                >
                  <Github className="w-5 h-5 group-hover:text-white transition-colors" />
                  <span>GitHub</span>
                </button>
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            {mode === 'login' ? (
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-[#00D9A3] font-bold hover:underline">
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-[#00D9A3] font-bold hover:underline">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
