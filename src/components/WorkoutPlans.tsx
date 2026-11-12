import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Sparkles, 
  Wind, 
  Video, 
  ChevronRight, 
  Award, 
  X,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutPlan, WorkoutPlanExercise, AppLanguage, DailyWorkoutLog } from '../types';
import { WORKOUT_PLANS } from '../data/workoutPlans';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import { 
  playIntervalChangeSound, 
  playTimerTick, 
  playRepDing, 
  playStreakFanfare 
} from '../utils/audio';
import { saveWorkoutLog, addWorkoutMinutesToGoal, getLocalDateString } from '../utils/storage';

interface WorkoutPlansProps {
  language?: AppLanguage;
  onPlanCompleted?: (plan: WorkoutPlan) => void;
  onOpenTracker?: () => void;
}

export const WorkoutPlans: React.FC<WorkoutPlansProps> = ({
  language = 'en',
  onPlanCompleted,
  onOpenTracker
}) => {
  const isEn = language === 'en';
  const todayStr = getLocalDateString();

  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [activePlanSession, setActivePlanSession] = useState<WorkoutPlan | null>(null);

  // Auto Guided Session States
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(35);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(true);

  const currentExercise: WorkoutPlanExercise | undefined = activePlanSession?.exercises[currentExerciseIndex];

  // Auto timer loop for guided exercise progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activePlanSession && isRunning && !isSessionFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseAdvance();
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePlanSession, isRunning, isSessionFinished, timeLeft, phase, currentExerciseIndex]);

  // Phase change logic: Work -> Rest -> Next Exercise -> ... -> Finish
  const handlePhaseAdvance = () => {
    if (!activePlanSession || !currentExercise) return;

    if (phase === 'work') {
      playRepDing();
      // If there are more exercises, move to rest
      if (currentExerciseIndex < activePlanSession.exercises.length - 1) {
        playIntervalChangeSound(false);
        setPhase('rest');
        setTimeLeft(currentExercise.restSec || 25);
      } else {
        // Last exercise completed!
        finishFullPlan();
      }
    } else {
      // Rest completed -> start next exercise work!
      playIntervalChangeSound(true);
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setPhase('work');
      setTimeLeft(activePlanSession.exercises[nextIndex].workSec || 35);
    }
  };

  // Start plan session
  const handleStartPlan = (plan: WorkoutPlan) => {
    setActivePlanSession(plan);
    setCurrentExerciseIndex(0);
    setPhase('work');
    setTimeLeft(plan.exercises[0].workSec || 35);
    setIsRunning(true);
    setIsSessionFinished(false);
    playIntervalChangeSound(true);
  };

  // Skip to next exercise
  const handleSkipExercise = () => {
    if (!activePlanSession) return;
    if (currentExerciseIndex < activePlanSession.exercises.length - 1) {
      playIntervalChangeSound(true);
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setPhase('work');
      setTimeLeft(activePlanSession.exercises[nextIndex].workSec || 35);
    } else {
      finishFullPlan();
    }
  };

  // Finish full plan
  const finishFullPlan = () => {
    if (!activePlanSession) return;
    setIsRunning(false);
    setIsSessionFinished(true);
    playStreakFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Save persistent workout log
    const log: DailyWorkoutLog = {
      id: 'plan-' + Date.now(),
      date: todayStr,
      title: `${activePlanSession.titleEn} (Full Body Routine)`,
      muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'abs'],
      durationMinutes: activePlanSession.durationMinutes,
      exercises: activePlanSession.exercises.map((e, idx) => ({
        exerciseId: e.exerciseId,
        exerciseName: e.name,
        targetMuscle: 'legs',
        sets: [{ id: `s${idx}`, setNumber: 1, weightKg: 0, reps: 12, completed: true }]
      }))
    };
    saveWorkoutLog(log);
    addWorkoutMinutesToGoal(activePlanSession.durationMinutes, todayStr);

    if (onPlanCompleted) {
      onPlanCompleted(activePlanSession);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {isEn ? 'Ready Full Body Routines' : 'रेडीमेड फुल-बॉडी वर्कआउट प्लान्स'}
              </span>
              <span className="text-xs text-slate-400">⚡ Auto-Guided Player</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isEn ? 'Full Body Workout Plans' : 'पूरी बॉडी के वर्कआउट प्लान्स'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              {isEn 
                ? 'Scientifically structured routines to train your entire body. Includes auto exercise guidance with timers and breathing techniques.'
                : 'पूरी बॉडी की कसरत के लिए तैयार प्लान्स (Lite, Moderate, Hard, Fat Loss)। ऑटो टाइमर और सांस लेने के नियम के साथ।'
              }
            </p>
          </div>

          {onOpenTracker && (
            <button
              onClick={onOpenTracker}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
            >
              <Target className="w-4 h-4" />
              <span>{isEn ? 'Daily Goal Tracker' : 'वर्कआउट ट्रैकर'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Plans Grid (Lite, Moderate, Hard, Fat Loss) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {WORKOUT_PLANS.map((plan) => (
          <div
            key={plan.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl transition group relative overflow-hidden"
          >
            {/* Top gradient highlight bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${plan.color}`} />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-xl bg-slate-950 text-xs font-black border border-slate-800 text-slate-200">
                  {plan.badge}
                </span>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{plan.durationMinutes} {isEn ? 'mins' : 'मिनट'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span>~{plan.caloriesBurnEstimate} kcal</span>
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition">
                  {isEn ? plan.titleEn : plan.titleHi}
                </h3>
                <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                  {isEn ? plan.taglineEn : plan.taglineHi}
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {isEn ? plan.descriptionEn : plan.descriptionHi}
                </p>
              </div>

              {/* Exercises List Preview */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-800/60 pb-1">
                  <span>{isEn ? `Exercises (${plan.exercises.length} Total):` : `कसरतें (कुल ${plan.exercises.length}):`}</span>
                  <span className="text-amber-400 font-mono">Full Body</span>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto pr-1 text-xs">
                  {plan.exercises.map((ex, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300 py-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-4 text-[10px] text-slate-500 font-mono">{idx + 1}.</span>
                        <span className="truncate">{isEn ? ex.name : ex.hindiName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0 ml-1">
                        {ex.workSec}s
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Auto-Guided Workout Button */}
            <div className="pt-2">
              <button
                onClick={() => handleStartPlan(plan)}
                className={`w-full py-3 rounded-2xl bg-gradient-to-r ${plan.color} hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-98`}
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>
                  {isEn ? `Start ${plan.titleEn} (Auto Player)` : `ऑटो ${plan.titleHi} शुरू करें`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== AUTO GUIDED EXERCISE PLAYER MODAL ===================== */}
      {activePlanSession && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[94vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {isEn ? activePlanSession.titleEn : activePlanSession.titleHi}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {isEn ? 'Auto-Guided Exercise Player' : 'ऑटो-गाइडेड वर्कआउट प्लेयर'}
                </h3>
              </div>

              <button
                onClick={() => setActivePlanSession(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Finished */}
            {isSessionFinished ? (
              <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                  <Award className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isEn ? 'Full Body Plan Crushed! 🏆' : 'फुल-बॉडी वर्कआउट पूरा हुआ! 🏆'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isEn 
                      ? `Great effort completing ${activePlanSession.titleEn}! Added ${activePlanSession.durationMinutes}m to your daily goal.`
                      : `शानदार मेहनत! आपने ${activePlanSession.titleHi} पूरा कर लिया। ${activePlanSession.durationMinutes} मिनट आपके दैनिक गोल में जुड़ गए।`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-center pt-2">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{isEn ? 'Exercises' : 'कसरतें'}</span>
                    <span className="text-lg font-black text-white">{activePlanSession.exercises.length}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{isEn ? 'Est. Burn' : 'कैलोरी बर्न'}</span>
                    <span className="text-lg font-black text-amber-400">~{activePlanSession.caloriesBurnEstimate} kcal</span>
                  </div>
                </div>

                <div className="pt-4 max-w-xs mx-auto">
                  <button
                    onClick={() => setActivePlanSession(null)}
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer transition shadow-lg shadow-amber-500/25"
                  >
                    {isEn ? 'Finish & Return' : 'वापस जाएं'}
                  </button>
                </div>
              </div>
            ) : currentExercise ? (
              <div className="space-y-4">
                
                {/* Exercise Progress Header */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                      {isEn 
                        ? `EXERCISE ${currentExerciseIndex + 1} OF ${activePlanSession.exercises.length}` 
                        : `कसरत ${currentExerciseIndex + 1} / ${activePlanSession.exercises.length}`}
                    </span>
                    <span className="text-xs text-slate-300 font-bold hidden sm:inline">
                      {isEn ? currentExercise.name : currentExercise.hindiName}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showVideo ? (isEn ? 'Hide Video' : 'वीडियो छिपाएं') : (isEn ? 'Watch Video' : 'वीडियो देखें')}</span>
                  </button>
                </div>

                {/* Real YouTube Video Player for exact form */}
                {showVideo && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                    <ExerciseVideoPlayer
                      exerciseId={currentExercise.exerciseId}
                      targetMuscle={currentExercise.targetMuscle as any}
                      exerciseName={currentExercise.name}
                      autoPlayVideo={false}
                      language={language}
                    />
                  </div>
                )}

                {/* Central Auto Countdown & Phase Card */}
                <div className={`p-6 rounded-3xl border text-center transition-all shadow-xl relative overflow-hidden ${
                  phase === 'work'
                    ? 'bg-gradient-to-b from-emerald-950/40 to-slate-950 border-emerald-500/40 shadow-emerald-500/10'
                    : 'bg-gradient-to-b from-cyan-950/40 to-slate-950 border-cyan-500/40 shadow-cyan-500/10'
                }`}>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    {phase === 'work' 
                      ? (isEn ? `🔥 WORKOUT TIME: ${currentExercise.name}` : `🔥 कसरत समय: ${currentExercise.hindiName}`)
                      : (isEn ? `☕ REST TIME (Next: ${activePlanSession.exercises[currentExerciseIndex + 1]?.name || 'Finish'})` : `☕ आराम का समय (अगली: ${activePlanSession.exercises[currentExerciseIndex + 1]?.hindiName || 'समाप्त'})`)}
                  </span>

                  <div className={`font-mono text-5xl sm:text-6xl font-black tracking-tight my-2 drop-shadow-md ${
                    phase === 'work' ? 'text-emerald-400' : 'text-cyan-400'
                  }`}>
                    {formatSeconds(timeLeft)}
                  </div>

                  <span className="text-xs text-slate-400 font-bold block">
                    {isEn ? `Target Muscle: ${currentExercise.targetMuscle}` : `टारगेट: ${currentExercise.targetMuscle}`}
                  </span>

                  {/* LIVE BREATHING TECHNIQUE */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 bg-slate-950/80 p-3 rounded-2xl text-xs space-y-1.5 text-left">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isEn ? 'Breathing Technique (सांस का नियम):' : 'सांस का नियम (Breathing Technique):'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-xl text-cyan-200">
                        <strong className="block text-cyan-400 text-[11px]">🟢 {isEn ? 'Inhale:' : 'सांस अंदर:'}</strong>
                        <span className="text-[11px] leading-snug">{currentExercise.breathingInhale}</span>
                      </div>
                      <div className="bg-rose-950/30 border border-rose-800/40 p-2 rounded-xl text-rose-200">
                        <strong className="block text-rose-400 text-[11px]">🔴 {isEn ? 'Exhale:' : 'सांस बाहर:'}</strong>
                        <span className="text-[11px] leading-snug">{currentExercise.breathingExhale}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic pt-0.5">
                      💡 {currentExercise.tip}
                    </p>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-center gap-3">
                  {isRunning ? (
                    <button
                      onClick={() => setIsRunning(false)}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-lg active:scale-95"
                    >
                      <Pause className="w-4 h-4 fill-slate-950" />
                      <span>{isEn ? 'Pause' : 'रोकें'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsRunning(true)}
                      className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-lg active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>{isEn ? 'Resume' : 'शुरू करें'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleSkipExercise}
                    className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>{isEn ? 'Skip / Next' : 'अगली कसरत'}</span>
                  </button>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      )}

    </div>
  );
};
