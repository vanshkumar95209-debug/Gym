/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WorkoutExplorer } from './components/WorkoutExplorer';
import { DietDirectory } from './components/DietDirectory';
import { WaterTracker } from './components/WaterTracker';
import { ProfileModal } from './components/ProfileModal';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { 
  getStoredDietLogs, 
  addDietLogItem, 
  removeDietLogItem, 
  clearDietLogs,
  getStoredProfile, 
  saveStoredProfile, 
  getFavoriteExercises, 
  toggleFavoriteExercise,
  getStoredWaterLog,
  saveStoredWaterLog,
  getStoredLanguage,
  saveStoredLanguage,
  saveWorkoutLog,
  getLocalDateString
} from './utils/storage';
import { 
  DailyDietLogItem, 
  UserFitnessProfile, 
  Exercise, 
  DailyWaterLog,
  AppLanguage,
  DailyWorkoutLog 
} from './types';
import { TRANSLATIONS } from './utils/translations';
import { Dumbbell, Utensils, Droplets, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playStreakFanfare } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workouts' | 'diet' | 'water'>('workouts');
  const [language, setLanguage] = useState<AppLanguage>('en'); // Default to English as explicitly requested!
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [activeRoutineExercise, setActiveRoutineExercise] = useState<Exercise | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Stored States
  const [todayDietLogs, setTodayDietLogs] = useState<DailyDietLogItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserFitnessProfile>(getStoredProfile());
  const [favorites, setFavorites] = useState<string[]>([]);

  const todayStr = getLocalDateString();
  const [waterLog, setWaterLog] = useState<DailyWaterLog>(getStoredWaterLog(todayStr));

  // Touch gesture listeners for pulling menu from left edge
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Horizontal swipe check: user pulls from left edge (< 60px) to the right
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (touchStartX < 60 && deltaX > 0) {
        setIsMobileNavOpen(true);
      } else if (isMobileNavOpen && deltaX < -30) {
        setIsMobileNavOpen(false);
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Load from local storage on mount
  useEffect(() => {
    setTodayDietLogs(getStoredDietLogs(todayStr));
    setUserProfile(getStoredProfile());
    setFavorites(getFavoriteExercises());
    setWaterLog(getStoredWaterLog(todayStr));
    setLanguage(getStoredLanguage());
  }, [todayStr]);

  const handleToggleLanguage = () => {
    const nextLang: AppLanguage = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    saveStoredLanguage(nextLang);
  };

  // DAILY NOTIFICATION REMINDER CHECK LOOP
  useEffect(() => {
    if (!userProfile.dailyReminderEnabled) return;

    const checkReminder = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;
      const currentDateStr = now.toISOString().split('T')[0];

      if (currentTimeStr === userProfile.reminderTime && userProfile.lastReminderDate !== currentDateStr) {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('🏋️ IronPulse Gym Reminder!', {
            body: language === 'hi'
              ? `वर्कआउट का समय हो गया है (${userProfile.reminderTime})! आज का कसरत सत्र पूरा करें।`
              : `Time for your workout (${userProfile.reminderTime})! Complete today's training session.`,
            icon: '/favicon.ico'
          });

          // Mark notified today so it doesn't alert repeatedly within the same minute
          const updated = { ...userProfile, lastReminderDate: currentDateStr };
          setUserProfile(updated);
          saveStoredProfile(updated);
        }
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [userProfile, language]);

  // Diet Handlers
  const handleAddDietItem = (item: Omit<DailyDietLogItem, 'id'>) => {
    const updated = addDietLogItem(item, todayStr);
    setTodayDietLogs(updated);
  };

  const handleRemoveDietItem = (id: string) => {
    const updated = removeDietLogItem(id, todayStr);
    setTodayDietLogs(updated);
  };

  const handleResetDietLogs = () => {
    const updated = clearDietLogs(todayStr);
    setTodayDietLogs(updated);
  };

  const handleUpdateProfile = (profile: UserFitnessProfile) => {
    saveStoredProfile(profile);
    setUserProfile(profile);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteExercise(id);
    setFavorites(updated);
  };

  const handleUpdateWaterLog = (newLog: DailyWaterLog) => {
    const saved = saveStoredWaterLog(newLog);
    setWaterLog(saved);
  };

  // Direct completion from explorer or active workout modal
  const handleLogWorkoutFromExplorer = (exercise: Exercise, sets: any[]) => {
    // Save persistent workout log
    const workoutLog: DailyWorkoutLog = {
      id: 'workout-' + Date.now(),
      date: todayStr,
      title: `${exercise.name} Session`,
      muscleGroups: [exercise.targetMuscle],
      durationMinutes: 25,
      exercises: [
        {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          targetMuscle: exercise.targetMuscle,
          sets: (sets && sets.length > 0 ? sets : [{ id: '1', setNumber: 1, weightKg: 20, reps: 10, completed: true }]).map((s, idx) => ({
            id: s.id || `set-${idx + 1}`,
            setNumber: s.setNumber || idx + 1,
            weightKg: Number(s.weightKg) || 0,
            reps: Number(s.reps) || 0,
            completed: true
          }))
        }
      ]
    };
    saveWorkoutLog(workoutLog);

    // Audio & celebratory confetti
    playStreakFanfare();
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  const t = TRANSLATIONS[language];

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenProfile={() => setShowProfileModal(true)}
        hasReminder={userProfile.dailyReminderEnabled}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isMobileDrawerOpen={isMobileNavOpen}
        onOpenMobileDrawer={() => setIsMobileNavOpen(true)}
        onCloseMobileDrawer={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content: Full width on mobile (no awkward left padding), edge-to-edge responsiveness */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5">
        {activeTab === 'workouts' && (
          <WorkoutExplorer
            onLogWorkoutFromExplorer={handleLogWorkoutFromExplorer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            language={language}
          />
        )}

        {activeTab === 'diet' && (
          <DietDirectory
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            todayDietLogs={todayDietLogs}
            onAddDietItem={handleAddDietItem}
            onRemoveDietItem={handleRemoveDietItem}
            onResetDietLogs={handleResetDietLogs}
            language={language}
          />
        )}

        {activeTab === 'water' && (
          <WaterTracker
            waterLog={waterLog}
            onUpdateWaterLog={handleUpdateWaterLog}
            language={language}
            userWeightKg={userProfile.weightKg}
          />
        )}
      </main>

      {/* Mobile Left-Edge Pull Handle: Tap or swipe right from the left edge to reveal navigation menu.
          Immediately hides when any option is clicked, allowing full-screen view. */}
      {!isMobileNavOpen && (
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="sm:hidden fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 pl-1 pr-1.5 py-4 rounded-r-2xl shadow-2xl shadow-amber-500/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all group border-y border-r border-amber-300/40 select-none animate-in fade-in slide-in-from-left duration-200"
          title={language === 'hi' ? 'खींच कर मेनू खोलें (Workouts, Diet, Water)' : 'Pull to open options (Workouts, Diet, Water)'}
          aria-label="Pull to open menu"
        >
          <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3] group-hover:translate-x-0.5 transition-transform animate-pulse" />
          <span className="text-[9px] font-black tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 text-slate-950 select-none">
            {language === 'hi' ? 'खींचे' : 'PULL'}
          </span>
          <div className="flex flex-col gap-0.5 opacity-60">
            <div className="w-1 h-1 rounded-full bg-slate-950" />
            <div className="w-1 h-1 rounded-full bg-slate-950" />
            <div className="w-1 h-1 rounded-full bg-slate-950" />
          </div>
        </button>
      )}

      {/* Active Workout Tracker Modal */}
      {activeRoutineExercise && (
        <ActiveWorkoutModal
          exercise={activeRoutineExercise}
          onClose={() => setActiveRoutineExercise(null)}
          onFinishWorkout={(ex, sets) => {
            handleLogWorkoutFromExplorer(ex, sets);
            setActiveRoutineExercise(null);
          }}
          language={language}
        />
      )}

      {/* Profile & Daily Reminder Settings Modal */}
      {showProfileModal && (
        <ProfileModal
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setShowProfileModal(false)}
          language={language}
        />
      )}
    </div>
  );
}
