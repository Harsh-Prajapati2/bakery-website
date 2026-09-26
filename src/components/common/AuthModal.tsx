import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { signInUser, signUpUser, signOutUser } from '../../services/supabaseService';
import { X, Lock, Mail, User, ShieldCheck, ChefHat, Sparkles, Check, LogOut } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  onSwitchToKitchenOps?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  setCurrentUser,
  onSwitchToKitchenOps,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'patron' | 'pastry_chef'>('patron');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const { user, error } = await signInUser(email, password);
        if (error) {
          setErrorMsg(error);
        } else if (user) {
          setCurrentUser(user);
          setSuccessMsg(`Welcome back, ${user.fullName}!`);
          setTimeout(() => {
            onClose();
          }, 900);
        }
      } else {
        const { user, error } = await signUpUser(email, password, fullName, role);
        if (error) {
          setErrorMsg(error);
        } else if (user) {
          setCurrentUser(user);
          setSuccessMsg('Account registered successfully!');
          setTimeout(() => {
            onClose();
          }, 900);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleType: 'patron' | 'pastry_chef') => {
    const demoUser: UserProfile = {
      id: `demo-${Date.now()}`,
      email: roleType === 'pastry_chef' ? 'chef.luc@kananatelier.in' : 'patron.sophie@gmail.com',
      fullName: roleType === 'pastry_chef' ? 'Chef Jean-Luc (Master Decorator)' : 'Sophie Deshmukh',
      role: roleType,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(demoUser);
    localStorage.setItem('kanan_demo_user', JSON.stringify(demoUser));
    setSuccessMsg(`Switched to demo: ${demoUser.fullName} (${roleType})`);
    setTimeout(() => {
      onClose();
      if (roleType === 'pastry_chef' && onSwitchToKitchenOps) {
        onSwitchToKitchenOps();
      }
    }, 700);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    setSuccessMsg('Signed out');
    setTimeout(() => onClose(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-[#1d0e0c] border border-[#44211d] rounded-3xl shadow-2xl overflow-hidden text-[#f7efe6] relative p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2a1310] hover:bg-[#3d1a16] border border-[#48221d] flex items-center justify-center text-[#debba9] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          /* Profile & Logout View */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 mx-auto flex items-center justify-center">
              {currentUser.role === 'pastry_chef' ? (
                <ChefHat className="w-8 h-8" />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentUser.role === 'pastry_chef' ? 'Head Pastry Chef' : 'Atelier Patron'}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#faeedd] mt-2">
                {currentUser.fullName}
              </h3>
              <p className="text-xs text-[#a98271] mt-0.5">{currentUser.email}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#140807] border border-[#2d1411] text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#8e6857]">User ID:</span>
                <span className="font-mono text-[#debba9] truncate max-w-[180px]">{currentUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Backend Auth:</span>
                <span className={isSupabaseConfigured ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                  {isSupabaseConfigured ? 'Supabase Auth (Live)' : 'Local Demo Session'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {currentUser.role === 'pastry_chef' && onSwitchToKitchenOps && (
                <button
                  onClick={() => {
                    onSwitchToKitchenOps();
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-800 to-rose-900 text-amber-100 text-xs font-semibold hover:from-red-700 hover:to-rose-800 transition-colors"
                >
                  Open Kitchen Ops Console
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex-1 py-2.5 rounded-xl bg-[#2a1310] hover:bg-[#3d1a16] border border-[#48221d] text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Forms */
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-xl font-bold text-[#faeedd]">
                  Atelier Authentication
                </h3>
              </div>
              <p className="text-xs text-[#a98271] mt-1">
                {isSupabaseConfigured 
                  ? 'Connected to Supabase PostgreSQL Auth database.' 
                  : 'Supabase Auth Client ready (Demo mode active).'}
              </p>
            </div>

            {/* Notification messages */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-[#311613]">
              <button
                onClick={() => setTab('signin')}
                className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                  tab === 'signin'
                    ? 'text-amber-300 border-b-2 border-amber-400'
                    : 'text-[#8e6857] hover:text-[#d4af94]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                  tab === 'signup'
                    ? 'text-amber-300 border-b-2 border-amber-400'
                    : 'text-[#8e6857] hover:text-[#d4af94]'
                }`}
              >
                Register Patron
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {tab === 'signup' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[#debba9] font-medium flex items-center gap-1">
                      <User className="w-3 h-3 text-amber-400" />
                      Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sophie Deshmukh"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#debba9] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      Account Role:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('patron')}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          role === 'patron'
                            ? 'bg-amber-950/60 text-amber-200 border-amber-500'
                            : 'bg-[#140807] text-[#8e6857] border-[#311613]'
                        }`}
                      >
                        Atelier Patron
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('pastry_chef')}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          role === 'pastry_chef'
                            ? 'bg-rose-950/60 text-rose-200 border-rose-500'
                            : 'bg-[#140807] text-[#8e6857] border-[#311613]'
                        }`}
                      >
                        Pastry Chef (Kitchen)
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[#debba9] font-medium flex items-center gap-1">
                  <Mail className="w-3 h-3 text-amber-400" />
                  Email Address:
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#debba9] font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-xs shadow-lg transition-all hover:scale-[1.01] cursor-pointer mt-2"
              >
                {loading 
                  ? 'Connecting to Supabase...' 
                  : tab === 'signin' 
                    ? 'Sign In with Supabase' 
                    : 'Create Supabase Profile'}
              </button>
            </form>

            {/* Quick 1-Click Role Switchers for testing */}
            <div className="pt-3 border-t border-[#311613] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#8e6857] block text-center">
                Quick Test Profiles (1-Click Switch)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('patron')}
                  className="p-2 rounded-xl bg-[#140807] hover:bg-[#251210] border border-[#361a17] text-left text-[11px] text-[#debba9] transition-colors"
                >
                  <strong className="block text-white">Patron Client</strong>
                  <span className="text-[#8e6857] text-[10px]">Sophie (Boutique)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('pastry_chef')}
                  className="p-2 rounded-xl bg-[#140807] hover:bg-[#251210] border border-[#361a17] text-left text-[11px] text-[#debba9] transition-colors"
                >
                  <strong className="block text-rose-300">Head Pastry Chef</strong>
                  <span className="text-[#8e6857] text-[10px]">Jean-Luc (Kitchen Ops)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
