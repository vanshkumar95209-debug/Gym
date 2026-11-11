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
            {/* Mobile Left Menu Toggle Button */}
            <button
              onClick={onOpenMobileDrawer}
              className="sm:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-white cursor-pointer transition flex items-center justify-center shadow-xs"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Brand */}
            <div 
              onClick={() => onSelectTab('workouts')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-orange-500/20">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                Iron<span className="text-amber-400">Pulse</span>
              </span>
            </div>
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
        </nav>

        {/* Right side: Custom Timer, Language Switcher & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Custom Timer Button */}
          <button
            onClick={onOpenCustomTimer}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-black text-amber-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            title={t.customTimer}
          >
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-xs font-bold text-slate-200">{t.customTimer}</span>
          </button>

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

    {/* Mobile Left Drawer Navigation Menu */}
    {isMobileDrawerOpen && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm sm:hidden flex animate-in fade-in duration-150">
        <div className="w-72 bg-slate-900 border-r border-slate-800 h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
          <div className="space-y-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <Dumbbell className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-base tracking-tight block">
                    Iron<span className="text-amber-400">Pulse</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block -mt-0.5">
                    {language === 'hi' ? 'नेविगेशन मेनू' : 'Navigation Menu'}
                  </span>
                </div>
              </div>

              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelectTab('workouts');
                  onCloseMobileDrawer();
                }}
                className={`w-full p-3 rounded-2xl text-xs font-black flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'workouts'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activeTab === 'workouts' ? 'bg-black/15' : 'bg-slate-900'}`}>
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">{t.workouts}</span>
                    <span className={`text-[10px] block ${activeTab === 'workouts' ? 'text-slate-950/80 font-medium' : 'text-slate-500'}`}>
                      {language === 'hi' ? 'कसरतें व रियल वीडियो' : 'Exercises & Video Guides'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                onClick={() => {
                  onSelectTab('diet');
                  onCloseMobileDrawer();
                }}
                className={`w-full p-3 rounded-2xl text-xs font-black flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'diet'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activeTab === 'diet' ? 'bg-black/15' : 'bg-slate-900'}`}>
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">{t.diet}</span>
                    <span className={`text-[10px] block ${activeTab === 'diet' ? 'text-slate-950/80 font-medium' : 'text-slate-500'}`}>
                      {language === 'hi' ? 'डाइट व कस्टम मेकर' : 'Diet & Custom Maker'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                onClick={() => {
                  onSelectTab('water');
                  onCloseMobileDrawer();
                }}
                className={`w-full p-3 rounded-2xl text-xs font-black flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'water'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activeTab === 'water' ? 'bg-black/15' : 'bg-slate-900'}`}>
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">{t.waterTracker}</span>
                    <span className={`text-[10px] block ${activeTab === 'water' ? 'text-slate-950/80 font-medium' : 'text-slate-500'}`}>
                      {language === 'hi' ? 'दैनिक पानी ट्रैकर' : 'Daily Water Hydration'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              {/* Custom Gym Timer Option */}
              <button
                onClick={() => {
                  onCloseMobileDrawer();
                  if (onOpenCustomTimer) onOpenCustomTimer();
                }}
                className="w-full p-3 rounded-2xl text-xs font-black flex items-center justify-between transition cursor-pointer bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
                    <Timer className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">{t.customTimer}</span>
                    <span className="text-[10px] block text-slate-500">
                      {language === 'hi' ? 'रेस्ट, HIIT व स्टॉपवॉच' : 'Rest, HIIT & Stopwatch'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>

          {/* Drawer Footer: Quick Language switch & Profile trigger */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <button
              onClick={() => {
                onToggleLanguage();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-black text-amber-400 flex items-center justify-between cursor-pointer transition"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{language === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">{language}</span>
            </button>

            <button
              onClick={() => {
                onCloseMobileDrawer();
                onOpenProfile();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2 cursor-pointer transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रोफाइल व सेटिंग्स' : 'Profile & Settings'}</span>
            </button>
          </div>
        </div>

        {/* Backdrop dismiss */}
        <div 
          className="flex-1"
          onClick={onCloseMobileDrawer}
        />
      </div>
    )}
  </>
  );
};
