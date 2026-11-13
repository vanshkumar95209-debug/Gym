import React from 'react';
import { Dumbbell, Utensils, Settings, Droplets, Globe, Menu, X, ChevronRight, Timer } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  activeTab: 'workouts' | 'diet' | 'water';
  onSelectTab: (tab: 'workouts' | 'diet' | 'water') => void;
  onOpenProfile: () => void;
  hasReminder: boolean;
  language: AppLanguage;
  onToggleLanguage: () => void;
  isMobileDrawerOpen: boolean;
  onOpenMobileDrawer: () => void;
  onCloseMobileDrawer: () => void;
  onOpenCustomTimer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenProfile,
  hasReminder,
  language,
  onToggleLanguage,
  isMobileDrawerOpen,
  onOpenMobileDrawer,
  onCloseMobileDrawer,
  onOpenCustomTimer
}) => {
  const t = TRANSLATIONS[language];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle + Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onOpenMobileDrawer}
              className="sm:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-white cursor-pointer transition flex items-center justify-center shadow-xs"
              aria-label="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div
              onClick={() => onSelectTab('workouts')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-orange-500/20">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                Fit<span className="text-amber-400">Bro</span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Desktop/Tablet) */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => onSelectTab('workouts')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === 'workouts'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{t.workouts}</span>
            </button>

            <button
              onClick={() => onSelectTab('diet')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === 'diet'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>{t.diet}</span>
            </button>

            <button
              onClick={() => onSelectTab('water')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === 'water'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{t.waterTracker}</span>
            </button>
          </nav>

          {/* Right side: Timer, Language Switcher & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenCustomTimer}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-black text-amber-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition shadow-xs active:scale-95"
              aria-label="Timer"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">{language === 'hi' ? 'टाइमर' : 'Timer'}</span>
            </button>

            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-black text-amber-400 flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 cursor-pointer transition relative"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
              {hasReminder && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Left Drawer Navigation Menu */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm sm:hidden flex animate-in fade-in duration-150">
          <div className="w-68 bg-slate-900 border-r border-slate-800 h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black">
                    <Dumbbell className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="font-extrabold text-white text-base tracking-tight">
                    Fit<span className="text-amber-400">Bro</span>
                  </span>
                </div>

                <button
                  onClick={onCloseMobileDrawer}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Clean Navigation Links */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onSelectTab('workouts');
                    onCloseMobileDrawer();
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                    activeTab === 'workouts'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Dumbbell className="w-4 h-4" />
                    <span>{t.workouts}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => {
                    onSelectTab('diet');
                    onCloseMobileDrawer();
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                    activeTab === 'diet'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Utensils className="w-4 h-4" />
                    <span>{t.diet}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => {
                    onSelectTab('water');
                    onCloseMobileDrawer();
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                    activeTab === 'water'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4" />
                    <span>{t.waterTracker}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => {
                    onCloseMobileDrawer();
                    if (onOpenCustomTimer) onOpenCustomTimer();
                  }}
                  className="w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Timer className="w-4 h-4 text-amber-400" />
                    <span>{language === 'hi' ? 'टाइमर' : 'Timer'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2">
              <button
                onClick={onToggleLanguage}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-amber-400 flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">{language}</span>
              </button>

              <button
                onClick={() => {
                  onCloseMobileDrawer();
                  onOpenProfile();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2 cursor-pointer transition"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</span>
              </button>
            </div>
          </div>

          <div
            className="flex-1"
            onClick={onCloseMobileDrawer}
          />
        </div>
      )}
    </>
  );
};
