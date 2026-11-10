/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WorkoutExplorer } from './components/WorkoutExplorer';
import { DietDirectory } from './components/DietDirectory';
import { WaterTracker } from './components/WaterTracker';
import { DailyLog } from './components/DailyLog';
import { ProfileModal } from './components/ProfileModal';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { 
  getStoredWorkoutLogs, 
  saveWorkoutLog, 
  deleteWorkoutLog, 
  getStoredBodyMetrics, 
  saveBodyMetric, 
  getStoredDietLogs, 
  addDietLogItem, 
  removeDietLogItem, 
  getStoredProfile, 
  saveStoredProfile, 
  getFavoriteExercises, 
  toggleFavoriteExercise,
  getStoredWaterLog,
  saveStoredWaterLog,
  getStoredLanguage,
  saveStoredLanguage
} from './utils/storage';
import { 
  DailyWorkoutLog, 
  BodyMetrics, 
  DailyDietLogItem, 
  UserFitnessProfile, 
  Exercise, 
  DailyWaterLog,
  AppLanguage 
} from './types';
import { TRANSLATIONS } from './utils/translations';
import { Dumbbell, Utensils, Calendar, Droplets } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workouts' | 'diet' | 'water' | 'log'>('workouts');
  const [language, setLanguage] = useState<AppLanguage>('en'); // Default to English as explicitly requested!
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [activeRoutineExercise, setActiveRoutineExercise] = useState<Exercise | null>(null);

  // Stored States
  const [workoutLogs, setWorkoutLogs] = useState<DailyWorkoutLog[]>([]);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetrics[]>([]);
  const [todayDietLogs, setTodayDietLogs] = useState<DailyDietLogItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserFitnessProfile>(getStoredProfile());
  const [favorites, setFavorites] = useState<string[]>([]);
  const [streakDays, setStreakDays] = useState<number>(4);

  const todayStr = new Date().toISOString().split('T')[0];
  const [waterLog, setWaterLog] = useState<DailyWaterLog>(getStoredWaterLog(todayStr));

  // Load from local storage on mount
  useEffect(() => {
    setWorkoutLogs(getStoredWorkoutLogs());
    setBodyMetrics(getStoredBodyMetrics());
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

  // Workout Log Handlers
  const handleSaveWorkoutLog = (log: DailyWorkoutLog) => {
    const updated = saveWorkoutLog(log);
    setWorkoutLogs(updated);
    setStreakDays(s => s + 1);
  };

  const handleDeleteWorkoutLog = (id: string) => {
    const updated = deleteWorkoutLog(id);
    setWorkoutLogs(updated);
  };

  // Body Metrics Handlers
  const handleSaveBodyMetric = (metric: BodyMetrics) => {
    const updated = saveBodyMetric(metric);
    setBodyMetrics(updated);
  };

  // Diet Handlers
  const handleAddDietItem = (item: Omit<DailyDietLogItem, 'id'>) => {
    const updated = addDietLogItem(item, todayStr);
    setTodayDietLogs(updated);
  };

  const handleRemoveDietItem = (id: string) => {
    const updated = removeDietLogItem(id, todayStr);
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

  // Direct log from explorer
  const handleLogWorkoutFromExplorer = (exercise: Exercise, sets: any[]) => {
    const completedSets = sets.filter(s => s.completed);
    const setsToSave = completedSets.length > 0 ? completedSets : sets;

    const newLog: DailyWorkoutLog = {
      id: 'log-' + Date.now(),
      date: todayStr,
      title: `${exercise.name} Session (${exercise.targetMuscle.toUpperCase()})`,
      muscleGroups: [exercise.targetMuscle],
      durationMinutes: Math.max(15, setsToSave.length * 5),
      exercises: [
        {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          targetMuscle: exercise.targetMuscle,
          sets: setsToSave
        }
      ],
      notes: `Targeted ${exercise.targetSubMuscle}. Completed with good form.`
    };

    handleSaveWorkoutLog(newLog);
    setActiveTab('log');
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        streakDays={streakDays}
        onOpenProfile={() => setShowProfileModal(true)}
        hasReminder={userProfile.dailyReminderEnabled}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content */}
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

        {activeTab === 'log' && (
          <DailyLog
            workoutLogs={workoutLogs}
            onSaveWorkoutLog={handleSaveWorkoutLog}
            onDeleteWorkoutLog={handleDeleteWorkoutLog}
            bodyMetrics={bodyMetrics}
            onSaveBodyMetric={handleSaveBodyMetric}
            onOpenExplorerWithMuscle={() => setActiveTab('workouts')}
            language={language}
          />
        )}
      </main>

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

      {/* Mobile Sticky Tab Navigation */}
      <div className="sm:hidden sticky bottom-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex flex-col items-center gap-1 text-[11px] cursor-pointer ${
            activeTab === 'workouts' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>{t.workouts}</span>
        </button>

        <button
          onClick={() => setActiveTab('diet')}
          className={`flex flex-col items-center gap-1 text-[11px] cursor-pointer ${
            activeTab === 'diet' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>{t.diet}</span>
        </button>

        <button
          onClick={() => setActiveTab('water')}
          className={`flex flex-col items-center gap-1 text-[11px] cursor-pointer ${
            activeTab === 'water' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>{language === 'hi' ? 'पानी' : 'Water'}</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex flex-col items-center gap-1 text-[11px] cursor-pointer ${
            activeTab === 'log' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.dailyLog}</span>
        </button>
      </div>
    </div>
  );
}
