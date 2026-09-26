import React from 'react';
import { ShoppingBag, Sparkles, ChefHat, Search, SlidersHorizontal, MapPin, Clock, Database, User } from 'lucide-react';
import { CartItem, UserProfile } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';

interface NavbarProps {
  currentView: 'storefront' | 'kitchen-ops';
  setCurrentView: (view: 'storefront' | 'kitchen-ops') => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  egglessOnly: boolean;
  setEgglessOnly: (val: boolean) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeNavTab,
  setActiveNavTab,
  cart,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  egglessOnly,
  setEgglessOnly,
  currentUser,
  onOpenAuth,
  onOpenSupabaseModal,
}) => {
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#160c0b]/95 backdrop-blur-md border-b border-[#3d221f] text-[#f7efe6]">
      {/* Topmost Telemetry / Dispatch Ticker Banner */}
      <div className="bg-[#241311] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-[#3b1d19] text-[#d4af94]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            HEARTH ACTIVE: Deck Ovens at 185°C
          </span>
          <span className="hidden md:inline text-[#7b5049]">|</span>
          <span className="hidden md:flex items-center gap-1 text-[#d4af94]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Next Chilled Fleet Wave: 2:00 PM (4 Express slots left)
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Supabase Connection Status Pill */}
          <button
            onClick={onOpenSupabaseModal}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
              isSupabaseConfigured
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                : 'bg-[#2a1412] text-amber-300 border-amber-600/40 hover:border-amber-400'
            }`}
            title="Configure or test Supabase connection"
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Supabase:</span>
            <span>{isSupabaseConfigured ? 'Live' : 'Connect / Demo'}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          </button>

          {/* Quick Eggless Toggle */}
          <button
            onClick={() => setEgglessOnly(!egglessOnly)}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1.5 border ${
              egglessOnly
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-[#2e1815] text-[#caa895] border-[#4a2622] hover:border-amber-400/40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${egglessOnly ? 'bg-emerald-400' : 'bg-emerald-600'}`}></span>
            {egglessOnly ? 'Eggless: ON' : 'Eggless'}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Atelier Subtitle */}
          <div 
            onClick={() => { setCurrentView('storefront'); setActiveNavTab('menu'); }}
            className="cursor-pointer group flex flex-col justify-center"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-black tracking-wider text-[#faeedd] group-hover:text-amber-200 transition-colors">
                KANAN
              </span>
              <span className="text-[10px] tracking-[0.25em] px-1.5 py-0.5 uppercase bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                Atelier
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-[#a9816f] group-hover:text-[#cb9e8a] transition-colors">
              French Patisserie & Hearth Ops
            </span>
          </div>

          {/* Storefront Nav Links (Shown when in storefront mode) */}
          {currentView === 'storefront' && (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={() => setActiveNavTab('menu')}
                className={`px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-all ${
                  activeNavTab === 'menu'
                    ? 'text-amber-300 bg-[#2d1815] border-b-2 border-amber-400'
                    : 'text-[#d6c0b3] hover:text-white hover:bg-[#251412]'
                }`}
              >
                Confection Menu
              </button>
              <button
                onClick={() => setActiveNavTab('custom-builder')}
                className={`px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                  activeNavTab === 'custom-builder'
                    ? 'text-amber-300 bg-[#2d1815] border-b-2 border-amber-400'
                    : 'text-[#d6c0b3] hover:text-white hover:bg-[#251412]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Bespoke Tiers
              </button>
              <button
                onClick={() => setActiveNavTab('tasting-salon')}
                className={`px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-all ${
                  activeNavTab === 'tasting-salon'
                    ? 'text-amber-300 bg-[#2d1815] border-b-2 border-amber-400'
                    : 'text-[#d6c0b3] hover:text-white hover:bg-[#251412]'
                }`}
              >
                Tasting Salon
              </button>
              <button
                onClick={() => setActiveNavTab('story')}
                className={`px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-all ${
                  activeNavTab === 'story'
                    ? 'text-amber-300 bg-[#2d1815] border-b-2 border-amber-400'
                    : 'text-[#d6c0b3] hover:text-white hover:bg-[#251412]'
                }`}
              >
                Our Hearth & Sourcing
              </button>
            </nav>
          )}

          {/* Persistent Mode Switcher: Boutique vs Kitchen Ops Command */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-[#241311] p-1 rounded-xl border border-[#44221e] flex items-center shadow-inner">
              <button
                onClick={() => setCurrentView('storefront')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currentView === 'storefront'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                    : 'text-[#ab8573] hover:text-[#e4cfc2]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Patron</span> Boutique
              </button>

              <button
                onClick={() => setCurrentView('kitchen-ops')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currentView === 'kitchen-ops'
                    ? 'bg-gradient-to-r from-red-800 to-rose-900 text-amber-100 shadow-md border border-red-500/40'
                    : 'text-[#ab8573] hover:text-[#e4cfc2]'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Kitchen</span> Ops Console
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </div>

            {/* Search Input (For Boutique) */}
            {currentView === 'storefront' && (
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 text-[#8f6958] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Valrhona, tarts, tiers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#21110f] border border-[#3e1f1c] rounded-full pl-9 pr-3 py-1.5 text-xs text-[#faeedd] placeholder-[#7d5648] focus:outline-none focus:border-amber-400 w-44 lg:w-56 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-[#8f6958] hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {/* User Profile / Auth Button */}
            <button
              onClick={onOpenAuth}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                currentUser
                  ? 'bg-[#291513] hover:bg-[#381d1a] border-amber-500/40 text-amber-200'
                  : 'bg-[#21110f] hover:bg-[#2d1614] border-[#3e1f1c] text-[#d6c0b3]'
              }`}
              title={currentUser ? `Signed in as ${currentUser.fullName}` : 'Sign in or create account'}
            >
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline font-sans truncate max-w-[110px]">
                {currentUser ? currentUser.fullName.split(' ')[0] : 'Sign In'}
              </span>
              {currentUser?.role === 'pastry_chef' && (
                <span className="hidden md:inline text-[9px] uppercase px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                  Chef
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#281412] hover:bg-[#341b18] border border-[#482420] text-[#f7efe6] transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#160c0b] shadow-md animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Submenu for Storefront */}
        {currentView === 'storefront' && (
          <div className="flex lg:hidden items-center justify-around py-2 border-t border-[#2e1614] text-xs">
            <button
              onClick={() => setActiveNavTab('menu')}
              className={`py-1 px-2 rounded font-medium ${
                activeNavTab === 'menu' ? 'text-amber-300 bg-[#291513]' : 'text-[#bba092]'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveNavTab('custom-builder')}
              className={`py-1 px-2 rounded font-medium flex items-center gap-1 ${
                activeNavTab === 'custom-builder' ? 'text-amber-300 bg-[#291513]' : 'text-[#bba092]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Bespoke Tiers
            </button>
            <button
              onClick={() => setActiveNavTab('tasting-salon')}
              className={`py-1 px-2 rounded font-medium ${
                activeNavTab === 'tasting-salon' ? 'text-amber-300 bg-[#291513]' : 'text-[#bba092]'
              }`}
            >
              Tasting Salon
            </button>
            <button
              onClick={() => setActiveNavTab('story')}
              className={`py-1 px-2 rounded font-medium ${
                activeNavTab === 'story' ? 'text-amber-300 bg-[#291513]' : 'text-[#bba092]'
              }`}
            >
              Our Story
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
