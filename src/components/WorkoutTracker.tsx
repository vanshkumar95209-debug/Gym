import React, { useState } from 'react';
import { 
  Target, 
  Flame, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Trash2, 
  Award, 
  Sparkles,
  TrendingUp,
  Dumbbell,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyWorkoutGoal, DailyWorkoutLog, AppLanguage } from '../types';
import { 
  getStoredDailyWorkoutGoal, 
  saveStoredDailyWorkoutGoal, 
  addWorkoutMinutesToGoal,
  getStoredWorkoutLogs,
  deleteWorkoutLog,
  saveWorkoutLog,
  getLocalDateString 
} from '../utils/storage';
import { playStreakFanfare, playSuccessChime, playResetSound } from '../utils/audio';

interface WorkoutTrackerProps {
  language?: AppLanguage;
  onOpenPlans?: () => void;
  onOpenWorkouts?: () => void;
}

export const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  language = 'en',
  onOpenPlans,
  onOpenWorkouts
}) => {
  const isEn = language === 'en';
  const todayStr = getLocalDateString();

  const [goal, setGoal] = useState<DailyWorkoutGoal>(() => getStoredDailyWorkoutGoal(todayStr));
  const [workoutLogs, setWorkoutLogs] = useState<DailyWorkoutLog[]>(() => getStoredWorkoutLogs());
  const [showManualAddModal, setShowManualAddModal] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualMinutes, setManualMinutes] = useState<number>(30);

  const todayLogs = workoutLogs.filter(l => l.date === todayStr);
  const totalMinutesFromLogs = todayLogs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
  
  // Total achieved is the maximum of tracked goal achieved minutes or total logged workout minutes
  const achievedMinutes = Math.max(goal.achievedMinutes, totalMinutesFromLogs);
  const targetMinutes = goal.targetMinutes || 30;
  const progressPercent = Math.min(100, Math.round((achievedMinutes / targetMinutes) * 100));
  const isGoalAchieved = achievedMinutes >= targetMinutes;
  const remainingMinutes = Math.max(0, targetMinutes - achievedMinutes);

  // Update target minutes
  const handleUpdateTarget = (newTarget: number) => {
    const safeTarget = Math.max(5, Math.min(240, newTarget));
    const updated: DailyWorkoutGoal = { ...goal, targetMinutes: safeTarget };
    setGoal(updated);
    saveStoredDailyWorkoutGoal(updated);
  };

  // Add quick minutes
  const handleAddMinutes = (mins: number) => {
    playSuccessChime();
    const updated = addWorkoutMinutesToGoal(mins, todayStr);
    setGoal(updated);

    if (updated.achievedMinutes >= updated.targetMinutes && !isGoalAchieved) {
      playStreakFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Reset today's achieved minutes
  const handleResetToday = () => {
    playResetSound();
    const resetGoal: DailyWorkoutGoal = { ...goal, achievedMinutes: 0 };
    setGoal(resetGoal);
    saveStoredDailyWorkoutGoal(resetGoal);
  };

  // Delete logged workout
  const handleDeleteLog = (id: string) => {
    playResetSound();
    const updated = deleteWorkoutLog(id);
    setWorkoutLogs(updated);
  };

  // Manual session save
  const handleSaveManualSession = () => {
    if (!manualTitle.trim()) return;
    const newLog: DailyWorkoutLog = {
      id: 'manual-' + Date.now(),
      date: todayStr,
      title: manualTitle.trim(),
      muscleGroups: ['chest'],
      durationMinutes: Math.max(5, manualMinutes),
      exercises: [
        {
          exerciseId: 'manual-session',
          exerciseName: manualTitle.trim(),
          targetMuscle: 'chest',
          sets: [{ id: 's1', setNumber: 1, weightKg: 0, reps: 1, completed: true }]
        }
      ]
    };
    saveWorkoutLog(newLog);
    setWorkoutLogs(getStoredWorkoutLogs());
    handleAddMinutes(manualMinutes);
    setShowManualAddModal(false);
    setManualTitle('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {isEn ? 'Daily Workout Goal Tracker' : 'दैनिक वर्कआउट गोल ट्रैकर'}
              </span>
              <span className="text-xs text-slate-400">📅 {todayStr}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isEn ? 'Workout Goal & Activity Log' : 'कसरत का लक्ष्य व एक्टिविटी'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEn 
                ? 'Set daily exercise targets (e.g. 30min) and track time worked out automatically!'
                : 'रोजाना कसरत का लक्ष्य तय करें (जैसे 30 मिनट) और अपने पूरे वर्कआउट का हिसाब रखें!'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPlans && (
              <button
                onClick={onOpenPlans}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? 'Full Body Plans' : 'फुल-बॉडी प्लान्स'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Goal Circular / Metric Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Left: Interactive Daily Goal Setting Card (User requested: "aaj 30min exercise karni hai") */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-white text-sm sm:text-base">
                {isEn ? "Today's Workout Target" : 'आज की कसरत का लक्ष्य (Goal)'}
              </h3>
            </div>
            
            <button
              onClick={handleResetToday}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition"
              title={isEn ? "Reset Today's Progress" : "आज का समय रीसेट करें"}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isEn ? 'Reset' : 'रीसेट'}</span>
            </button>
          </div>

          {/* Goal Selector Controls */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isEn ? 'Set Today Target Duration:' : 'आज कितनी देर कसरत करनी है:'}
              </span>
              <p className="text-xs text-amber-400 font-semibold">
                {isEn 
                  ? `Goal: ${targetMinutes} Minutes (${Math.round(targetMinutes * 6.5)} est. calories)`
                  : `लक्ष्य: ${targetMinutes} मिनट (लगभग ${Math.round(targetMinutes * 6.5)} कैलोरी बर्न)`}
              </p>
            </div>

            {/* Direct Number + Plus / Minus Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-2xl p-1.5">
              <button
                onClick={() => handleUpdateTarget(targetMinutes - 5)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer active:scale-95"
                title="-5 Mins"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center px-3">
                <input
                  type="number"
                  min="5"
                  max="240"
                  step="5"
                  value={targetMinutes}
                  onChange={(e) => handleUpdateTarget(parseInt(e.target.value) || 5)}
                  className="w-12 text-center bg-transparent font-mono font-black text-white text-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-bold text-slate-400 ml-1">{isEn ? 'min' : 'मिनट'}</span>
              </div>

              <button
                onClick={() => handleUpdateTarget(targetMinutes + 5)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer active:scale-95"
                title="+5 Mins"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Target Presets (15m, 30m, 45m, 60m) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-bold mr-1">
              {isEn ? 'Quick Goals:' : 'क्विक लक्ष्य:'}
            </span>
            {[15, 30, 45, 60, 90].map(mins => (
              <button
                key={mins}
                onClick={() => handleUpdateTarget(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  targetMinutes === mins
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {mins} {isEn ? 'mins' : 'मिनट'}
              </button>
            ))}
          </div>

          {/* Progress Bar & Status */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isEn 
                    ? `Completed: ${achievedMinutes}m / ${targetMinutes}m` 
                    : `पूरा हुआ: ${achievedMinutes} मिनट / ${targetMinutes} मिनट`}
                </span>
              </span>

              <span className={isGoalAchieved ? 'text-emerald-400' : 'text-amber-400'}>
                {progressPercent}% {isGoalAchieved ? '🎉' : ''}
              </span>
            </div>

            {/* Glowing Progress Track */}
            <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalAchieved 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/30' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-orange-500/20'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>
                {isGoalAchieved
                  ? (isEn ? '🎯 Target achieved for today! Great dedication!' : '🎯 आज का लक्ष्य पूरा हो गया! शानदार मेहनत!')
                  : (isEn ? `🔥 ${remainingMinutes} min left to reach goal.` : `🔥 लक्ष्य पूरा करने के लिए ${remainingMinutes} मिनट बाकी हैं।`)}
              </span>
              <span className="font-semibold text-slate-300">
                {Math.round(achievedMinutes * 7.5)} {isEn ? 'kcal burned' : 'कैलोरी बर्न'}
              </span>
            </div>
          </div>

          {/* Quick Add Buttons to log workout minutes */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-300">
              {isEn ? '+ Quick Add Workout Time:' : '+ तुरंत कसरत का समय जोड़ें:'}
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[10, 15, 30, 45].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleAddMinutes(mins)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/40 text-xs font-black cursor-pointer transition active:scale-95"
                >
                  +{mins}m
                </button>
              ))}

              <button
                onClick={() => setShowManualAddModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold cursor-pointer transition"
              >
                {isEn ? '+ Custom Session' : '+ सत्र दर्ज करें'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Circular Progress Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between text-center space-y-4 shadow-lg">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              {isEn ? "TODAY'S COMPLETION" : 'आज का प्रदर्शन'}
            </span>
            <h4 className="font-black text-white text-base">
              {isGoalAchieved ? (isEn ? 'Goal Crushed! 🏆' : 'लक्ष्य पूरा! 🏆') : (isEn ? 'In Progress' : 'प्रोग्रेस चालू है')}
            </h4>
          </div>

          {/* Large Ring Visual */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-950 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`${isGoalAchieved ? 'text-emerald-400' : 'text-amber-400'} stroke-current transition-all duration-700`}
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white font-mono">{achievedMinutes}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">/ {targetMinutes} MIN</span>
            </div>
          </div>

          <div className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[11px]">{isEn ? 'Sessions Today' : 'आज के सेशन्स'}</span>
            <strong className="text-white text-sm">{todayLogs.length} {isEn ? 'Completed' : 'पूरे हुए'}</strong>
          </div>
        </div>
      </div>

      {/* Today's Saved Workout History Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <h3 className="font-black text-white text-sm sm:text-base">
              {isEn ? `Saved Workout History (${workoutLogs.length})` : `सेव किए गए वर्कआउट सेशन्स (${workoutLogs.length})`}
            </h3>
          </div>

          <span className="text-[11px] text-slate-400">
            {isEn ? 'Saved in device' : 'डिवाइस में सुरक्षित'}
          </span>
        </div>

        {workoutLogs.length === 0 ? (
          <div className="text-center py-8 space-y-2 text-slate-400">
            <Dumbbell className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs">{isEn ? 'No workout logs saved yet.' : 'अभी तक कोई वर्कआउट सेशन सेव नहीं है।'}</p>
            {onOpenWorkouts && (
              <button
                onClick={onOpenWorkouts}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer transition"
              >
                {isEn ? 'Start an Exercise' : 'कसरत शुरू करें'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {workoutLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      {log.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>📅 {log.date}</span>
                      <span>•</span>
                      <span>⏱️ {log.durationMinutes || 25} {isEn ? 'mins' : 'मिनट'}</span>
                      <span>•</span>
                      <span className="text-amber-400">{log.exercises?.[0]?.sets?.length || 3} {isEn ? 'sets' : 'सेट्स'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteLog(log.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition cursor-pointer self-end sm:self-center"
                  title={isEn ? "Delete Log" : "हटाएं"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Custom Session Modal */}
      {showManualAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">
                {isEn ? 'Log Custom Workout Session' : 'कस्टम वर्कआउट सत्र दर्ज करें'}
              </h3>
              <button 
                onClick={() => setShowManualAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">
                  {isEn ? 'Session Name / Muscle:' : 'वर्कआउट का नाम / मसल:'}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "e.g. Chest & Triceps / Morning Cardio" : "जैसे चेस्ट वर्कआउट / मॉर्निंग कार्डियो"}
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">
                  {isEn ? 'Duration (Minutes):' : 'समय (मिनट):'}
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowManualAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                {isEn ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={handleSaveManualSession}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
              >
                {isEn ? 'Save Session' : 'सेव करें'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
