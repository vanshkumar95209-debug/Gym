import { AppLanguage } from '../types';

export interface Translations {
  workouts: string;
  diet: string;
  waterTracker: string;
  dailyLog: string;
  streak: string;
  profile: string;
  reminderOn: string;
  reminderOff: string;
  selectMuscle: string;
  allMuscles: string;
  availableExercises: string;
  equipment: string;
  allEquipment: string;
  viewGuideAndStart: string;
  startWorkout: string;
  favorite: string;
  preWorkoutGuideBadge: string;
  target: string;
  waterIntakeTitle: string;
  waterGoal: string;
  glasses: string;
  addGlass: string;
  addBottle: string;
  resetWater: string;
  whenAndHowToDrink: string;
  timingSchedule: string;
  vegDietPlans: string;
  foodDirectory: string;
  proteinPer100g: string;
  vegOnly: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  language: string;
  customDietMaker: string;
  createCustomDiet: string;
  customTimer: string;
  workoutPlans: string;
  workoutTracker: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    workouts: 'Workouts',
    workoutPlans: 'Workout Plans',
    workoutTracker: 'Workout Tracker',
    diet: 'Diet & Nutrition',
    waterTracker: 'Water Tracker',
    dailyLog: 'Daily Log',
    streak: 'Day Streak',
    profile: 'Profile',
    reminderOn: 'Reminder On',
    reminderOff: 'Reminder Off',
    selectMuscle: 'Select Muscle Group',
    allMuscles: 'All Muscles',
    availableExercises: 'Exercises Available',
    equipment: 'Equipment',
    allEquipment: 'All',
    viewGuideAndStart: 'View Guide & Start',
    startWorkout: 'Start Workout',
    favorite: 'Favorite',
    preWorkoutGuideBadge: 'Read Guide First',
    target: 'Target',
    waterIntakeTitle: 'Daily Water Intake & Hydration',
    waterGoal: 'Daily Water Goal',
    glasses: 'Glasses',
    addGlass: '+1 Glass (250ml)',
    addBottle: '+2 Glasses (500ml Bottle)',
    resetWater: 'Reset Water',
    whenAndHowToDrink: 'When & How Much Water to Drink',
    timingSchedule: 'Hydration Timing Schedule',
    vegDietPlans: 'Veg Diet Plans',
    foodDirectory: 'High Protein Foods',
    proteinPer100g: 'Protein / 100g',
    vegOnly: 'Vegetarian Only',
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Carbs',
    fats: 'Fats',
    language: 'Language',
    customDietMaker: 'Custom Diet Maker',
    createCustomDiet: 'Create Custom Diet',
    customTimer: 'Custom Timer'
  },
  hi: {
    workouts: 'कसरतें (Workouts)',
    diet: 'डाइट व पोषण',
    waterTracker: 'पानी ट्रैकर (Water)',
    dailyLog: 'डेली प्रोग्रेस लॉग',
    streak: 'दिन स्ट्राइक',
    profile: 'प्रोफाइल',
    reminderOn: 'रिमाइंडर चालू',
    reminderOff: 'रिमाइंडर बंद',
    selectMuscle: 'मांसपेशी चुनें',
    allMuscles: 'सभी कसरतें',
    availableExercises: 'उपलब्ध कसरतें',
    equipment: 'उपकरण',
    allEquipment: 'सभी उपकरण',
    viewGuideAndStart: 'गाइड देखें व शुरू करें',
    startWorkout: 'कसरत शुरू करें',
    favorite: 'पसंदीदा',
    preWorkoutGuideBadge: 'पहले गाइड देखें',
    target: 'टारगेट',
    waterIntakeTitle: 'दैनिक जल सेवन व हाइड्रेशन',
    waterGoal: 'दैनिक पानी का लक्ष्य',
    glasses: 'ग्लास',
    addGlass: '+1 ग्लास (250ml)',
    addBottle: '+2 ग्लास (500ml बोतल)',
    resetWater: 'रीसेट करें',
    whenAndHowToDrink: 'कब और कितना पानी पीना है',
    timingSchedule: 'समय अनुसार पीने का नियम',
    vegDietPlans: 'शाकाहारी डाइट प्लान्स',
    foodDirectory: 'हाई-प्रोटीन खाद्य सूची',
    proteinPer100g: 'प्रोटीन प्रति 100g',
    vegOnly: 'केवल शाकाहारी',
    calories: 'कैलोरी',
    protein: 'प्रोटीन',
    carbs: 'कार्ब्स',
    fats: 'फैट्स',
    language: 'भाषा',
    customDietMaker: 'कस्टम डाइट मेकर',
    createCustomDiet: 'खुद का डाइट प्लान बनाएं',
    customTimer: 'कस्टम टाइमर',
    workoutPlans: 'वर्कआउट प्लान्स',
    workoutTracker: 'वर्कआउट ट्रैकर'
  }
};
