import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Timer, 
  Flame, 
  Clock, 
  Minimize2, 
  Plus, 
  Minus, 
  Flag, 
  Award,
  Sparkles
} from 'lucide-react';
import { AppLanguage } from '../types';
import { playTimerTick, playTimerComplete, playIntervalChangeSound } from '../utils/audio';

interface CustomTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
  onTimerStateChange?: (isRunning: boolean, displayTime: string) => void;
}

type TimerTab = 'countdown' | 'interval' | 'stopwatch';
type IntervalPhase = 'work' | 'rest' | 'prep' | 'finished';

export const CustomTimerModal: React.FC<CustomTimerModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<TimerTab>('countdown');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // ==================== 1. COUNTDOWN / REST TIMER STATE ====================
  const [countdownDuration, setCountdownDuration] = useState<number>(60); // default 60s
  const [countdownRemaining, setCountdownRemaining] = useState<number>(60);
  const [isCountdownRunning, setIsCountdownRunning] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<number>(1);
  const [customSeconds, setCustomSeconds] = useState<number>(0);

  // Countdown timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountdownRunning && countdownRemaining > 0) {
      interval = setInterval(() => {
        setCountdownRemaining(prev => {
          if (prev <= 1) {
            setIsCountdownRunning(false);
            if (soundEnabled) playTimerComplete();
            return 0;
          }
          if (prev <= 4 && soundEnabled) {
            playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCountdownRunning, countdownRemaining, soundEnabled]);

  const handleStartCountdown = () => {
    if (countdownRemaining === 0) {
      setCountdownRemaining(countdownDuration);
    }
    setIsCountdownRunning(true);
  };

  const handlePauseCountdown = () => {
    setIsCountdownRunning(false);
  };

  const handleResetCountdown = () => {
    setIsCountdownRunning(false);
    setCountdownRemaining(countdownDuration);
  };

  const handleSetPreset = (seconds: number) => {
    setIsCountdownRunning(false);
    setCountdownDuration(seconds);
    setCountdownRemaining(seconds);
    setCustomMinutes(Math.floor(seconds / 60));
    setCustomSeconds(seconds % 60);
  };

  const handleApplyCustomTime = () => {
    const total = Math.max(5, (customMinutes * 60) + customSeconds);
    setIsCountdownRunning(false);
    setCountdownDuration(total);
    setCountdownRemaining(total);
  };

  const handleAdjustCountdown = (deltaSec: number) => {
    setCountdownRemaining(prev => {
      const next = Math.max(5, prev + deltaSec);
      setCountdownDuration(next);
      setCustomMinutes(Math.floor(next / 60));
      setCustomSeconds(next % 60);
      return next;
    });
  };

  // ==================== 2. INTERVAL / HIIT TIMER STATE ====================
  const [workDuration, setWorkDuration] = useState<number>(40);
  const [restDuration, setRestDuration] = useState<number>(20);
  const [totalRounds, setTotalRounds] = useState<number>(8);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [intervalPhase, setIntervalPhase] = useState<IntervalPhase>('work');
  const [intervalRemaining, setIntervalRemaining] = useState<number>(40);
  const [isIntervalRunning, setIsIntervalRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isIntervalRunning && intervalPhase !== 'finished') {
      interval = setInterval(() => {
        setIntervalRemaining(prev => {
          if (prev <= 1) {
            // Transition phase
            if (intervalPhase === 'work') {
              if (currentRound >= totalRounds) {
                // Completed all rounds!
                setIntervalPhase('finished');
                setIsIntervalRunning(false);
                if (soundEnabled) playTimerComplete();
                return 0;
              } else {
                // Switch to Rest
                setIntervalPhase('rest');
                if (soundEnabled) playIntervalChangeSound(false);
                return restDuration;
              }
            } else if (intervalPhase === 'rest') {
              // Switch to Work next round
              setCurrentRound(r => r + 1);
              setIntervalPhase('work');
              if (soundEnabled) playIntervalChangeSound(true);
              return workDuration;
            }
          }
          if (prev <= 4 && soundEnabled) {
            playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isIntervalRunning, intervalPhase, currentRound, totalRounds, workDuration, restDuration, soundEnabled]);

  const handleStartInterval = () => {
    if (intervalPhase === 'finished') {
      setCurrentRound(1);
      setIntervalPhase('work');
      setIntervalRemaining(workDuration);
    }
    setIsIntervalRunning(true);
  };

  const handlePauseInterval = () => {
    setIsIntervalRunning(false);
  };

  const handleResetInterval = () => {
    setIsIntervalRunning(false);
    setCurrentRound(1);
    setIntervalPhase('work');
    setIntervalRemaining(workDuration);
  };

  // ==================== 3. STOPWATCH STATE ====================
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (isStopwatchRunning) {
        const delta = currentTime - lastTime;
        setStopwatchMs(prev => prev + delta);
        lastTime = currentTime;
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    if (isStopwatchRunning) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isStopwatchRunning]);

  const handleStartStopwatch = () => {
    setIsStopwatchRunning(true);
  };

  const handlePauseStopwatch = () => {
    setIsStopwatchRunning(false);
  };

  const handleResetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchMs(0);
    setLaps([]);
  };

  const handleLapStopwatch = () => {
    setLaps(prev => [stopwatchMs, ...prev]);
  };

  // Helper Formatters
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatStopwatch = (totalMs: number) => {
    const totalSec = Math.floor(totalMs / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const ms = Math.floor((totalMs % 1000) / 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${ms}`;
  };

  if (!isOpen) return null;

  // Circular progress percentage for countdown
  const countdownProgress = countdownDuration > 0 ? (countdownRemaining / countdownDuration) * 100 : 0;
  const strokeDashoffset = 440 - (440 * countdownProgress) / 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-orange-500/20">
              <Timer className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{isEn ? 'Custom Gym Timer' : 'कस्टम जिम टाइमर'}</span>
              </h2>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                {isEn ? 'Rest, HIIT Intervals & Stopwatch' : 'रेस्ट, HIIT इंटरवल व स्टॉपवॉच'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                soundEnabled 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'bg-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? (isEn ? "Sound On" : "साउंड चालू") : (isEn ? "Muted" : "साउंड बंद")}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 transition cursor-pointer"
              title={isEn ? "Close Timer" : "टाइमर बंद करें"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-4 sm:px-5 pt-3 pb-1 border-b border-slate-800/60 bg-slate-950/40">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('countdown')}
              className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'countdown'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{isEn ? 'Rest / Timer' : 'रेस्ट टाइमर'}</span>
            </button>

            <button
              onClick={() => setActiveTab('interval')}
              className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'interval'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isEn ? 'HIIT / Tabata' : 'HIIT इंटरवल'}</span>
            </button>

            <button
              onClick={() => setActiveTab('stopwatch')}
              className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'stopwatch'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isEn ? 'Stopwatch' : 'स्टॉपवॉच'}</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* ======================= TAB 1: COUNTDOWN / REST ======================= */}
          {activeTab === 'countdown' && (
            <div className="space-y-6">
              {/* Big Digital Countdown Circle Display */}
              <div className="flex flex-col items-center justify-center py-2 relative">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* SVG Background and Progress Circle */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className={`transition-all duration-300 ${
                        countdownRemaining <= 5 && isCountdownRunning
                          ? 'stroke-red-500 animate-pulse'
                          : 'stroke-amber-500'
                      }`}
                      strokeWidth="8"
                      strokeDasharray="440"
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  {/* Inside Circle: Big Time Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-wider font-mono">
                      {formatTime(countdownRemaining)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      {isCountdownRunning ? (isEn ? 'Running...' : 'चल रहा है...') : (isEn ? 'Rest Timer' : 'रेस्ट टाइमर')}
                    </span>
                  </div>
                </div>

                {/* Quick Add/Subtract Stepper Controls */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleAdjustCountdown(-15)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    -15s
                  </button>
                  <button
                    onClick={() => handleAdjustCountdown(+15)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    +15s
                  </button>
                  <button
                    onClick={() => handleAdjustCountdown(+30)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    +30s
                  </button>
                  <button
                    onClick={() => handleAdjustCountdown(+60)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    +1m
                  </button>
                </div>
              </div>

              {/* Main Play / Pause / Reset Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetCountdown}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer shadow-md"
                  title={isEn ? "Reset" : "रीसेट"}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {isCountdownRunning ? (
                  <button
                    onClick={handlePauseCountdown}
                    className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg shadow-amber-500/25 flex items-center gap-2"
                  >
                    <Pause className="w-5 h-5 fill-slate-950" />
                    <span>{isEn ? 'Pause' : 'रोकें'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartCountdown}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg shadow-orange-500/25 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>{isEn ? 'Start Timer' : 'टाइमर शुरू करें'}</span>
                  </button>
                )}
              </div>

              {/* Quick Preset Badges */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isEn ? 'Quick Gym Rest Presets' : 'क्विक रेस्ट प्रीसेट्स:'}
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[30, 45, 60, 90, 120, 180].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => handleSetPreset(sec)}
                      className={`py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        countdownDuration === sec
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Minutes and Seconds Setter */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-white block">
                  {isEn ? 'Set Exact Custom Time:' : 'खुद का समय सेट करें:'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-bold">{isEn ? 'Mins:' : 'मिनट:'}</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-transparent text-white font-mono font-bold text-sm outline-none"
                    />
                  </div>

                  <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-bold">{isEn ? 'Secs:' : 'सेकंड:'}</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customSeconds}
                      onChange={(e) => setCustomSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="w-full bg-transparent text-white font-mono font-bold text-sm outline-none"
                    />
                  </div>

                  <button
                    onClick={handleApplyCustomTime}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl transition cursor-pointer whitespace-nowrap"
                  >
                    {isEn ? 'Set' : 'लागू करें'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 2: HIIT / TABATA INTERVAL ======================= */}
          {activeTab === 'interval' && (
            <div className="space-y-6">
              {/* Interval Display Banner */}
              <div className={`p-5 rounded-3xl border text-center transition-all shadow-xl ${
                intervalPhase === 'work'
                  ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/40 shadow-emerald-500/10'
                  : intervalPhase === 'rest'
                  ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500/40 shadow-cyan-500/10'
                  : 'bg-slate-950 border-slate-800'
              }`}>
                {/* Phase Indicator */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 bg-black/40">
                  {intervalPhase === 'work' && (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 fill-emerald-400 animate-pulse" />
                      {isEn ? 'WORK HARD!' : 'कसरत चालू रखें! (WORK)'}
                    </span>
                  )}
                  {intervalPhase === 'rest' && (
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      {isEn ? 'REST & BREATHE' : 'आराम व सांस लें (REST)'}
                    </span>
                  )}
                  {intervalPhase === 'finished' && (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      {isEn ? 'COMPLETED!' : 'इंटरवल पूरा हुआ!'}
                    </span>
                  )}
                </div>

                {/* Big Interval Countdown */}
                <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-wider py-1">
                  {formatTime(intervalRemaining)}
                </div>

                {/* Round Tracker */}
                <div className="text-xs font-bold text-slate-300 mt-2">
                  {isEn ? 'Round' : 'राउंड'}: <strong className="text-amber-400 text-sm font-black">{currentRound}</strong> / {totalRounds}
                </div>
              </div>

              {/* Play / Pause / Reset Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetInterval}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                  title={isEn ? "Reset" : "रीसेट"}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {isIntervalRunning ? (
                  <button
                    onClick={handlePauseInterval}
                    className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg shadow-amber-500/25 flex items-center gap-2"
                  >
                    <Pause className="w-5 h-5 fill-slate-950" />
                    <span>{isEn ? 'Pause' : 'रोकें'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartInterval}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>{isEn ? 'Start Interval' : 'इंटरवल शुरू करें'}</span>
                  </button>
                )}
              </div>

              {/* Interval Configurations */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                  {isEn ? 'Interval Settings:' : 'इंटरवल सेटिंग्स:'}
                </span>

                <div className="grid grid-cols-3 gap-3">
                  {/* Work Duration */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[10px] font-bold text-emerald-400 uppercase block">
                      {isEn ? 'Work (Sec)' : 'वर्क (सेकंड)'}
                    </label>
                    <div className="flex items-center justify-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => {
                          const next = Math.max(10, workDuration - 5);
                          setWorkDuration(next);
                          if (intervalPhase === 'work' && !isIntervalRunning) setIntervalRemaining(next);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-white text-sm w-7">{workDuration}</span>
                      <button
                        onClick={() => {
                          const next = workDuration + 5;
                          setWorkDuration(next);
                          if (intervalPhase === 'work' && !isIntervalRunning) setIntervalRemaining(next);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rest Duration */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[10px] font-bold text-cyan-400 uppercase block">
                      {isEn ? 'Rest (Sec)' : 'रेस्ट (सेकंड)'}
                    </label>
                    <div className="flex items-center justify-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => {
                          const next = Math.max(5, restDuration - 5);
                          setRestDuration(next);
                          if (intervalPhase === 'rest' && !isIntervalRunning) setIntervalRemaining(next);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-white text-sm w-7">{restDuration}</span>
                      <button
                        onClick={() => {
                          const next = restDuration + 5;
                          setRestDuration(next);
                          if (intervalPhase === 'rest' && !isIntervalRunning) setIntervalRemaining(next);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total Rounds */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[10px] font-bold text-amber-400 uppercase block">
                      {isEn ? 'Rounds' : 'राउंड्स'}
                    </label>
                    <div className="flex items-center justify-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => setTotalRounds(r => Math.max(1, r - 1))}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-white text-sm w-7">{totalRounds}</span>
                      <button
                        onClick={() => setTotalRounds(r => r + 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 3: STOPWATCH ======================= */}
          {activeTab === 'stopwatch' && (
            <div className="space-y-6">
              {/* Big Stopwatch Display */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center shadow-xl">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  {isEn ? 'Elapsed Time' : 'बीता हुआ समय'}
                </span>
                <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-wider py-2">
                  {formatStopwatch(stopwatchMs)}
                </div>
              </div>

              {/* Stopwatch Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetStopwatch}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                  title={isEn ? "Reset" : "रीसेट"}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {isStopwatchRunning ? (
                  <>
                    <button
                      onClick={handlePauseStopwatch}
                      className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg shadow-amber-500/25 flex items-center gap-2"
                    >
                      <Pause className="w-5 h-5 fill-slate-950" />
                      <span>{isEn ? 'Pause' : 'रोकें'}</span>
                    </button>

                    <button
                      onClick={handleLapStopwatch}
                      className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Flag className="w-4 h-4" />
                      <span>{isEn ? 'Lap' : 'लैप'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartStopwatch}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg shadow-orange-500/25 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>{isEn ? 'Start' : 'शुरू करें'}</span>
                  </button>
                )}
              </div>

              {/* Lap Times List */}
              {laps.length > 0 && (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 space-y-2 max-h-40 overflow-y-auto">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between px-2">
                    <span>{isEn ? 'Lap #' : 'लैप नं.'}</span>
                    <span>{isEn ? 'Time' : 'समय'}</span>
                  </div>
                  <div className="space-y-1">
                    {laps.map((lapTime, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800/60 font-mono"
                      >
                        <span className="text-slate-400 font-bold">Lap {laps.length - idx}</span>
                        <span className="text-white font-black">{formatStopwatch(lapTime)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isEn ? 'Audio signals automatically alert on zero' : '0 पर ऑटोमैटिक साउंड अलर्ट बजेगा'}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            {isEn ? 'Done / Hide' : 'पूर्ण / बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
};
