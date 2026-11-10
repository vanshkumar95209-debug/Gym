import React, { useState } from 'react';
import { 
  X, 
  Play, 
  AlertTriangle, 
  Wind, 
  Target, 
  Compass, 
  Zap, 
  CheckCircle2, 
  Video 
} from 'lucide-react';
import { Exercise, AppLanguage } from '../types';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import { getExerciseGuide } from '../data/exerciseGuides';
import { TRANSLATIONS } from '../utils/translations';

interface ExerciseGuideModalProps {
  exercise: Exercise;
  onClose: () => void;
  onStartWorkout: (exercise: Exercise) => void;
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
  const [activeTab, setActiveTab] = useState<'all' | 'position' | 'execution' | 'breathing'>('all');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl relative">
        
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

        {/* Real Demonstration: Real YouTube Video & HD Form Photo */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <ExerciseVideoPlayer
            exerciseId={exercise.id}
            targetMuscle={exercise.targetMuscle}
            exerciseName={exercise.name}
            autoPlayVideo={false}
            language={language}
          />
        </div>

        {/* Section Tabs for quick navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {isEn ? '📖 Full Guide' : '📖 पूरी गाइड'}
          </button>
          <button
            onClick={() => setActiveTab('position')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
              activeTab === 'position'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {isEn ? '📍 1. Setup & Stance' : '📍 1. सही पोजीशन'}
          </button>
          <button
            onClick={() => setActiveTab('execution')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
              activeTab === 'execution'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {isEn ? '🎯 2. How to Perform' : '🎯 2. कैसे करें'}
          </button>
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
              activeTab === 'breathing'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {isEn ? '🫁 3. Breathing' : '🫁 3. सांस का नियम'}
          </button>
        </div>

        {/* Form Guide Details (Consistent single language!) */}
        <div className="space-y-3.5 text-xs sm:text-sm">
          {/* 1. STARTING POSITION & SETUP */}
          {(activeTab === 'all' || activeTab === 'position') && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm border-b border-slate-800/80 pb-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>{guide.positionSetup.heading}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="font-bold text-slate-200 block mb-0.5">
                    {isEn ? '🧘 Body Stance / Bench:' : '🧘 शरीर / बैठने का तरीका:'}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{guide.positionSetup.stance}</span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="font-bold text-slate-200 block mb-0.5">
                    {isEn ? '✋ Grip & Hand Placement:' : '✋ ग्रिप और हाथों की पकड़:'}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{guide.positionSetup.grip}</span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="font-bold text-slate-200 block mb-0.5">
                    {isEn ? '🛡️ Spine & Scapulae Posture:' : '🛡️ पीठ व छाती का पोश्चर:'}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{guide.positionSetup.posture}</span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="font-bold text-slate-200 block mb-0.5">
                    {isEn ? '👟 Feet & Foundation:' : '👟 पैर व संतुलन:'}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{guide.positionSetup.feet}</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. HOW TO PERFORM / EXECUTION STEPS */}
          {(activeTab === 'all' || activeTab === 'execution') && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm border-b border-slate-800/80 pb-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span>{guide.executionSteps.heading}</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Step 1 Negative */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-black flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    ⬇️
                  </span>
                  <div>
                    <span className="font-bold text-slate-200 block">
                      {isEn ? 'Phase 1: Lowering (Eccentric Stretch)' : 'कदम 1: नीचे लाना (खिंचाव)'}
                    </span>
                    <span className="text-slate-300 leading-relaxed">{guide.executionSteps.step1Negative}</span>
                  </div>
                </div>

                {/* Step 2 Positive */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    ⬆️
                  </span>
                  <div>
                    <span className="font-bold text-slate-200 block">
                      {isEn ? 'Phase 2: Lifting / Pressing (Concentric Squeeze)' : 'कदम 2: ऊपर उठाना / धकेलना (संकुचन)'}
                    </span>
                    <span className="text-slate-300 leading-relaxed">{guide.executionSteps.step2Positive}</span>
                  </div>
                </div>

                {/* Tempo */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-300 text-[11px] font-medium flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>{isEn ? 'Cadence (Tempo):' : 'गति (Tempo):'}</strong> {guide.executionSteps.tempoGuide}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. BREATHING TECHNIQUE */}
          {(activeTab === 'all' || activeTab === 'breathing') && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs sm:text-sm border-b border-slate-800/80 pb-1.5">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>{guide.breathing.heading}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                  <span className="font-bold block text-cyan-400 mb-0.5">
                    {isEn ? '🟢 Inhale (Breathe In):' : '🟢 सांस अंदर लें:'}
                  </span>
                  <span>{guide.breathing.inhale}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200">
                  <span className="font-bold block text-rose-400 mb-0.5">
                    {isEn ? '🔴 Exhale (Breathe Out):' : '🔴 सांस बाहर छोड़ें:'}
                  </span>
                  <span>{guide.breathing.exhale}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1">
                💡 {guide.breathing.tip}
              </p>
            </div>
          )}

          {/* 4. MISTAKES TO AVOID */}
          {activeTab === 'all' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm border-b border-slate-800/80 pb-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{guide.mistakes.heading}</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300">
                {guide.mistakes.items.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>

              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                🔥 <strong>{guide.proTip.heading}:</strong> {guide.proTip.text}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm cursor-pointer transition text-center"
          >
            {isEn ? 'Back' : 'वापस जाएं'}
          </button>

          <button
            onClick={() => {
              onClose();
              onStartWorkout(exercise);
            }}
            className="flex-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isEn ? 'Start Workout' : 'कसरत शुरू करें'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
