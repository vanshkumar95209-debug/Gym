import { DailyWorkoutLog, BodyMetrics, DailyDietLogItem, UserFitnessProfile, DailyWaterLog, AppLanguage, CustomDietPlan } from '../types';

const STORAGE_KEYS = {
  WORKOUT_LOGS: 'ironpulse_workout_logs_v1',
  BODY_METRICS: 'ironpulse_body_metrics_v1',
  DIET_LOGS: 'ironpulse_diet_logs_v1',
  USER_PROFILE: 'ironpulse_user_profile_v1',
  FAVORITES: 'ironpulse_favorite_exercises_v1',
  WATER_LOGS: 'ironpulse_water_logs_v1',
  LANGUAGE: 'ironpulse_app_language_v1',
  CUSTOM_DIET_PLANS: 'ironpulse_custom_diet_plans_v1'
};

const DEFAULT_PROFILE: UserFitnessProfile = {
  weightKg: 70,
  heightCm: 175,
  goal: 'muscle_gain',
  activityLevel: 'active',
  dailyProteinTargetGrams: 140,
  dailyWaterTargetLiters: 3.5,
  dailyReminderEnabled: false,
  reminderTime: '18:00'
};

// Seed initial historical logs so user can see immediate graphs, streaks, and previous weights
const SEED_WORKOUT_LOGS: DailyWorkoutLog[] = [
  {
    id: 'log-1',
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    title: 'Chest & Triceps Day (Heavy Pecs)',
    muscleGroups: ['chest', 'triceps'],
    durationMinutes: 55,
    exercises: [
      {
        exerciseId: 'chest-flat-bench-press',
        exerciseName: 'Barbell Flat Bench Press',
        targetMuscle: 'chest',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 50, reps: 12, completed: true },
          { id: 's2', setNumber: 2, weightKg: 60, reps: 10, completed: true },
          { id: 's3', setNumber: 3, weightKg: 65, reps: 8, completed: true },
          { id: 's4', setNumber: 4, weightKg: 70, reps: 6, completed: true }
        ],
        notes: 'Great pump! Hit 70kg for 6 clean reps.'
      },
      {
        exerciseId: 'chest-incline-dumbbell-press',
        exerciseName: 'Incline Dumbbell Press',
        targetMuscle: 'chest',
        sets: [
          { id: 's5', setNumber: 1, weightKg: 20, reps: 10, completed: true },
          { id: 's6', setNumber: 2, weightKg: 22.5, reps: 10, completed: true },
          { id: 's7', setNumber: 3, weightKg: 25, reps: 8, completed: true }
        ]
      },
      {
        exerciseId: 'triceps-rope-pushdown',
        exerciseName: 'Cable Tricep Rope Pushdown',
        targetMuscle: 'triceps',
        sets: [
          { id: 's8', setNumber: 1, weightKg: 25, reps: 15, completed: true },
          { id: 's9', setNumber: 2, weightKg: 30, reps: 12, completed: true }
        ]
      }
    ],
    notes: 'Solid chest workout, good energy after pre-workout meal.'
  },
  {
    id: 'log-2',
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    title: 'Back & Biceps Day (V-Taper)',
    muscleGroups: ['back', 'biceps'],
    durationMinutes: 60,
    exercises: [
      {
        exerciseId: 'back-lat-pulldown',
        exerciseName: 'Wide-Grip Lat Pulldown',
        targetMuscle: 'back',
        sets: [
          { id: 's10', setNumber: 1, weightKg: 45, reps: 12, completed: true },
          { id: 's11', setNumber: 2, weightKg: 55, reps: 10, completed: true },
          { id: 's12', setNumber: 3, weightKg: 60, reps: 8, completed: true }
        ]
      },
      {
        exerciseId: 'biceps-barbell-curl',
        exerciseName: 'Standing Barbell Bicep Curl',
        targetMuscle: 'biceps',
        sets: [
          { id: 's13', setNumber: 1, weightKg: 25, reps: 12, completed: true },
          { id: 's14', setNumber: 2, weightKg: 30, reps: 10, completed: true },
          { id: 's15', setNumber: 3, weightKg: 35, reps: 8, completed: true }
        ]
      }
    ],
    notes: 'Back felt pumped. Focus on slow negatives.'
  }
];

const SEED_BODY_METRICS: BodyMetrics[] = [
  {
    id: 'm-1',
    date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    weightKg: 68.5,
    chestInches: 38.0,
    bicepsInches: 13.5,
    waistInches: 32.0,
    notes: 'Starting baseline check'
  },
  {
    id: 'm-2',
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    weightKg: 69.2,
    chestInches: 38.4,
    bicepsInches: 13.7,
    waistInches: 31.8,
    notes: 'Weight increasing, waist controlled'
  },
  {
    id: 'm-3',
    date: new Date().toISOString().split('T')[0],
    weightKg: 70.0,
    chestInches: 39.0,
    bicepsInches: 14.0,
    waistInches: 31.5,
    notes: 'Reached 14 inch arms milestone!'
  }
];

export function getStoredWorkoutLogs(): DailyWorkoutLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(SEED_WORKOUT_LOGS));
    return SEED_WORKOUT_LOGS;
  } catch {
    return SEED_WORKOUT_LOGS;
  }
}

export function saveWorkoutLog(log: DailyWorkoutLog): DailyWorkoutLog[] {
  try {
    const logs = getStoredWorkoutLogs();
    const existingIndex = logs.findIndex(l => l.id === log.id);
    let updated: DailyWorkoutLog[];
    if (existingIndex >= 0) {
      updated = [...logs];
      updated[existingIndex] = log;
    } else {
      updated = [log, ...logs];
    }
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(updated));
    return updated;
  } catch {
    return [log];
  }
}

export function deleteWorkoutLog(id: string): DailyWorkoutLog[] {
  try {
    const logs = getStoredWorkoutLogs().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs));
    return logs;
  } catch {
    return [];
  }
}

export function getStoredBodyMetrics(): BodyMetrics[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BODY_METRICS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.BODY_METRICS, JSON.stringify(SEED_BODY_METRICS));
    return SEED_BODY_METRICS;
  } catch {
    return SEED_BODY_METRICS;
  }
}

export function saveBodyMetric(metric: BodyMetrics): BodyMetrics[] {
  try {
    const list = getStoredBodyMetrics();
    const updated = [...list.filter(m => m.date !== metric.date), metric].sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(STORAGE_KEYS.BODY_METRICS, JSON.stringify(updated));
    return updated;
  } catch {
    return [metric];
  }
}

export function getStoredDietLogs(dateStr?: string): DailyDietLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DIET_LOGS);
    const all = raw ? JSON.parse(raw) : [];
    if (!dateStr) return all;
    return all.filter((item: DailyDietLogItem & { date: string }) => item.date === dateStr);
  } catch {
    return [];
  }
}

export function addDietLogItem(item: Omit<DailyDietLogItem, 'id'>, dateStr: string): DailyDietLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DIET_LOGS);
    const all = raw ? JSON.parse(raw) : [];
    const newItem = {
      ...item,
      id: 'diet-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      date: dateStr
    };
    const updated = [newItem, ...all];
    localStorage.setItem(STORAGE_KEYS.DIET_LOGS, JSON.stringify(updated));
    return updated.filter(i => i.date === dateStr);
  } catch {
    return [];
  }
}

export function removeDietLogItem(id: string, dateStr: string): DailyDietLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DIET_LOGS);
    const all = raw ? JSON.parse(raw) : [];
    const updated = all.filter((i: { id: string }) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.DIET_LOGS, JSON.stringify(updated));
    return updated.filter((i: { date: string }) => i.date === dateStr);
  } catch {
    return [];
  }
}

export function getStoredProfile(): UserFitnessProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserFitnessProfile): UserFitnessProfile {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch {
    // Ignore
  }
  return profile;
}

export function getFavoriteExercises(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : ['chest-flat-bench-press', 'biceps-barbell-curl', 'back-lat-pulldown'];
  } catch {
    return ['chest-flat-bench-press'];
  }
}

export function toggleFavoriteExercise(exerciseId: string): string[] {
  try {
    const favs = getFavoriteExercises();
    const updated = favs.includes(exerciseId)
      ? favs.filter(id => id !== exerciseId)
      : [...favs, exerciseId];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

// ===================== WATER INTAKE TRACKER =====================
export function getStoredWaterLog(dateStr: string): DailyWaterLog {
  const defaultLog: DailyWaterLog = {
    date: dateStr,
    glassesDrank: 0,
    targetGlasses: 14, // 14 * 250ml = 3500ml (3.5L)
    completedSlots: []
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATER_LOGS);
    if (!raw) return defaultLog;
    const all = JSON.parse(raw);
    const found = all.find((item: DailyWaterLog) => item.date === dateStr);
    return found ? found : defaultLog;
  } catch {
    return defaultLog;
  }
}

export function saveStoredWaterLog(log: DailyWaterLog): DailyWaterLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATER_LOGS);
    const all: DailyWaterLog[] = raw ? JSON.parse(raw) : [];
    const index = all.findIndex(item => item.date === log.date);
    let updated: DailyWaterLog[];
    if (index >= 0) {
      updated = [...all];
      updated[index] = log;
    } else {
      updated = [log, ...all];
    }
    localStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  return log;
}

// ===================== LANGUAGE PREFERENCE =====================
export function getStoredLanguage(): AppLanguage {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (raw === 'hi' || raw === 'en') return raw;
    return 'en'; // Default to English as explicitly requested!
  } catch {
    return 'en';
  }
}

export function saveStoredLanguage(lang: AppLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch {
    // Ignore
  }
}

// ===================== CUSTOM DIET PLANS =====================
const SEED_CUSTOM_DIET_PLAN: CustomDietPlan = {
  id: 'custom-plan-sample-1',
  title: 'My High-Protein Bulking Plan',
  targetGoal: 'Bulking',
  createdAt: new Date().toISOString().split('T')[0],
  notes: 'Targeting 140g+ protein with clean carbs & healthy fats.',
  meals: [
    {
      id: 'meal-breakfast',
      name: 'Breakfast',
      time: '08:30 AM',
      foods: [
        { id: 'f-1', foodName: 'Oats with Milk & Honey', quantityGrams: 80, proteinGrams: 11.2, calories: 310, carbsGrams: 53.6, fatsGrams: 5.5 },
        { id: 'f-2', foodName: 'Peanut Butter (Natural)', quantityGrams: 32, proteinGrams: 8.0, calories: 190, carbsGrams: 6.4, fatsGrams: 16.0 },
        { id: 'f-3', foodName: 'Boiled Eggs / Paneer Cubes', quantityGrams: 100, proteinGrams: 14.0, calories: 160, carbsGrams: 2.0, fatsGrams: 11.0 }
      ]
    },
    {
      id: 'meal-lunch',
      name: 'Lunch',
      time: '01:30 PM',
      foods: [
        { id: 'f-4', foodName: 'Brown Rice / Whole Wheat Roti', quantityGrams: 150, proteinGrams: 6.0, calories: 220, carbsGrams: 45.0, fatsGrams: 2.0 },
        { id: 'f-5', foodName: 'Soya Chunks Curry', quantityGrams: 50, proteinGrams: 26.0, calories: 172, carbsGrams: 16.5, fatsGrams: 0.2 },
        { id: 'f-6', foodName: 'Fresh Curd (Dahi)', quantityGrams: 150, proteinGrams: 6.0, calories: 95, carbsGrams: 7.0, fatsGrams: 4.5 }
      ]
    },
    {
      id: 'meal-pre-workout',
      name: 'Pre-Workout Snack',
      time: '05:30 PM',
      foods: [
        { id: 'f-7', foodName: 'Banana (2 medium)', quantityGrams: 200, proteinGrams: 2.4, calories: 178, carbsGrams: 46.0, fatsGrams: 0.6 },
        { id: 'f-8', foodName: 'Black Coffee with Almonds', quantityGrams: 25, proteinGrams: 5.2, calories: 145, carbsGrams: 5.0, fatsGrams: 12.5 }
      ]
    },
    {
      id: 'meal-post-workout',
      name: 'Post-Workout Shake',
      time: '07:45 PM',
      foods: [
        { id: 'f-9', foodName: 'Whey Protein Isolate (1 scoop)', quantityGrams: 32, proteinGrams: 25.0, calories: 125, carbsGrams: 2.0, fatsGrams: 1.0 }
      ]
    },
    {
      id: 'meal-dinner',
      name: 'Dinner',
      time: '09:30 PM',
      foods: [
        { id: 'f-10', foodName: 'Paneer (Raw / Grilled)', quantityGrams: 120, proteinGrams: 22.0, calories: 318, carbsGrams: 4.5, fatsGrams: 24.0 },
        { id: 'f-11', foodName: 'Moong Dal Tadka with Steamed Veggies', quantityGrams: 200, proteinGrams: 14.0, calories: 230, carbsGrams: 36.0, fatsGrams: 3.5 }
      ]
    }
  ]
};

export function getStoredCustomDietPlans(): CustomDietPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_DIET_PLANS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_DIET_PLANS, JSON.stringify([SEED_CUSTOM_DIET_PLAN]));
    return [SEED_CUSTOM_DIET_PLAN];
  } catch {
    return [SEED_CUSTOM_DIET_PLAN];
  }
}

export function saveStoredCustomDietPlan(plan: CustomDietPlan): CustomDietPlan[] {
  try {
    const plans = getStoredCustomDietPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    let updated: CustomDietPlan[];
    if (index >= 0) {
      updated = [...plans];
      updated[index] = plan;
    } else {
      updated = [plan, ...plans];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_DIET_PLANS, JSON.stringify(updated));
    return updated;
  } catch {
    return [plan];
  }
}

export function deleteStoredCustomDietPlan(id: string): CustomDietPlan[] {
  try {
    const plans = getStoredCustomDietPlans().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_DIET_PLANS, JSON.stringify(plans));
    return plans;
  } catch {
    return [];
  }
}

