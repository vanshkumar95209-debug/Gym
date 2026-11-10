import React from 'react';
import { Dumbbell, Utensils, Calendar, Flame, Settings, Droplets, Globe } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  activeTab: 'workouts' | 'diet' | 'water' | 'log';
  onSelectTab: (tab: 'workouts' | 'diet' | 'water' | 'log') => void;
  streakDays: number;
  onOpenProfile: () => void;
  hasReminder: boolean;
  language: AppLanguage;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  streakDays,
  onOpenProfile,
  hasReminder,
  language,
  onToggleLanguage
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('workouts')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-orange-500/20">
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
            Iron<span className="text-amber-400">Pulse</span>
          </span>
        </div>

        {/* Navigation Tabs (Desktop/Tablet) */}
        <nav className="hidden sm:flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onSelectTab('workouts')}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition ${
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
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition ${
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
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition ${
              activeTab === 'water'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{t.waterTracker}</span>
          </button>

          <button
            onClick={() => onSelectTab('log')}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition ${
              activeTab === 'log'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.dailyLog}</span>
          </button>
        </nav>

        {/* Right side: Language Switcher, Streak & Settings */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Button (English default / Hindi toggle) */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-black text-amber-400 flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            title={language === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language.toUpperCase()}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {language === 'en' ? '(ENG)' : '(HIN)'}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="font-extrabold text-white">{streakDays}d</span>
          </div>

          <button
            onClick={onOpenProfile}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 cursor-pointer transition relative"
            title="Profile & Daily Reminder"
          >
            <Settings className="w-4 h-4" />
            {hasReminder && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
