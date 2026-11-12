export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'biceps' 
  | 'triceps' 
  | 'shoulders' 
  | 'legs' 
  | 'abs';

export type EquipmentType = 
  | 'Barbell' 
  | 'Dumbbell' 
  | 'Cables' 
  | 'Machine' 
  | 'Bodyweight'
  | 'No Equipment';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  hindiName: string;
  targetMuscle: MuscleGroup;
  targetSubMuscle: string;
  secondaryMuscles: string[];
  equipment: EquipmentType;
  isNoEquipment?: boolean;
  difficulty: DifficultyLevel;
  animationKey: string;
  repCadence: {
    eccentricSec: number;
    pauseSec: number;
    concentricSec: number;
  };
  description: string;
  hindiDescription: string;
  steps: string[];
  tips: string[];
  breathingTip: string;
  commonMistakes: string[];
  defaultSetsReps: string;
  youtubeId?: string;
  imageUrl?: string;
}

export type FoodCategory = 'all' | 'veg' | 'non-veg' | 'vegan' | 'supplements';

export interface FoodItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'veg' | 'non-veg' | 'vegan' | 'supplements';
  proteinPer100g: number;
  caloriesPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  defaultServingSize: number; // in grams or units
  servingUnit: string; // e.g. "100g", "1 Scoop (30g)", "2 Large Eggs (100g)"
  servingProtein: number; // calculated for default serving
  servingCalories: number;
  bestTime: string;
  budgetFriendly: boolean;
  notes: string;
  tags: string[];
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  exerciseName: string;
  targetMuscle: MuscleGroup;
  sets: WorkoutSet[];
  notes?: string;
}

export interface DailyWorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  muscleGroups: MuscleGroup[];
  durationMinutes: number;
  exercises: WorkoutExerciseLog[];
  bodyWeightKg?: number;
  notes?: string;
}

export interface BodyMetrics {
  id: string;
  date: string;
  weightKg: number;
  chestInches?: number;
  bicepsInches?: number;
  waistInches?: number;
  notes?: string;
}

export interface DailyDietLogItem {
  id: string;
  foodId: string;
  foodName: string;
  quantityGramsOrUnits: number;
  proteinGrams: number;
  calories: number;
  mealType: 'Breakfast' | 'Lunch' | 'Pre-Workout' | 'Post-Workout' | 'Dinner' | 'Snack';
}

export interface UserFitnessProfile {
  weightKg: number;
  heightCm: number;
  goal: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'beast_body';
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'athlete';
  dailyProteinTargetGrams: number;
  dailyWaterTargetLiters: number;
  dailyReminderEnabled: boolean;
  reminderTime: string; // e.g. "18:00"
  lastReminderDate?: string;
}

// Water Intake System Types
export interface WaterScheduleSlot {
  id: string;
  timeSlot: string;
  labelEn: string;
  labelHi: string;
  targetGlasses: number;
  amountMl: number;
  reasonEn: string;
  reasonHi: string;
}

export interface DailyWaterLog {
  date: string;
  glassesDrank: number;
  targetGlasses: number;
  completedSlots: string[]; // ids of completed slots
}

// Vegetarian Diet Plan Types
export interface VegDietMeal {
  mealNameEn: string;
  mealNameHi: string;
  time: string;
  foodItems: {
    name: string;
    portion: string;
    proteinGrams: number;
    calories: number;
  }[];
  totalMealProtein: number;
  totalMealCalories: number;
  tips: string;
}

export interface VegDietPlan {
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  targetGoal: 'Bulking' | 'Fat Loss' | 'Fitness' | 'Budget Student';
  badge: string;
  totalCalories: number;
  totalProteinGrams: number;
  descriptionEn: string;
  descriptionHi: string;
  meals: VegDietMeal[];
}

// Custom Diet Maker Types
export interface CustomMealFoodItem {
  id: string;
  foodName: string;
  quantityGrams: number;
  proteinGrams: number;
  calories: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface CustomMealSlot {
  id: string;
  name: string;
  time?: string;
  foods: CustomMealFoodItem[];
}

export interface CustomDietPlan {
  id: string;
  title: string;
  targetGoal: 'Bulking' | 'Fat Loss' | 'Fitness' | 'Lean Muscle';
  createdAt: string;
  meals: CustomMealSlot[];
  notes?: string;
}

export interface WorkoutStreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string; // YYYY-MM-DD
  historyDates: string[]; // array of completed workout date strings
}

export type WorkoutPlanDifficulty = 'lite' | 'moderate' | 'hard' | 'fatloss';

export interface WorkoutPlanExercise {
  exerciseId: string;
  name: string;
  hindiName: string;
  targetMuscle: string;
  equipment: string;
  workSec: number;
  restSec: number;
  sets: number;
  repsOrCadence: string;
  breathingInhale: string;
  breathingExhale: string;
  tip: string;
}

export interface WorkoutPlan {
  id: string;
  difficulty: WorkoutPlanDifficulty;
  titleEn: string;
  titleHi: string;
  taglineEn: string;
  taglineHi: string;
  durationMinutes: number;
  targetFocusEn: string;
  targetFocusHi: string;
  color: string;
  badge: string;
  caloriesBurnEstimate: number;
  descriptionEn: string;
  descriptionHi: string;
  exercises: WorkoutPlanExercise[];
}

export interface DailyWorkoutGoal {
  date: string; // YYYY-MM-DD
  targetMinutes: number;
  achievedMinutes: number;
}

export type AppLanguage = 'en' | 'hi';
