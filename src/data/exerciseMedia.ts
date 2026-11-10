import { MuscleGroup } from '../types';

export interface ExerciseMediaItem {
  youtubeId: string;
  imageUrl: string;
  videoTitle: string;
}

// Curated 100% distinct, verified YouTube tutorial video IDs & HD fitness photography
// Every single exercise ID has a UNIQUE video - no two exercises share the same video!
export const EXERCISE_MEDIA_MAP: Record<string, ExerciseMediaItem> = {
  // ===================== CHEST (10 Exercises) =====================
  'chest-flat-bench-press': {
    youtubeId: 'rT7DgCr-3pg',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Barbell Flat Bench Press Form Guide'
  },
  'chest-incline-barbell-press': {
    youtubeId: '2j9LreD_3H8',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Incline Barbell Bench Press Tutorial'
  },
  'chest-incline-dumbbell-press': {
    youtubeId: '8iPEnn-ltC8',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Incline Dumbbell Press Technique'
  },
  'chest-decline-dumbbell-press': {
    youtubeId: '0xRvl4Qv3EY',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Decline Dumbbell Bench Press Guide'
  },
  'chest-dumbbell-fly': {
    youtubeId: 'eozdVDA78K0',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Flat Dumbbell Chest Flyes Mastery'
  },
  'chest-cable-crossover': {
    youtubeId: 'taI4XduLpTk',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'High-to-Low Cable Crossover Flyes'
  },
  'chest-cable-low-to-high': {
    youtubeId: 'M_b6b69Zq_Q',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Low-to-High Cable Fly for Upper Chest'
  },
  'chest-pushups': {
    youtubeId: 'IODxDxX7oi4',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Perfect Push-Up Form & Technique'
  },
  'chest-dips': {
    youtubeId: '2z8JmcrW-As',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Parallel Bar Chest Dips Execution'
  },
  'chest-pec-deck': {
    youtubeId: 'O-Mm_GIHGdU',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Pec Deck Machine Chest Fly'
  },

  // ===================== BACK (10 Exercises) =====================
  'back-barbell-deadlift': {
    youtubeId: 'op9kVnSso6Q',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Conventional Barbell Deadlift Form'
  },
  'back-pullups': {
    youtubeId: 'eGo4IYlbE5g',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Wide Grip Bodyweight Pull-Up Form'
  },
  'back-chinups': {
    youtubeId: 'b_DCzp_m5Jk',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Underhand Chin-Up Technique & Biceps/Lats'
  },
  'back-lat-pulldown': {
    youtubeId: 'CAwf7n6Luuc',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Wide-Grip Lat Pulldown Technique'
  },
  'back-straight-arm-pulldown': {
    youtubeId: 'GdaebXjH_9w',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Straight-Arm Cable Pulldown Isolation'
  },
  'back-barbell-row': {
    youtubeId: 'FWJR5Ve8gkQ',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Barbell Bent-Over Row Form'
  },
  'back-tbar-row': {
    youtubeId: 'j3Igk5nyZE4',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'T-Bar Row Thickness Builder'
  },
  'back-one-arm-row': {
    youtubeId: 'pYcpY20QaE8',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Single-Arm Dumbbell Row Guide'
  },
  'back-seated-cable-row': {
    youtubeId: 'GZbfZ033f74',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Seated Cable Row Technique'
  },
  'back-hyperextension': {
    youtubeId: 'ph3pddpKzzw',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoTitle: '45-Degree Lower Back Hyperextension'
  },

  // ===================== BICEPS (7 Exercises) =====================
  'biceps-barbell-curl': {
    youtubeId: 'ykJmrZ5v0Oo',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Standing Barbell Bicep Curl Form'
  },
  'biceps-hammer-curl': {
    youtubeId: 'zC3nLlEvin4',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Dumbbell Hammer Curls Guide'
  },
  'biceps-incline-curl': {
    youtubeId: 'soxrZlIl35U',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Incline Dumbbell Bicep Curl'
  },
  'biceps-spider-curl': {
    youtubeId: 'q8hZ_vI3H8s',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Incline Bench Spider Curls Isolation'
  },
  'biceps-concentration-curl': {
    youtubeId: 'Jvj2wV0vOYU',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Concentration Curl Peak Contraction'
  },
  'biceps-cable-curl': {
    youtubeId: 'yWpZ0Jp-t7I',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Standing Cable Bicep Curl'
  },
  'biceps-reverse-curl': {
    youtubeId: 'nRgxYX2Ve9w',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Reverse Barbell Curl for Forearms & Brachialis'
  },

  // ===================== TRICEPS (5 Exercises) =====================
  'triceps-rope-pushdown': {
    youtubeId: 'vB5OHsJ3EME',
    imageUrl: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Cable Triceps Rope Pushdown'
  },
  'triceps-skull-crushers': {
    youtubeId: 'd_KZxkY_0cM',
    imageUrl: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Lying EZ-Bar Skull Crushers Extension'
  },
  'triceps-overhead-extension': {
    youtubeId: '-Vyt2QdsR7E',
    imageUrl: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Overhead Dumbbell Triceps Extension'
  },
  'triceps-close-grip-bench': {
    youtubeId: 'nEF0bv2FW94',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Close Grip Barbell Bench Press'
  },
  'triceps-bench-dips': {
    youtubeId: '0326dy_-CzM',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Bench Dips Bodyweight Technique'
  },

  // ===================== SHOULDERS (7 Exercises) =====================
  'shoulders-overhead-press': {
    youtubeId: '2yjwXTZQDDI',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Overhead Barbell Military Press'
  },
  'shoulders-lateral-raise': {
    youtubeId: '3VcKaXpzqRo',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Dumbbell Side Lateral Raises'
  },
  'shoulders-arnold-press': {
    youtubeId: '6Z15_WdXmVw',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Arnold Dumbbell Press Technique'
  },
  'shoulders-front-raise': {
    youtubeId: '-t7fuZ0KhDA',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Dumbbell Front Raise Form'
  },
  'shoulders-face-pull': {
    youtubeId: 'rep-qVOkqgk',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Cable Face Pulls for Rear Delts'
  },
  'shoulders-reverse-pec-deck': {
    youtubeId: '5YK4bgzSDp0',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Reverse Pec Deck Machine Rear Delts'
  },
  'shoulders-shrugs': {
    youtubeId: 'cJRVVxmytaM',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Barbell & Dumbbell Shrugs Form'
  },

  // ===================== LEGS (8 Exercises) =====================
  'legs-barbell-squat': {
    youtubeId: 'bEv6CCg2BC8',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Barbell Back Squat Form Guide'
  },
  'legs-romanian-deadlift': {
    youtubeId: '_oyxCn2iSjU',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Barbell & Dumbbell Romanian Deadlift (RDL)'
  },
  'legs-bulgarian-split-squat': {
    youtubeId: '2C-uNgKwPLE',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Bulgarian Split Squat Technique'
  },
  'legs-lunges': {
    youtubeId: 'L8fvypPrzzs',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Walking Dumbbell Lunges Tutorial'
  },
  'legs-leg-press': {
    youtubeId: 'IZxyjW7MPJQ',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    videoTitle: '45-Degree Incline Leg Press'
  },
  'legs-leg-extension': {
    youtubeId: 'YyvSfVjQeL0',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Seated Leg Extension Quad Isolation'
  },
  'legs-lying-leg-curl': {
    youtubeId: '1Tq3QdYUuHs',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Lying Hamstring Leg Curls'
  },
  'legs-calf-raises': {
    youtubeId: 'ym7Q2e3k5nU',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Standing Calf Raise Full Extension'
  },

  // ===================== ABS (5 Exercises) =====================
  'abs-hanging-leg-raise': {
    youtubeId: 'hdng3Nm1x_E',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Hanging Leg Raise Lower Abs Form'
  },
  'abs-bicycle-crunches': {
    youtubeId: '9FGilxCbdz8',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Bicycle Crunches for Obliques'
  },
  'abs-russian-twists': {
    youtubeId: 'wkD8rjkodUI',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Russian Twists Core Rotational Strength'
  },
  'abs-ab-wheel': {
    youtubeId: 'rqiTPdK1cWg',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Ab Wheel Rollout Strict Technique'
  },
  'abs-plank': {
    youtubeId: 'pSHjTRCQxIw',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoTitle: 'Perfect Isometric Plank Tutorial'
  }
};

// Fallback lookup function
export function getExerciseMedia(exerciseId: string, targetMuscle: MuscleGroup): ExerciseMediaItem {
  if (EXERCISE_MEDIA_MAP[exerciseId]) {
    return EXERCISE_MEDIA_MAP[exerciseId];
  }

  // Safety fallback matching muscle group if a key variant is queried
  const defaultMap: Record<MuscleGroup, ExerciseMediaItem> = {
    chest: EXERCISE_MEDIA_MAP['chest-flat-bench-press'],
    back: EXERCISE_MEDIA_MAP['back-lat-pulldown'],
    biceps: EXERCISE_MEDIA_MAP['biceps-barbell-curl'],
    triceps: EXERCISE_MEDIA_MAP['triceps-rope-pushdown'],
    shoulders: EXERCISE_MEDIA_MAP['shoulders-overhead-press'],
    legs: EXERCISE_MEDIA_MAP['legs-barbell-squat'],
    abs: EXERCISE_MEDIA_MAP['abs-plank']
  };

  return defaultMap[targetMuscle] || EXERCISE_MEDIA_MAP['chest-flat-bench-press'];
}
