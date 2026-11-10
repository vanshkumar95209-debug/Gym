import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  RotateCcw, 
  Check, 
  Plus, 
  Trash2, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Info, 
  Compass, 
  Target, 
  Wind, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, WorkoutSet, AppLanguage } from '../types';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import { playRepDing, playTimerTick, playTimerComplete } from '../utils/audio';
import { getExerciseGuide } from '../data/exerciseGuides';

interface ActiveWorkoutModalProps {
  exercise: Exercise;
  onClose: () => void;
  onFinishWorkout: (exercise: Exercise, sets: WorkoutSet[]) => void;
  language?: AppLanguage;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  exercise,
  onClose,
  onFinishWorkout,
  language = 'en'
}) => {
  const isEn = language === 'en';
  const guide = getExerciseGuide(exercise, language);

  // Sets state
  const [sets, setSets] = useState<WorkoutSet[]>([
    { id: '1', setNumber: 1, weightKg: 20, reps: 12, completed: false },
    { id: '2', setNumber: 2, weightKg: 25, reps: 10, completed: false },
    { id: '3', setNumber: 3, weightKg: 30, reps: 8, completed: false },
  ]);

  // Rest Timer state
  const [restDuration, setRestDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [showGuideDetails, setShowGuideDetails] = useState<boolean>(false);

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            playTimerComplete();
            return 0;
          }
          if (prev <= 4) {
            playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const startRestTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setTimerRunning(true);
  };

  const handleToggleSetComplete = (setId: string) => {
    setSets(prev => prev.map(s => {
      if (s.id === setId) {
        const nextState = !s.completed;
        if (nextState) {
          playRepDing();
          startRestTimer(restDuration);
        }
        return { ...s, completed: nextState };
      }
      return s;
    }));
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: WorkoutSet = {
      id: String(Date.now()),
      setNumber: sets.length + 1,
      weightKg: lastSet ? lastSet.weightKg : 20,
      reps: lastSet ? lastSet.reps : 10,
      completed: false
    };
    setSets([...sets, newSet]);
  };

  const handleDeleteSet = (setId: string) => {
    if (sets.length <= 1) return;
    const filtered = sets.filter(s => s.id !== setId).map((s, idx) => ({
      ...s,
      setNumber: idx + 1
    }));
    setSets(filtered);
  };

  const handleFinish = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onFinishWorkout(exercise, sets);
  };

  const totalVolume = sets
    .filter(s => s.completed)
    .reduce((sum, s) => sum + (s.weightKg * s.reps), 0);

  const completedSetsCount = sets.filter(s => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Top Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {isEn ? 'Live Workout' : 'सक्रिय वर्कआउट'}
              </span>
              <span className="text-xs text-slate-400">{exercise.equipment}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {isEn ? exercise.name : exercise.hindiName}
            </h2>
            <p className="text-xs text-slate-400">
              {isEn ? exercise.targetSubMuscle : exercise.targetSubMuscle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Real Video & Photo Demonstration (No SVG Animation!) */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Real Video & Technique' : 'असली वीडियो व तकनीक'}</span>
              </span>
              
              <button
                onClick={() => setShowGuideDetails(!showGuideDetails)}
                className="text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Info className="w-3.5 h-3.5" />
                <span>
                  {showGuideDetails 
                    ? (isEn ? 'Hide Guide' : 'गाइड छिपाएं') 
                    : (isEn ? 'Show Form Guide' : 'पोजीशन व गाइड देखें')}
                </span>
              </button>
            </div>

            <ExerciseVideoPlayer
              exerciseId={exercise.id}
              targetMuscle={exercise.targetMuscle}
              exerciseName={exercise.name}
              autoPlayVideo={false}
              language={language}
            />

            {/* Collapsible Form & Position Guide */}
            {showGuideDetails && (
              <div className="mt-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs animate-in fade-in">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>{guide.positionSetup.heading}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <strong className="text-slate-200 block mb-0.5">{isEn ? 'Stance & Body:' : 'शरीर / मुद्रा:'}</strong>
                    <span>{guide.positionSetup.stance}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <strong className="text-slate-200 block mb-0.5">{isEn ? 'Grip & Hands:' : 'ग्रिप व हाथ:'}</strong>
                    <span>{guide.positionSetup.grip}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <strong className="text-slate-200 block mb-0.5">{isEn ? 'Posture:' : 'कमर व छाती:'}</strong>
                    <span>{guide.positionSetup.posture}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <strong className="text-slate-200 block mb-0.5">{isEn ? 'Feet Base:' : 'पैर व संतुलन:'}</strong>
                    <span>{guide.positionSetup.feet}</span>
                  </div>
                </div>

                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex items-center gap-1.5 pt-1">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>{guide.executionSteps.heading}</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <strong className="text-blue-400 block mb-0.5">{isEn ? '⬇️ Lowering:' : '⬇️ नीचे लाते वक्त:'}</strong>
                    <span>{guide.executionSteps.step1Negative}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <strong className="text-emerald-400 block mb-0.5">{isEn ? '⬆️ Pressing / Pulling:' : '⬆️ ऊपर धकेलते वक्त:'}</strong>
                    <span>{guide.executionSteps.step2Positive}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-lg text-cyan-200">
                    <strong className="text-cyan-400 block mb-0.5">{isEn ? 'Breathing:' : 'सांस का नियम:'}</strong>
                    <span>{guide.breathing.inhale} {guide.breathing.exhale}</span>
                  </div>
                  <div className="bg-rose-950/30 border border-rose-800/40 p-2 rounded-lg text-rose-200">
                    <strong className="text-rose-400 block mb-0.5">{isEn ? 'Mistake to Avoid:' : 'गलतियों से बचें:'}</strong>
                    <span>{guide.mistakes.items[0]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rest Countdown Timer Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 flex items-center justify-center bg-cyan-500/10 text-cyan-400 font-mono font-bold text-base">
                {timeLeft > 0 ? `${timeLeft}s` : '0s'}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{isEn ? 'Rest Timer' : 'रेस्ट टाइमर'}</span>
                  {timerRunning && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  {timerRunning 
                    ? (isEn ? 'Catch your breath and prepare for the next set' : 'सांस लें और अगली सेट की तैयारी करें')
                    : (isEn ? 'Timer starts automatically when completing a set' : 'सेट पूरा होने पर ऑटोमैटिक टाइमर शुरू होगा')}
                </p>
              </div>
            </div>

            {/* Rest Preset Buttons */}
            <div className="flex items-center gap-1.5">
              {[30, 60, 90].map(sec => (
                <button
                  key={sec}
                  onClick={() => {
                    setRestDuration(sec);
                    startRestTimer(sec);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold border cursor-pointer transition ${
                    timeLeft === sec && timerRunning
                      ? 'bg-cyan-500 text-black border-cyan-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {sec}s
                </button>
              ))}
              {timerRunning && (
                <button
                  onClick={() => setTimerRunning(false)}
                  className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 cursor-pointer"
                >
                  {isEn ? 'Stop' : 'रोकें'}
                </button>
              )}
            </div>
          </div>

          {/* Sets and Reps Logging Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">
                {isEn ? 'Sets & Weight Logger' : 'सेट्स व वजन दर्ज करें'}
              </h3>
              <span className="text-xs text-slate-400">
                {isEn ? 'Total Volume:' : 'कुल वॉल्यूम:'} <strong className="text-amber-400">{totalVolume} kg</strong>
              </span>
            </div>

            <div className="space-y-2">
              {sets.map((set) => (
                <div
                  key={set.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                    set.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/70 border-slate-800 text-slate-200'
                  }`}
                >
                  {/* Set Number */}
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                    S{set.setNumber}
                  </div>

                  {/* Weight Input (Kg) */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={set.weightKg}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setSets(sets.map(s => s.id === set.id ? { ...s, weightKg: val } : s));
                      }}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-center text-xs text-white font-bold focus:border-amber-500 outline-none"
                    />
                    <span className="text-xs text-slate-400">kg</span>
                  </div>

                  {/* Reps Input */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      value={set.reps}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 1;
                        setSets(sets.map(s => s.id === set.id ? { ...s, reps: val } : s));
                      }}
                      className="w-14 bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-center text-xs text-white font-bold focus:border-amber-500 outline-none"
                    />
                    <span className="text-xs text-slate-400">{isEn ? 'reps' : 'रेप्स'}</span>
                  </div>

                  {/* Complete Button */}
                  <button
                    onClick={() => handleToggleSetComplete(set.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition ${
                      set.completed
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteSet(set.id)}
                    disabled={sets.length <= 1}
                    className="p-1.5 text-slate-500 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Set Button */}
            <button
              onClick={handleAddSet}
              className="mt-3 w-full py-2 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEn ? '+ Add Set' : '+ सेट जोड़ें'}</span>
            </button>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {isEn ? 'Completed Sets:' : 'पूरे किए गए सेट्स:'}{' '}
            <strong className="text-white">{completedSetsCount} / {sets.length}</strong>
          </div>

          <button
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg shadow-orange-500/20 flex items-center gap-2 transition"
          >
            <Award className="w-4 h-4" />
            <span>{isEn ? 'Finish Workout & Save' : 'वर्कआउट पूरा करें व सेव करें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
