import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Wind, 
  Minus,
  Plus,
  Timer,
  Flame,
  Coffee
} from 'lucide-react';
import { Exercise, AppLanguage } from '../types';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import { getExerciseGuide } from '../data/exerciseGuides';
import { playIntervalChangeSound } from '../utils/audio';

interface ExerciseGuideModalProps {
  exercise: Exercise;
  onClose: () => void;
  onStartWorkout: (
    exercise: Exercise, 
    timerSettings?: { sets: number; workoutTime: number; restTime: number }
  ) => void;
  language?: AppLanguage;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({
  exercise,
  onClose,
  onStartWorkout,
  language = 'en'
}) => {
  const guide = getExerciseGuide(exercise, language);
  const isEn = language === 'en';

  // Workout Timer & Sets configuration before starting exercise
  const [setsCount, setSetsCount] = useState<number>(3);
  const [workoutTime, setWorkoutTime] = useState<number>(40); // in seconds
  const [restTime, setRestTime] = useState<number>(60); // in seconds

  const handleStart = () => {
    playIntervalChangeSound(true);
    onClose();
    onStartWorkout(exercise, {
      sets: Math.max(1, setsCount),
      workoutTime: Math.max(5, workoutTime),
      restTime: Math.max(0, restTime)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[94vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl relative">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                {guide.equipment}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[11px]">
                🎯 {guide.targetMuscle}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px]">
                {guide.recommendedSetsReps}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white mt-1.5 tracking-tight">
              {guide.title}
            </h2>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              {isEn ? `Target: ${guide.targetSubMuscle}` : `टारगेट: ${guide.targetSubMuscle}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer transition shrink-0"
            title={isEn ? "Close" : "बंद करें"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Demonstration: Real YouTube Video Player */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <ExerciseVideoPlayer
            exerciseId={exercise.id}
            targetMuscle={exercise.targetMuscle}
            exerciseName={exercise.name}
            autoPlayVideo={false}
            language={language}
          />
        </div>

        {/* ONLY BREATHING TECHNIQUE (Guide removed as per user request) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs sm:text-sm">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>{isEn ? 'Breathing Technique (सांस का नियम)' : 'सांस का नियम (Breathing Technique)'}</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
              {isEn ? 'Rule for this exercise' : 'इस कसरत के लिए'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-cyan-400 text-xs">
                <span>🟢</span>
                <span>{isEn ? 'Inhale (सांस अंदर लें):' : 'सांस अंदर लें (Inhale):'}</span>
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                {guide.breathing.inhale}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-rose-400 text-xs">
                <span>🔴</span>
                <span>{isEn ? 'Exhale (सांस बाहर छोड़ें):' : 'सांस बाहर छोड़ें (Exhale):'}</span>
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                {guide.breathing.exhale}
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
            <span className="text-amber-400 font-bold">💡</span>
            <span className="italic leading-relaxed">{guide.breathing.tip}</span>
          </div>
        </div>

        {/* WORKOUT TIMER & SETS CONFIGURATION (Before Starting Exercise) */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Timer & Sets Setup' : 'टाइमर और सेट्स सेटिंग्स'}</span>
            </div>
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {isEn ? 'Customize before start' : 'शुरू करने से पहले सेट करें'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* 1. Sets Count */}
            <div className="space-y-1.5 text-center">
              <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                {isEn ? 'Sets' : 'कुल सेट्स'}
              </label>
              <div className="flex items-center justify-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-1 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all">
                <button
                  type="button"
                  onClick={() => setSetsCount(s => Math.max(1, s - 1))}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                  title="-1 Set"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={setsCount || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSetsCount(isNaN(val) ? 1 : Math.max(1, Math.min(20, val)));
                  }}
                  onBlur={() => {
                    if (!setsCount || setsCount < 1) setSetsCount(1);
                  }}
                  className="w-10 sm:w-12 text-center bg-transparent font-mono font-black text-white text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                />
                <button
                  type="button"
                  onClick={() => setSetsCount(s => Math.min(20, s + 1))}
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
                <span>{isEn ? 'Work (Sec)' : 'वर्कआउट (सेकंड)'}</span>
              </label>
              <div className="flex items-center justify-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-1 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
                <button
                  type="button"
                  onClick={() => setWorkoutTime(w => Math.max(5, w - 5))}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                  title="-5s"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={workoutTime || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setWorkoutTime(isNaN(val) ? 5 : Math.max(5, Math.min(300, val)));
                  }}
                  onBlur={() => {
                    if (!workoutTime || workoutTime < 5) setWorkoutTime(5);
                  }}
                  className="w-10 sm:w-12 text-center bg-transparent font-mono font-black text-white text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                />
                <button
                  type="button"
                  onClick={() => setWorkoutTime(w => Math.min(300, w + 5))}
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
                <span>{isEn ? 'Rest (Sec)' : 'रेस्ट (सेकंड)'}</span>
              </label>
              <div className="flex items-center justify-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-1 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
                <button
                  type="button"
                  onClick={() => setRestTime(r => Math.max(0, r - 5))}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                  title="-5s"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={restTime === 0 ? '0' : (restTime || '')}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setRestTime(isNaN(val) ? 0 : Math.max(0, Math.min(300, val)));
                  }}
                  className="w-10 sm:w-12 text-center bg-transparent font-mono font-black text-white text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                />
                <button
                  type="button"
                  onClick={() => setRestTime(r => Math.min(300, r + 5))}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition active:scale-95 cursor-pointer"
                  title="+5s"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm cursor-pointer transition text-center"
          >
            {isEn ? 'Back' : 'वापस'}
          </button>

          <button
            onClick={handleStart}
            className="flex-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isEn ? 'Start Exercise' : 'कसरत शुरू करें'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
