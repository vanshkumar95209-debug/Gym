import React, { useState, useMemo } from 'react';
import { Play, Info, Dumbbell, Star, Sparkles, ChevronRight, Video, Timer } from 'lucide-react';
import { Exercise, MuscleGroup, EquipmentType, AppLanguage } from '../types';
import { EXERCISES, MUSCLE_GROUPS_META } from '../data/exercises';
import { BodyMuscleMap } from './BodyMuscleMap';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import { ExerciseGuideModal } from './ExerciseGuideModal';
import { ActiveWorkoutModal } from './ActiveWorkoutModal';
import { TRANSLATIONS } from '../utils/translations';
import { playFavoriteStarSound } from '../utils/audio';

interface WorkoutExplorerProps {
  onLogWorkoutFromExplorer: (exercise: Exercise, sets: any[]) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  targetMuscleFilter?: MuscleGroup | 'all';
  language?: AppLanguage;
  onOpenCustomTimer?: () => void;
}

export const WorkoutExplorer: React.FC<WorkoutExplorerProps> = ({
  onLogWorkoutFromExplorer,
  favorites,
  onToggleFavorite,
  targetMuscleFilter = 'chest',
  language = 'en',
  onOpenCustomTimer
}) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language];
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>(targetMuscleFilter);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  
  // Modals: First show Video & Form Guide, then start active workout
  const [guideExercise, setGuideExercise] = useState<Exercise | null>(null);
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(ex => {
      // Favorites filter
      if (showFavoritesOnly) {
        if (!favorites.includes(ex.id)) return false;
      }
      if (selectedMuscle !== 'all' && ex.targetMuscle !== selectedMuscle) return false;
      if (selectedEquipment === 'No Equipment') {
        if (ex.equipment !== 'No Equipment' && ex.equipment !== 'Bodyweight' && !ex.isNoEquipment) return false;
      } else if (selectedEquipment !== 'all') {
        if (ex.equipment !== selectedEquipment) return false;
      }
      return true;
    });
  }, [selectedMuscle, selectedEquipment, showFavoritesOnly, favorites]);

  const currentMuscleMeta = MUSCLE_GROUPS_META.find(m => m.id === selectedMuscle);

  const handleOpenExerciseGuide = (exercise: Exercise) => {
    setGuideExercise(exercise);
  };

  const handleStartWorkoutFromGuide = (exercise: Exercise) => {
    setGuideExercise(null);
    setActiveExerciseModal(exercise);
  };

  return (
    <div className="space-y-5">
      {/* Interactive Body Muscle Map (Front & Back) */}
      <BodyMuscleMap
        selectedMuscle={selectedMuscle}
        onSelectMuscle={setSelectedMuscle}
        language={language}
      />

      {/* Clean Muscle Selector & Equipment Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
        {/* Header with Active Muscle indicator & count */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-black text-white text-sm sm:text-base tracking-tight">
              {showFavoritesOnly 
                ? (isEn ? '⭐ Starred Favorite Exercises' : '⭐ पसंदीदा कसरतें')
                : isEn 
                ? (currentMuscleMeta ? `${currentMuscleMeta.name} Exercises` : 'All Exercises')
                : (currentMuscleMeta ? `${currentMuscleMeta.hindiName} कसरतें` : 'सभी कसरतें')}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Prominent ⭐ Favorites Quick Filter Button */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                showFavoritesOnly
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/40 font-black shadow-amber-400/20'
                  : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
              title={isEn ? "Filter your starred favorites" : "पसंदीदा कसरतों को फिल्टर करें"}
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-slate-950 text-slate-950' : 'fill-amber-400 text-amber-400'}`} />
              <span>{isEn ? `Favorites (${favorites.length})` : `पसंदीदा (${favorites.length})`}</span>
            </button>

            {/* Prominent No Equipment Quick Button */}
            <button
              onClick={() => {
                setShowFavoritesOnly(false);
                setSelectedEquipment(selectedEquipment === 'No Equipment' ? 'all' : 'No Equipment');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                selectedEquipment === 'No Equipment' && !showFavoritesOnly
                  ? 'bg-emerald-400 text-slate-950 font-black'
                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
              }`}
            >
              <span>🏠</span>
              <span>{isEn ? 'No Equipment' : 'बिना उपकरण'}</span>
            </button>

            {/* Quick Custom Timer Shortcut Button */}
            {onOpenCustomTimer && (
              <button
                onClick={onOpenCustomTimer}
                className="px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 shadow-sm active:scale-95 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/30"
                title={isEn ? "Open Custom Gym Timer" : "कस्टम जिम टाइमर खोलें"}
              >
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Timer' : 'टाइमर'}</span>
              </button>
            )}

            <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 whitespace-nowrap">
              {filteredExercises.length} {isEn ? 'Exercises' : 'कसरतें'}
            </span>
          </div>
        </div>

        {/* Muscle Quick Tabs */}
        {!showFavoritesOnly && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MUSCLE_GROUPS_META.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedMuscle(g.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                  selectedMuscle === g.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {isEn ? g.name : g.hindiName}
              </button>
            ))}
          </div>
        )}

        {/* Equipment Filter */}
        {!showFavoritesOnly && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-400 border-t border-slate-800/80">
            <span className="text-slate-500 font-medium">
              {isEn ? 'Equipment:' : 'उपकरण:'}
            </span>
            {(['all', 'No Equipment', 'Barbell', 'Dumbbell', 'Cables', 'Machine', 'Bodyweight'] as const).map(eq => (
              <button
                key={eq}
                onClick={() => setSelectedEquipment(eq)}
                className={`px-2.5 py-0.5 rounded-md cursor-pointer transition ${
                  selectedEquipment === eq
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {eq === 'all' 
                  ? (isEn ? 'All' : 'सभी') 
                  : eq === 'No Equipment' 
                  ? (isEn ? '🏠 No Equipment' : '🏠 बिना उपकरण') 
                  : eq}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercises Grid with Real Photo Demonstrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredExercises.map(ex => {
          const isFav = favorites.includes(ex.id);

          return (
            <div
              key={ex.id}
              onClick={() => handleOpenExerciseGuide(ex)}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl overflow-hidden flex flex-col justify-between transition group shadow-md cursor-pointer hover:shadow-amber-500/5"
            >
              {/* Real HD Fitness Demonstration Photo with Play Overlay */}
              <div className="relative">
                <ExerciseVideoPlayer
                  exerciseId={ex.id}
                  targetMuscle={ex.targetMuscle}
                  exerciseName={ex.name}
                  isCompact={true}
                  language={language}
                />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(ex.id);
                    playFavoriteStarSound(!isFav);
                  }}
                  className={`absolute top-2.5 right-2.5 p-2 rounded-xl transition cursor-pointer shadow-lg z-10 flex items-center justify-center active:scale-90 ${
                    isFav
                      ? 'bg-amber-400 text-slate-950 shadow-amber-400/30 ring-2 ring-amber-300'
                      : 'bg-slate-950/80 backdrop-blur-md text-slate-400 hover:text-amber-400 hover:bg-slate-900 border border-slate-700/80'
                  }`}
                  title={isFav ? (isEn ? "Remove from Favorites" : "पसंदीदा से हटाएं") : (isEn ? "Add to Favorites" : "पसंदीदा में जोड़ें")}
                >
                  <Star className={`w-4 h-4 ${isFav ? 'fill-slate-950 text-slate-950' : 'fill-none'}`} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {ex.equipment}
                    </span>
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {ex.defaultSetsReps}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition leading-snug">
                    {isEn ? ex.name : ex.hindiName}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {isEn ? ex.description : ex.hindiDescription}
                  </p>

                  <div className="text-[11px] text-slate-300 mt-1.5">
                    🎯 <span className="text-slate-400">{isEn ? 'Target:' : 'टारगेट:'}</span> {ex.targetSubMuscle}
                  </div>
                </div>

                {/* Primary Button */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenExerciseGuide(ex);
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>
                      {isEn ? 'Watch Video Guide & Start' : 'वीडियो गाइड देखें व शुरू करें'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State when no exercises match */}
      {filteredExercises.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Star className="w-8 h-8 fill-amber-400/20 text-amber-400" />
          </div>
          <h3 className="font-extrabold text-white text-base">
            {showFavoritesOnly 
              ? (isEn ? 'No Favorite Exercises Yet' : 'अभी तक कोई पसंदीदा कसरत नहीं है')
              : (isEn ? 'No Exercises Found' : 'कोई कसरत नहीं मिली')}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {showFavoritesOnly 
              ? (isEn 
                  ? 'Click the ⭐ star button on any exercise card to save it here for fast 1-tap access!' 
                  : 'किसी भी कसरत कार्ड के ऊपर बने ⭐ स्टार बटन पर क्लिक करें। वो तुरंत आपके पसंदीदा में सेव हो जाएगी!')
              : (isEn ? 'Try changing your muscle or equipment filter.' : 'कृपया अपना मसल या उपकरण फिल्टर बदल कर देखें।')}
          </p>
          {showFavoritesOnly && (
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
            >
              {isEn ? 'Browse All Exercises' : 'सभी कसरतें देखें'}
            </button>
          )}
        </div>
      )}

      {/* Real Video & Form Guide Modal */}
      {guideExercise && (
        <ExerciseGuideModal
          exercise={guideExercise}
          onClose={() => setGuideExercise(null)}
          onStartWorkout={handleStartWorkoutFromGuide}
          language={language}
        />
      )}

      {/* Active Workout Modal with Real Video Demo */}
      {activeExerciseModal && (
        <ActiveWorkoutModal
          exercise={activeExerciseModal}
          onClose={() => setActiveExerciseModal(null)}
          onFinishWorkout={(ex, sets) => {
            onLogWorkoutFromExplorer(ex, sets);
            setActiveExerciseModal(null);
          }}
          language={language}
        />
      )}
    </div>
  );
};
