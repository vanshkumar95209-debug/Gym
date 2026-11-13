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
  todayWorkoutLogs?: any[];
}

export const WorkoutExplorer: React.FC<WorkoutExplorerProps> = ({
  onLogWorkoutFromExplorer,
  favorites,
  onToggleFavorite,
  targetMuscleFilter = 'chest',
  language = 'en',
  onOpenCustomTimer,
  todayWorkoutLogs = []
}) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language];
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>(targetMuscleFilter);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [favoriteMuscleFilter, setFavoriteMuscleFilter] = useState<MuscleGroup | 'all'>('all');
  
  // Modals: First show Video & Form Guide, then start active workout
  const [guideExercise, setGuideExercise] = useState<Exercise | null>(null);
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);

  const favoriteExercises = useMemo(() => {
    return EXERCISES.filter(ex => favorites.includes(ex.id));
  }, [favorites]);

  const favoriteCountsByMuscle = useMemo(() => {
    const counts: Record<MuscleGroup, number> = {
      chest: 0,
      back: 0,
      biceps: 0,
      triceps: 0,
      shoulders: 0,
      legs: 0,
      abs: 0,
    };
    for (const ex of favoriteExercises) {
      counts[ex.targetMuscle] = (counts[ex.targetMuscle] || 0) + 1;
    }
    return counts;
  }, [favoriteExercises]);

  const filteredExercises = useMemo(() => {
    if (showFavoritesOnly) {
      if (favoriteMuscleFilter === 'all') return favoriteExercises;
      return favoriteExercises.filter(ex => ex.targetMuscle === favoriteMuscleFilter);
    }
    return EXERCISES.filter(ex => {
      if (selectedMuscle !== 'all' && ex.targetMuscle !== selectedMuscle) return false;
      if (selectedEquipment === 'No Equipment') {
        if (ex.equipment !== 'No Equipment' && ex.equipment !== 'Bodyweight' && !ex.isNoEquipment) return false;
      } else if (selectedEquipment !== 'all') {
        if (ex.equipment !== selectedEquipment) return false;
      }
      return true;
    });
  }, [selectedMuscle, selectedEquipment, showFavoritesOnly, favoriteExercises, favoriteMuscleFilter]);

  const groupedFavoriteSections = useMemo(() => {
    if (!showFavoritesOnly) return [];
    const muscles = MUSCLE_GROUPS_META.filter(m => m.id !== 'all');
    return muscles
      .filter(m => favoriteMuscleFilter === 'all' || favoriteMuscleFilter === m.id)
      .map(m => ({
        muscle: m,
        items: favoriteExercises.filter(ex => ex.targetMuscle === m.id),
      }))
      .filter(section => section.items.length > 0);
  }, [showFavoritesOnly, favoriteMuscleFilter, favoriteExercises]);

  const [activeTimerSettings, setActiveTimerSettings] = useState<{ sets: number; workoutTime: number; restTime: number } | null>(null);

  const currentMuscleMeta = MUSCLE_GROUPS_META.find(m => m.id === selectedMuscle);
  const currentFavMuscleMeta = MUSCLE_GROUPS_META.find(m => m.id === favoriteMuscleFilter);

  const handleOpenExerciseGuide = (exercise: Exercise) => {
    setGuideExercise(exercise);
  };

  const handleStartWorkoutFromGuide = (
    exercise: Exercise,
    timerSettings?: { sets: number; workoutTime: number; restTime: number }
  ) => {
    setGuideExercise(null);
    setActiveTimerSettings(timerSettings || null);
    setActiveExerciseModal(exercise);
  };

  const renderExerciseCard = (ex: Exercise) => {
    const isFav = favorites.includes(ex.id);
    return (
      <div
        key={ex.id}
        onClick={() => handleOpenExerciseGuide(ex)}
        className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl overflow-hidden flex flex-col justify-between transition group shadow-md cursor-pointer"
      >
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
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-slate-950/80 backdrop-blur-md text-slate-400 hover:text-amber-400 hover:bg-slate-900 border border-slate-700/80'
            }`}
          >
            <Star className={`w-4 h-4 ${isFav ? 'fill-slate-950 text-slate-950' : 'fill-none'}`} />
          </button>
        </div>

        <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
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
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenExerciseGuide(ex);
            }}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isEn ? 'Start' : 'शुरू करें'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Interactive Body Muscle Map (Front & Back) */}
      <BodyMuscleMap
        selectedMuscle={showFavoritesOnly ? favoriteMuscleFilter : selectedMuscle}
        onSelectMuscle={(muscle) => {
          if (showFavoritesOnly) {
            setFavoriteMuscleFilter(muscle);
          } else {
            setSelectedMuscle(muscle);
          }
        }}
        language={language}
      />

      {/* Clean Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-black text-white text-sm sm:text-base tracking-tight">
            {showFavoritesOnly 
              ? (favoriteMuscleFilter === 'all'
                  ? (isEn ? `Favorites (${favoriteExercises.length})` : `पसंदीदा (${favoriteExercises.length})`)
                  : (isEn
                      ? `Favorites · ${currentFavMuscleMeta?.name} (${filteredExercises.length})`
                      : `पसंदीदा · ${currentFavMuscleMeta?.hindiName} (${filteredExercises.length})`))
              : isEn 
              ? (currentMuscleMeta ? `${currentMuscleMeta.name} (${filteredExercises.length})` : `All Exercises (${filteredExercises.length})`)
              : (currentMuscleMeta ? `${currentMuscleMeta.hindiName} (${filteredExercises.length})` : `सभी कसरतें (${filteredExercises.length})`)}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setShowFavoritesOnly(prev => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 active:scale-95 ${
                showFavoritesOnly
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-slate-950 text-slate-950' : 'fill-amber-400 text-amber-400'}`} />
              <span>{isEn ? `Favorites (${favoriteExercises.length})` : `पसंदीदा (${favoriteExercises.length})`}</span>
            </button>

            <button
              onClick={() => {
                setShowFavoritesOnly(false);
                setSelectedEquipment(selectedEquipment === 'No Equipment' ? 'all' : 'No Equipment');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 active:scale-95 ${
                selectedEquipment === 'No Equipment' && !showFavoritesOnly
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
              }`}
            >
              <span>{isEn ? 'No Equipment' : 'बिना उपकरण'}</span>
            </button>

            {onOpenCustomTimer && (
              <button
                onClick={onOpenCustomTimer}
                className="px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 active:scale-95 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/30"
              >
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Timer' : 'टाइमर'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Favorites Body Part Tabs OR Equipment Filter */}
        {showFavoritesOnly ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] pt-1.5 border-t border-slate-800/80">
            {MUSCLE_GROUPS_META.map(m => {
              const count = m.id === 'all'
                ? favoriteExercises.length
                : (favoriteCountsByMuscle[m.id as MuscleGroup] || 0);
              const active = favoriteMuscleFilter === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setFavoriteMuscleFilter(m.id as MuscleGroup | 'all')}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition flex items-center gap-1.5 ${
                    active
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : count > 0
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold border border-amber-500/20'
                      : 'bg-slate-800/60 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span>{isEn ? m.name : m.hindiName.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-amber-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] pt-1 border-t border-slate-800/80">
            {(['all', 'No Equipment', 'Barbell', 'Dumbbell', 'Cables', 'Machine', 'Bodyweight'] as const).map(eq => (
              <button
                key={eq}
                onClick={() => setSelectedEquipment(eq)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition ${
                  selectedEquipment === eq
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {eq === 'all' 
                  ? (isEn ? 'All' : 'सभी') 
                  : eq === 'No Equipment' 
                  ? (isEn ? 'No Equipment' : 'बिना उपकरण') 
                  : eq}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercises Grid — Grouped by Body Part in Favorites Mode, Flat Grid Otherwise */}
      {showFavoritesOnly ? (
        groupedFavoriteSections.length > 0 && (
          <div className="space-y-6">
            {groupedFavoriteSections.map(section => (
              <div key={section.muscle.id} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-5 rounded-full bg-gradient-to-b ${section.muscle.color}`} />
                    <h4 className="font-black text-white text-sm sm:text-base">
                      {isEn ? section.muscle.name : section.muscle.hindiName}
                    </h4>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                      {section.items.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {section.items.map(renderExerciseCard)}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredExercises.map(renderExerciseCard)}
        </div>
      )}

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Star className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
          <h3 className="font-bold text-white text-sm">
            {showFavoritesOnly 
              ? (favoriteMuscleFilter !== 'all'
                  ? (isEn ? `No ${currentFavMuscleMeta?.name} Favorites Yet` : `${currentFavMuscleMeta?.hindiName} में कोई पसंदीदा कसरत नहीं`)
                  : (isEn ? 'No Favorites Yet' : 'कोई पसंदीदा कसरत नहीं'))
              : (isEn ? 'No Exercises Found' : 'कोई कसरत नहीं मिली')}
          </h3>
          {showFavoritesOnly && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {favoriteMuscleFilter !== 'all' && favoriteExercises.length > 0 && (
                <button
                  onClick={() => setFavoriteMuscleFilter('all')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-slate-950 transition cursor-pointer"
                >
                  {isEn ? 'All Favorites' : 'सभी पसंदीदा'}
                </button>
              )}
              <button
                onClick={() => {
                  if (favoriteMuscleFilter !== 'all') {
                    setSelectedMuscle(favoriteMuscleFilter);
                  }
                  setShowFavoritesOnly(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
              >
                {favoriteMuscleFilter !== 'all'
                  ? (isEn ? `Explore ${currentFavMuscleMeta?.name}` : `${currentFavMuscleMeta?.name} देखें`)
                  : (isEn ? 'Show All' : 'सभी देखें')}
              </button>
            </div>
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

      {/* Active Workout Modal with Real Video Demo and Timer */}
      {activeExerciseModal && (
        <ActiveWorkoutModal
          exercise={activeExerciseModal}
          onClose={() => {
            setActiveExerciseModal(null);
            setActiveTimerSettings(null);
          }}
          onFinishWorkout={(ex, sets) => {
            onLogWorkoutFromExplorer(ex, sets);
            setActiveExerciseModal(null);
            setActiveTimerSettings(null);
          }}
          language={language}
          initialTimerSettings={activeTimerSettings}
        />
      )}
    </div>
  );
};
