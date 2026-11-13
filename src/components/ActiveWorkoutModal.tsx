import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause,
  RotateCcw, 
  Check, 
  Plus, 
  Minus,
  Sparkles, 
  Flame,
  Coffee,
  SkipForward,
  Video,
  Award,
  ChevronRight,
  Settings2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, WorkoutSet, AppLanguage } from '../types';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import { ExerciseAnimation } from './ExerciseAnimation';
import { 
  playRepDing, 
  playTimerTick, 
  playTimerComplete, 
  playIntervalChangeSound,
  playStreakFanfare 
} from '../utils/audio';

interface ActiveWorkoutModalProps {
  exercise: Exercise;
  onClose: () => void;
  onFinishWorkout: (exercise: Exercise, sets: WorkoutSet[]) => void;
  language?: AppLanguage;
  initialTimerSettings?: { sets: number; workoutTime: number; restTime: number } | null;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  exercise,
  onClose,
  onFinishWorkout,
  language = 'en',
  initialTimerSettings = null
}) => {
  const isEn = language === 'en';

  // Modal Stage: 'setup' -> 'active' -> 'completed'
  // If timer settings were already picked in the previous screen, jump straight to 'active'
  const [workoutState, setWorkoutState] = useState<'setup' | 'active' | 'completed'>(
    initialTimerSettings ? 'active' : 'setup'
  );

  // Setup options
  const [totalSets, setTotalSets] = useState<number>(initialTimerSettings?.sets || 3);
  const [workDuration, setWorkDuration] = useState<number>(initialTimerSettings?.workoutTime || 40); // sec
  const [restDuration, setRestDuration] = useState<number>(initialTimerSettings?.restTime || 60); // sec

  // Active workout execution state
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(initialTimerSettings?.workoutTime || 40);
  const [isRunning, setIsRunning] = useState<boolean>(Boolean(initialTimerSettings));
  const [completedSets, setCompletedSets] = useState<WorkoutSet[]>([]);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [totalTimeSpentSec, setTotalTimeSpentSec] = useState<number>(0);

  // Play start sound when active starts
  useEffect(() => {
    if (initialTimerSettings) {
      playIntervalChangeSound(true);
    }
  }, []);

  // Main workout timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (workoutState === 'active' && isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            playTimerTick();
          }
          return prev - 1;
        });
        setTotalTimeSpentSec(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutState, isRunning, timeLeft, phase, currentSet, totalSets, workDuration, restDuration]);

  // Handle phase completion: Work -> Rest -> Next Work -> ... -> Completed
  const handlePhaseComplete = () => {
    if (phase === 'work') {
      // Work period finished for this set
      playRepDing();
      const newCompletedSet: WorkoutSet = {
        id: `set-${currentSet}-${Date.now()}`,
        setNumber: currentSet,
        weightKg: 20,
        reps: 10,
        completed: true
      };
      const updatedSets = [...completedSets, newCompletedSet];
      setCompletedSets(updatedSets);

      if (currentSet >= totalSets) {
        // All sets finished!
        setIsRunning(false);
        setWorkoutState('completed');
        playStreakFanfare();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        // Transition to Rest Phase
        playIntervalChangeSound(false);
        setPhase('rest');
        setTimeLeft(restDuration);
      }
    } else {
      // Rest period finished -> start next set work phase!
      playIntervalChangeSound(true);
      setCurrentSet(s => s + 1);
      setPhase('work');
      setTimeLeft(workDuration);
    }
  };

  // Skip or finish current set early
  const handleFinishSetEarly = () => {
    handlePhaseComplete();
  };

  // Skip rest period and immediately start next set
  const handleSkipRest = () => {
    playIntervalChangeSound(true);
    setCurrentSet(s => s + 1);
    setPhase('work');
    setTimeLeft(workDuration);
  };

  // Adjust current timer by seconds (+10s or -10s)
  const handleAdjustTime = (delta: number) => {
    setTimeLeft(prev => Math.max(1, prev + delta));
  };

  // Start workout from setup screen
  const handleStartWorkout = () => {
    const safeSets = Math.max(1, totalSets);
    const safeWork = Math.max(5, workDuration);
    const safeRest = Math.max(0, restDuration);

    setTotalSets(safeSets);
    setWorkDuration(safeWork);
    setRestDuration(safeRest);

    setCurrentSet(1);
    setPhase('work');
    setTimeLeft(safeWork);
    setIsRunning(true);
    setCompletedSets([]);
    setTotalTimeSpentSec(0);
    setWorkoutState('active');

    playIntervalChangeSound(true);
  };

  // Save workout and finish
  const handleFinalSave = () => {
    const finalSets = completedSets.length > 0 
      ? completedSets 
      : Array.from({ length: totalSets }).map((_, idx) => ({
          id: `set-${idx + 1}`,
          setNumber: idx + 1,
          weightKg: 20,
          reps: 10,
          completed: true
        }));
    onFinishWorkout(exercise, finalSets);
    onClose();
  };

  // Formatting seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col relative">
        
        {/* Top Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-3.5 sm:p-4 flex items-center justify-between z-10">
          <h2 className="text-base sm:text-lg font-black text-white">
            {isEn ? exercise.name : exercise.hindiName}
          </h2>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">

          {/* ===================== STAGE 1: SETUP SCREEN ===================== */}
          {workoutState === 'setup' && (
            <div className="space-y-4 animate-in fade-in">
              {/* YouTube Video Preview / Toggle */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <ExerciseVideoPlayer
                  exerciseId={exercise.id}
                  targetMuscle={exercise.targetMuscle}
                  exerciseName={exercise.name}
                  autoPlayVideo={false}
                  language={language}
                />
              </div>

              {/* SETS, WORKOUT TIME, REST TIME SETUP CONTROLS */}
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Settings2 className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Timer & Sets' : 'टाइमर व सेट्स'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {/* 1. Sets */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {isEn ? 'Sets' : 'कुल सेट्स'}
                    </label>
                    <div className="flex items-center justify-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-1 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all">
                      <button
                        type="button"
                        onClick={() => setTotalSets(s => Math.max(1, s - 1))}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                        title="-1 Set"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={totalSets || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setTotalSets(isNaN(val) ? 1 : Math.max(1, Math.min(20, val)));
                        }}
                        onBlur={() => {
                          if (!totalSets || totalSets < 1) setTotalSets(1);
                        }}
                        className="w-10 sm:w-12 text-center bg-transparent font-mono font-black text-white text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => setTotalSets(s => Math.min(20, s + 1))}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                        title="+1 Set"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 2. Workout Time Per Set */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{isEn ? 'Work (Sec)' : 'वर्कआउट (से)'}</span>
                    </label>
                    <div className="flex items-center justify-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-1 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
                      <button
                        type="button"
                        onClick={() => setWorkDuration(w => Math.max(5, w - 5))}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                        title="-5s"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        value={workDuration || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setWorkDuration(isNaN(val) ? 5 : Math.max(5, Math.min(300, val)));
                        }}
                        onBlur={() => {
                          if (!workDuration || workDuration < 5) setWorkDuration(5);
                        }}
                        className="w-10 sm:w-12 text-center bg-transparent font-mono font-black text-white text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => setWorkDuration(w => Math.min(300, w + 5))}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                        title="+5s"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3. Rest Time Between Sets */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                      <Coffee className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{isEn ? 'Rest (Sec)' : 'रेस्ट (से)'}</span>
                    </label>
                    <div className="flex items-center justify-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-1 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
                      <button
                        type="button"
                        onClick={() => setRestDuration(r => Math.max(0, r - 5))}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                        title="-5s"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={restDuration === 0 ? '0' : (restDuration || '')}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setRestDuration(isNaN(val) ? 0 : Math.max(0, Math.min(300, val)));
                        }}
                        className="w-10 sm:w-12 text-center bg-transparent font-mono font-black text-white text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => setRestDuration(r => Math.min(300, r + 5))}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                        title="+5s"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">
                    {isEn ? 'Presets:' : 'प्रीसेट्स:'}
                  </span>
                  {[
                    { label: '3 × 30s/45s', sets: 3, work: 30, rest: 45 },
                    { label: '3 × 40s/60s', sets: 3, work: 40, rest: 60 },
                    { label: '4 × 45s/60s', sets: 4, work: 45, rest: 60 },
                    { label: '5 × 45s/90s', sets: 5, work: 45, rest: 90 },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTotalSets(preset.sets);
                        setWorkDuration(preset.work);
                        setRestDuration(preset.rest);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-800 cursor-pointer transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Exercise Button */}
              <button
                onClick={handleStartWorkout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm cursor-pointer transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>{isEn ? 'Start Exercise' : 'कसरत शुरू करें'}</span>
              </button>
            </div>
          )}

          {/* ===================== STAGE 2: ACTIVE LIVE WORKOUT SESSION ===================== */}
          {workoutState === 'active' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Progress & Current Set Header */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                    phase === 'work' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' 
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  }`}>
                    {phase === 'work' ? <Flame className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                    <span>
                      {phase === 'work' 
                        ? (isEn ? `SET ${currentSet} OF ${totalSets}` : `सेट ${currentSet} / ${totalSets}`)
                        : (isEn ? `REST INTERVAL` : `रेस्ट समय`)}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                    {isEn ? `Total Time: ${formatTime(totalTimeSpentSec)}` : `कुल समय: ${formatTime(totalTimeSpentSec)}`}
                  </span>
                </div>

                {/* Video Demo Toggle */}
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showVideo ? (isEn ? 'Hide Video' : 'वीडियो छिपाएं') : (isEn ? 'Watch Form' : 'वीडियो देखें')}</span>
                </button>
              </div>

              {/* Live Exercise Form Animation */}
              <ExerciseAnimation
                animationKey={exercise.animationKey}
                targetMuscle={exercise.targetMuscle}
                isPlaying={isRunning}
                phase={phase}
                language={language}
                compact={true}
              />

              {/* Video Player when opened */}
              {showVideo && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner animate-in fade-in">
                  <ExerciseVideoPlayer
                    exerciseId={exercise.id}
                    targetMuscle={exercise.targetMuscle}
                    exerciseName={exercise.name}
                    autoPlayVideo={false}
                    language={language}
                  />
                </div>
              )}

              {/* Central Big Circular / Card Countdown Timer */}
              <div className={`p-4 sm:p-5 rounded-3xl border text-center transition-all shadow-xl relative overflow-hidden ${
                phase === 'work'
                  ? 'bg-gradient-to-b from-emerald-950/40 to-slate-950 border-emerald-500/40 shadow-emerald-500/10'
                  : 'bg-gradient-to-b from-cyan-950/40 to-slate-950 border-cyan-500/40 shadow-cyan-500/10'
              }`}>
                {/* Background pulse glow */}
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30 ${
                  phase === 'work' ? 'bg-emerald-500' : 'bg-cyan-500'
                }`} />

                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  {phase === 'work' 
                    ? (isEn ? 'WORKOUT DURATION' : 'कसरत समय (रेप्स लगाएं)')
                    : (isEn ? 'REST & RECOVER' : 'रेस्ट समय (सांस लें)')}
                </span>

                {/* Big Countdown Number */}
                <div className={`font-mono text-5xl sm:text-6xl font-black tracking-tight my-2 drop-shadow-md ${
                  phase === 'work' ? 'text-emerald-400' : 'text-cyan-400'
                }`}>
                  {formatTime(timeLeft)}
                </div>

                {/* Set dots indicator */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {Array.from({ length: totalSets }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx + 1 < currentSet
                          ? 'w-6 bg-amber-400'
                          : idx + 1 === currentSet
                          ? (phase === 'work' ? 'w-8 bg-emerald-400 animate-pulse' : 'w-8 bg-cyan-400')
                          : 'w-2 bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Timer Controls Row */}
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                {/* Adjust -10s */}
                <button
                  onClick={() => handleAdjustTime(-10)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition active:scale-95"
                  title="-10s"
                >
                  -10s
                </button>

                {/* Pause / Resume */}
                {isRunning ? (
                  <button
                    onClick={() => setIsRunning(false)}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>{isEn ? 'Pause' : 'रोकें'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRunning(true)}
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{isEn ? 'Resume' : 'शुरू करें'}</span>
                  </button>
                )}

                {/* Adjust +10s */}
                <button
                  onClick={() => handleAdjustTime(+10)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition active:scale-95"
                  title="+10s"
                >
                  +10s
                </button>

                {/* Complete Set Early or Skip Rest */}
                {phase === 'work' ? (
                  <button
                    onClick={handleFinishSetEarly}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isEn ? 'Set Done Early' : 'सेट पूरा हुआ'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSkipRest}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>{isEn ? 'Skip Rest' : 'रेस्ट छोड़ें'}</span>
                  </button>
                )}
              </div>

              {/* Adjust Settings shortcut */}
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setWorkoutState('setup');
                  }}
                  className="text-xs text-slate-400 hover:text-amber-400 underline underline-offset-4 cursor-pointer transition"
                >
                  {isEn ? '⚙️ Reconfigure Sets or Timers' : '⚙️ टाइमर व सेट्स दोबारा सेट करें'}
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 3: COMPLETED SCREEN ===================== */}
          {workoutState === 'completed' && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                <Award className="w-9 h-9" />
              </div>

              <h3 className="text-xl font-black text-white">
                {isEn ? 'Workout Complete' : 'कसरत पूरी हुई'}
              </h3>

              {/* Summary Badges */}
              <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto text-center pt-2">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? 'Sets Done' : 'कुल सेट्स'}</span>
                  <span className="text-lg font-black text-amber-400 font-mono">{totalSets}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? 'Total Time' : 'कुल समय'}</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{formatTime(totalTimeSpentSec)}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? 'Muscle' : 'मसल'}</span>
                  <span className="text-xs font-bold text-cyan-400 truncate block mt-1">{exercise.targetMuscle}</span>
                </div>
              </div>

              <div className="pt-4 max-w-xs mx-auto">
                <button
                  onClick={handleFinalSave}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm cursor-pointer transition shadow-xl shadow-amber-500/25 active:scale-98"
                >
                  {isEn ? 'Save & Finish Workout' : 'सेव करें और वापस जाएं'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
