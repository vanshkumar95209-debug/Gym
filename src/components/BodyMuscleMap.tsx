import React, { useState } from 'react';
import { MuscleGroup, AppLanguage } from '../types';
import { RotateCw, Sparkles } from 'lucide-react';

interface BodyMuscleMapProps {
  selectedMuscle: MuscleGroup | 'all';
  onSelectMuscle: (muscle: MuscleGroup | 'all') => void;
  language?: AppLanguage;
}

export const BodyMuscleMap: React.FC<BodyMuscleMapProps> = ({
  selectedMuscle,
  onSelectMuscle,
  language = 'en'
}) => {
  const isEn = language === 'en';
  const [view, setView] = useState<'front' | 'back'>('front');

  const isSelected = (m: MuscleGroup) => selectedMuscle === m;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
      {/* Header with Title and Front/Back View Flip Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-500/10 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h3 className="font-bold text-white text-sm sm:text-base">
            {isEn ? 'Select Target Muscle' : 'टारगेट मांसपेशी चुनें'}
          </h3>
        </div>

        {/* Flip View Toggle */}
        <button
          onClick={() => setView(v => v === 'front' ? 'back' : 'front')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer transition shadow-sm"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>
            {view === 'front' 
              ? (isEn ? 'Front View' : 'सामने का दृश्य') 
              : (isEn ? 'Back View' : 'पीछे का दृश्य')}
          </span>
        </button>
      </div>

      {/* Anatomy Visual Canvas + Quick Selection Chips */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* SVG Interactive Body Canvas (takes 5 cols on desktop) */}
        <div className="md:col-span-5 flex justify-center bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <svg viewBox="0 0 240 320" className="w-48 sm:w-56 h-auto filter drop-shadow-md select-none">
            {/* Base Mannequin Silhouette Outline */}
            {/* Head */}
            <circle cx="120" cy="35" r="16" fill="#334155" />
            {/* Neck */}
            <rect x="115" y="48" width="10" height="12" fill="#334155" />

            {view === 'front' ? (
              // ================= FRONT VIEW =================
              <g>
                {/* CHEST / PECTORALS (Clickable) */}
                <g 
                  onClick={() => onSelectMuscle(isSelected('chest') ? 'all' : 'chest')}
                  className="cursor-pointer group"
                >
                  <title>Chest / छाती (Pectoralis)</title>
                  {/* Left Pec */}
                  <path
                    d="M 118 68 Q 116 100 88 100 Q 82 82 92 72 Q 106 66 118 68 Z"
                    fill={isSelected('chest') ? '#f97316' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-orange-400"
                    stroke={isSelected('chest') ? '#fbbf24' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  {/* Right Pec */}
                  <path
                    d="M 122 68 Q 124 100 152 100 Q 158 82 148 72 Q 134 66 122 68 Z"
                    fill={isSelected('chest') ? '#f97316' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-orange-400"
                    stroke={isSelected('chest') ? '#fbbf24' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  {/* Chest Center Label */}
                  <text x="120" y="88" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    CHEST
                  </text>
                </g>

                {/* SHOULDERS / ANTERIOR DELTOIDS */}
                <g 
                  onClick={() => onSelectMuscle(isSelected('shoulders') ? 'all' : 'shoulders')}
                  className="cursor-pointer group"
                >
                  <title>Shoulders / कंधे (Deltoids)</title>
                  {/* Left Deltoid */}
                  <path
                    d="M 90 68 Q 70 75 72 96 Q 84 94 88 78 Z"
                    fill={isSelected('shoulders') ? '#a855f7' : '#334155'}
                    className="transition-all duration-200 group-hover:fill-purple-400"
                    stroke={isSelected('shoulders') ? '#d8b4fe' : '#475569'}
                    strokeWidth="1.5"
                  />
                  {/* Right Deltoid */}
                  <path
                    d="M 150 68 Q 170 75 168 96 Q 156 94 152 78 Z"
                    fill={isSelected('shoulders') ? '#a855f7' : '#334155'}
                    className="transition-all duration-200 group-hover:fill-purple-400"
                    stroke={isSelected('shoulders') ? '#d8b4fe' : '#475569'}
                    strokeWidth="1.5"
                  />
                </g>

                {/* BICEPS (Clickable) */}
                <g 
                  onClick={() => onSelectMuscle(isSelected('biceps') ? 'all' : 'biceps')}
                  className="cursor-pointer group"
                >
                  <title>Biceps / डोले</title>
                  {/* Left Bicep */}
                  <path
                    d="M 72 98 Q 66 120 72 135 Q 80 135 84 112 Q 85 96 72 98 Z"
                    fill={isSelected('biceps') ? '#10b981' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-emerald-400"
                    stroke={isSelected('biceps') ? '#6ee7b7' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  {/* Right Bicep */}
                  <path
                    d="M 168 98 Q 174 120 168 135 Q 160 135 156 112 Q 155 96 168 98 Z"
                    fill={isSelected('biceps') ? '#10b981' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-emerald-400"
                    stroke={isSelected('biceps') ? '#6ee7b7' : '#64748b'}
                    strokeWidth="1.5"
                  />
                </g>

                {/* FOREARMS */}
                <path d="M 69 138 L 62 178 L 74 178 L 79 138 Z" fill="#334155" />
                <path d="M 171 138 L 178 178 L 166 178 L 161 138 Z" fill="#334155" />

                {/* ABS / CORE (Six Pack + Obliques) */}
                <g 
                  onClick={() => onSelectMuscle(isSelected('abs') ? 'all' : 'abs')}
                  className="cursor-pointer group"
                >
                  <title>Abs & Core / पेट व कोर</title>
                  <rect
                    x="100"
                    y="105"
                    width="40"
                    height="50"
                    rx="4"
                    fill={isSelected('abs') ? '#eab308' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-yellow-400"
                    stroke={isSelected('abs') ? '#fde047' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  {/* Six pack subdivisions */}
                  <line x1="120" y1="105" x2="120" y2="155" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="103" y1="120" x2="137" y2="120" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="103" y1="135" x2="137" y2="135" stroke="#1e293b" strokeWidth="1.5" />
                  <text x="120" y="148" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    ABS
                  </text>
                </g>

                {/* PELVIS / HIPS */}
                <path d="M 98 158 Q 120 168 142 158 L 138 178 Q 120 185 102 178 Z" fill="#334155" />

                {/* QUADRICEPS (LEGS) */}
                <g 
                  onClick={() => onSelectMuscle(isSelected('legs') ? 'all' : 'legs')}
                  className="cursor-pointer group"
                >
                  <title>Legs / जांघें (Quadriceps)</title>
                  {/* Left Quad */}
                  <path
                    d="M 102 182 Q 95 220 105 240 Q 118 240 118 200 Q 118 182 102 182 Z"
                    fill={isSelected('legs') ? '#f43f5e' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-rose-400"
                    stroke={isSelected('legs') ? '#fda4af' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  {/* Right Quad */}
                  <path
                    d="M 138 182 Q 145 220 135 240 Q 122 240 122 200 Q 122 182 138 182 Z"
                    fill={isSelected('legs') ? '#f43f5e' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-rose-400"
                    stroke={isSelected('legs') ? '#fda4af' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  <text x="120" y="215" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    LEGS
                  </text>
                  {/* Calves & Shins */}
                  <path d="M 103 245 L 100 295 L 112 295 L 115 245 Z" fill="#334155" />
                  <path d="M 137 245 L 140 295 L 128 295 L 125 245 Z" fill="#334155" />
                </g>
              </g>
            ) : (
              // ================= BACK VIEW =================
              <g>
                {/* BACK / LATS & TRAPS (Clickable) */}
                <g 
                  onClick={() => onSelectMuscle(isSelected('back') ? 'all' : 'back')}
                  className="cursor-pointer group"
                >
                  <title>Back / पीठ (Lats & Trapezius)</title>
                  {/* Traps & Upper Back */}
                  <path
                    d="M 112 55 L 120 48 L 128 55 L 148 70 L 120 100 L 92 70 Z"
                    fill={isSelected('back') ? '#6366f1' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-indigo-400"
                    stroke={isSelected('back') ? '#a5b4fc' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  {/* Left & Right Latissimus Dorsi (Wings) */}
                  <path
                    d="M 90 75 Q 82 110 102 145 L 120 148 L 138 145 Q 158 110 150 75 L 120 105 Z"
                    fill={isSelected('back') ? '#6366f1' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-indigo-400"
                    stroke={isSelected('back') ? '#a5b4fc' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  <text x="120" y="125" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    BACK
                  </text>
                </g>

                {/* TRICEPS (Clickable) */}
                <g 
                  onClick={() => onSelectMuscle(isSelected('triceps') ? 'all' : 'triceps')}
                  className="cursor-pointer group"
                >
                  <title>Triceps / ट्राइसेप्स</title>
                  {/* Left Tricep */}
                  <path
                    d="M 72 98 Q 66 120 74 135 Q 84 135 84 112 Q 85 96 72 98 Z"
                    fill={isSelected('triceps') ? '#06b6d4' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-cyan-400"
                    stroke={isSelected('triceps') ? '#67e8f9' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  {/* Right Tricep */}
                  <path
                    d="M 168 98 Q 174 120 166 135 Q 156 135 156 112 Q 155 96 168 98 Z"
                    fill={isSelected('triceps') ? '#06b6d4' : '#475569'}
                    className="transition-all duration-200 group-hover:fill-cyan-400"
                    stroke={isSelected('triceps') ? '#67e8f9' : '#64748b'}
                    strokeWidth="1.5"
                  />
                </g>

                {/* GLUTES & HAMSTRINGS (LEGS BACK) */}
                <g 
                  onClick={() => onSelectMuscle(isSelected('legs') ? 'all' : 'legs')}
                  className="cursor-pointer group"
                >
                  <title>Glutes & Hamstrings / हैमस्ट्रिंग्स</title>
                  {/* Glutes */}
                  <ellipse cx="110" cy="170" rx="14" ry="12" fill={isSelected('legs') ? '#f43f5e' : '#334155'} />
                  <ellipse cx="130" cy="170" rx="14" ry="12" fill={isSelected('legs') ? '#f43f5e' : '#334155'} />
                  {/* Hamstrings */}
                  <rect x="100" y="185" width="18" height="50" rx="4" fill={isSelected('legs') ? '#f43f5e' : '#475569'} />
                  <rect x="122" y="185" width="18" height="50" rx="4" fill={isSelected('legs') ? '#f43f5e' : '#475569'} />
                  {/* Calves (Diamond shape) */}
                  <polygon points="98,245 92,270 108,285 114,265" fill={isSelected('legs') ? '#f43f5e' : '#334155'} />
                  <polygon points="142,245 148,270 132,285 126,265" fill={isSelected('legs') ? '#f43f5e' : '#334155'} />
                  <text x="120" y="215" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    HAMSTRINGS
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Quick Muscle Selector Chips & Description (takes 7 cols on desktop) */}
        <div className="md:col-span-7 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              त्वरित चयन (Quick Muscle Filters):
            </span>
            {selectedMuscle !== 'all' && (
              <button
                onClick={() => onSelectMuscle('all')}
                className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer font-medium"
              >
                {isEn ? 'Clear Filter (Show All)' : 'फिल्टर हटाएं (सभी देखें)'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'chest', labelEn: 'Chest', labelHi: 'छाती', sub: 'Pectorals', color: 'border-orange-500/40 text-orange-400 bg-orange-500/10' },
              { id: 'back', labelEn: 'Back', labelHi: 'पीठ', sub: 'Lats & Traps', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
              { id: 'biceps', labelEn: 'Biceps', labelHi: 'बाइसेप्स', sub: 'Arms Peak', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
              { id: 'triceps', labelEn: 'Triceps', labelHi: 'ट्राइसेप्स', sub: 'Horseshoe', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
              { id: 'shoulders', labelEn: 'Shoulders', labelHi: 'कंधे', sub: '3D Deltoids', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
              { id: 'legs', labelEn: 'Legs', labelHi: 'पैर', sub: 'Quads & Calves', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
              { id: 'abs', labelEn: 'Abs & Core', labelHi: 'एब्स व कोर', sub: 'Six Pack', color: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' },
            ].map(item => {
              const active = selectedMuscle === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMuscle(active ? 'all' : (item.id as MuscleGroup))}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    active
                      ? `${item.color} ring-2 ring-amber-400/50 shadow-lg scale-[1.02]`
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm flex items-center justify-between">
                    <span>{isEn ? item.labelEn : item.labelHi}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Quick highlight banner if Chest or any muscle is selected */}
          {selectedMuscle !== 'all' && (
            <div className="mt-1 p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-300">
                {isEn 
                  ? `Filtering all ${selectedMuscle.toUpperCase()} exercises`
                  : `वर्तमान में ${selectedMuscle.toUpperCase()} की सभी एक्सरसाइज दिखाई जा रही हैं`}
              </span>
              <span className="text-[11px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold">
                {isEn ? 'Active Filter' : 'फिल्टर सक्रिय'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
