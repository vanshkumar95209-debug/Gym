import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Copy, 
  Check, 
  Sparkles, 
  Utensils, 
  Search, 
  Flame, 
  Scale, 
  FolderOpen, 
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CustomDietPlan, 
  CustomMealSlot, 
  CustomMealFoodItem, 
  FoodItem, 
  UserFitnessProfile, 
  AppLanguage 
} from '../types';
import { FOOD_DATABASE } from '../data/foods';
import { 
  getStoredCustomDietPlans, 
  saveStoredCustomDietPlan, 
  deleteStoredCustomDietPlan 
} from '../utils/storage';
import { playFoodAddSound, playSuccessChime, playResetSound } from '../utils/audio';

interface CustomDietMakerProps {
  userProfile: UserFitnessProfile;
  language?: AppLanguage;
}

const PRESET_MEAL_NAMES_EN = [
  'Breakfast',
  'Morning Snack',
  'Lunch',
  'Pre-Workout Snack',
  'Post-Workout Shake / Meal',
  'Dinner',
  'Bedtime Snack'
];

const PRESET_MEAL_NAMES_HI = [
  'सुबह का नाश्ता (Breakfast)',
  'मॉर्निंग स्नैक (Morning Snack)',
  'दोपहर का भोजन (Lunch)',
  'कसरत से पहले (Pre-Workout)',
  'कसरत के बाद (Post-Workout)',
  'रात का खाना (Dinner)',
  'सोने से पहले (Bedtime Snack)'
];

export const CustomDietMaker: React.FC<CustomDietMakerProps> = ({
  userProfile,
  language = 'en'
}) => {
  const isEn = language === 'en';

  const [savedPlans, setSavedPlans] = useState<CustomDietPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<CustomDietPlan | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState<boolean>(false);

  // Modal for adding food from database
  const [activeMealSlotIdForFood, setActiveMealSlotIdForFood] = useState<string | null>(null);
  const [foodSearchQuery, setFoodSearchQuery] = useState<string>('');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState<'all' | 'veg' | 'non-veg' | 'supplements'>('all');
  const [selectedDbFood, setSelectedDbFood] = useState<FoodItem | null>(null);
  const [foodGramsInput, setFoodGramsInput] = useState<number>(100);

  // Modal for adding custom manual food
  const [showCustomFoodModal, setShowCustomFoodModal] = useState<boolean>(false);
  const [customFoodName, setCustomFoodName] = useState<string>('');
  const [customFoodGrams, setCustomFoodGrams] = useState<number>(100);
  const [customFoodProtein, setCustomFoodProtein] = useState<number>(20);
  const [customFoodCalories, setCustomFoodCalories] = useState<number>(150);
  const [customFoodCarbs, setCustomFoodCarbs] = useState<number>(15);
  const [customFoodFats, setCustomFoodFats] = useState<number>(3);

  // New meal slot dropdown or prompt
  const [newMealNameInput, setNewMealNameInput] = useState<string>('');
  const [showAddMealInput, setShowAddMealInput] = useState<boolean>(false);

  // Load saved plans on mount
  useEffect(() => {
    const plans = getStoredCustomDietPlans();
    setSavedPlans(plans);
    if (plans.length > 0) {
      setCurrentPlan(plans[0]);
    } else {
      handleCreateNewPlan();
    }
  }, []);

  const handleCreateNewPlan = () => {
    const newPlan: CustomDietPlan = {
      id: 'custom-plan-' + Date.now(),
      title: isEn ? 'My Custom Muscle Diet' : 'मेरा नया कस्टम डाइट प्लान',
      targetGoal: 'Bulking',
      createdAt: new Date().toISOString().split('T')[0],
      notes: isEn ? 'Personalized high-protein bodybuilding meal plan.' : 'व्यक्तिगत उच्च-प्रोटीन बॉडीबिल्डिंग डाइट प्लान।',
      meals: [
        {
          id: 'meal-' + Date.now() + '-1',
          name: isEn ? 'Breakfast' : 'सुबह का नाश्ता',
          time: '08:00 AM',
          foods: []
        },
        {
          id: 'meal-' + Date.now() + '-2',
          name: isEn ? 'Lunch' : 'दोपहर का भोजन',
          time: '01:30 PM',
          foods: []
        },
        {
          id: 'meal-' + Date.now() + '-3',
          name: isEn ? 'Post-Workout' : 'कसरत के बाद',
          time: '06:30 PM',
          foods: []
        },
        {
          id: 'meal-' + Date.now() + '-4',
          name: isEn ? 'Dinner' : 'रात का खाना',
          time: '09:00 PM',
          foods: []
        }
      ]
    };
    setCurrentPlan(newPlan);
  };

  const handleSelectPlan = (planId: string) => {
    const found = savedPlans.find(p => p.id === planId);
    if (found) {
      setCurrentPlan(JSON.parse(JSON.stringify(found))); // deep clone for editing
    }
  };

  const handleSavePlan = () => {
    if (!currentPlan) return;
    const updated = saveStoredCustomDietPlan(currentPlan);
    setSavedPlans(updated);
    setSaveSuccessNotification(true);
    playSuccessChime();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => setSaveSuccessNotification(false), 3000);
  };

  const handleDeletePlan = (planId: string) => {
    const confirmText = isEn 
      ? 'Are you sure you want to delete this diet plan?' 
      : 'क्या आप वाकई इस डाइट प्लान को हटाना चाहते हैं?';
    if (!window.confirm(confirmText)) return;

    playResetSound();
    const remaining = deleteStoredCustomDietPlan(planId);
    setSavedPlans(remaining);
    if (remaining.length > 0) {
      setCurrentPlan(remaining[0]);
    } else {
      handleCreateNewPlan();
    }
  };

  // Add Meal Slot
  const handleAddMealSlot = (mealName: string) => {
    if (!currentPlan || !mealName.trim()) return;
    playFoodAddSound();
    const newSlot: CustomMealSlot = {
      id: 'meal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: mealName.trim(),
      time: '12:00 PM',
      foods: []
    };
    setCurrentPlan({
      ...currentPlan,
      meals: [...currentPlan.meals, newSlot]
    });
    setNewMealNameInput('');
    setShowAddMealInput(false);
  };

  // Delete Meal Slot
  const handleDeleteMealSlot = (slotId: string) => {
    if (!currentPlan) return;
    playResetSound();
    setCurrentPlan({
      ...currentPlan,
      meals: currentPlan.meals.filter(m => m.id !== slotId)
    });
  };

  // Open modal for Food Database
  const handleOpenDbFoodModal = (slotId: string) => {
    setActiveMealSlotIdForFood(slotId);
    setFoodSearchQuery('');
    setSelectedDbFood(null);
    setFoodGramsInput(100);
  };

  // Filtered Food Database
  const filteredDbFoods = useMemo(() => {
    return FOOD_DATABASE.filter(f => {
      if (foodCategoryFilter !== 'all') {
        if (foodCategoryFilter === 'veg' && f.category !== 'veg' && f.category !== 'vegan') return false;
        if (foodCategoryFilter === 'non-veg' && f.category !== 'non-veg') return false;
        if (foodCategoryFilter === 'supplements' && f.category !== 'supplements') return false;
      }
      if (foodSearchQuery.trim()) {
        const q = foodSearchQuery.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.hindiName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [foodCategoryFilter, foodSearchQuery]);

  // Confirm Add Food from Database
  const handleConfirmAddDbFood = () => {
    if (!currentPlan || !activeMealSlotIdForFood || !selectedDbFood) return;

    playFoodAddSound();
    const ratio = foodGramsInput / 100;
    const newFoodItem: CustomMealFoodItem = {
      id: 'food-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      foodName: isEn ? selectedDbFood.name : selectedDbFood.hindiName,
      quantityGrams: foodGramsInput,
      proteinGrams: Math.round(selectedDbFood.proteinPer100g * ratio * 10) / 10,
      calories: Math.round(selectedDbFood.caloriesPer100g * ratio),
      carbsGrams: Math.round((selectedDbFood.carbsPer100g || 0) * ratio * 10) / 10,
      fatsGrams: Math.round((selectedDbFood.fatsPer100g || 0) * ratio * 10) / 10
    };

    const updatedMeals = currentPlan.meals.map(slot => {
      if (slot.id === activeMealSlotIdForFood) {
        return {
          ...slot,
          foods: [...slot.foods, newFoodItem]
        };
      }
      return slot;
    });

    setCurrentPlan({
      ...currentPlan,
      meals: updatedMeals
    });

    setActiveMealSlotIdForFood(null);
    setSelectedDbFood(null);
  };

  // Confirm Add Manual Custom Food
  const handleConfirmAddCustomFood = () => {
    if (!currentPlan || !activeMealSlotIdForFood || !customFoodName.trim()) return;

    playFoodAddSound();
    const newFoodItem: CustomMealFoodItem = {
      id: 'custom-food-' + Date.now(),
      foodName: customFoodName.trim(),
      quantityGrams: customFoodGrams || 100,
      proteinGrams: Number(customFoodProtein) || 0,
      calories: Number(customFoodCalories) || 0,
      carbsGrams: Number(customFoodCarbs) || 0,
      fatsGrams: Number(customFoodFats) || 0
    };

    const updatedMeals = currentPlan.meals.map(slot => {
      if (slot.id === activeMealSlotIdForFood) {
        return {
          ...slot,
          foods: [...slot.foods, newFoodItem]
        };
      }
      return slot;
    });

    setCurrentPlan({
      ...currentPlan,
      meals: updatedMeals
    });

    setShowCustomFoodModal(false);
    setActiveMealSlotIdForFood(null);
    setCustomFoodName('');
  };

  // Remove food from a meal slot
  const handleRemoveFoodFromSlot = (slotId: string, foodId: string) => {
    if (!currentPlan) return;
    const updatedMeals = currentPlan.meals.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          foods: slot.foods.filter(f => f.id !== foodId)
        };
      }
      return slot;
    });
    setCurrentPlan({
      ...currentPlan,
      meals: updatedMeals
    });
  };

  // Copy Plan Text to Clipboard
  const handleCopyPlanToClipboard = () => {
    if (!currentPlan) return;
    let text = `📋 ${currentPlan.title.toUpperCase()} (${currentPlan.targetGoal})\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    
    currentPlan.meals.forEach((meal, i) => {
      const mealProtein = meal.foods.reduce((sum, f) => sum + f.proteinGrams, 0);
      const mealCals = meal.foods.reduce((sum, f) => sum + f.calories, 0);
      text += `\n[Meal ${i + 1}] ${meal.name} (${meal.time || ''})\n`;
      if (meal.foods.length === 0) {
        text += `  - No food items\n`;
      } else {
        meal.foods.forEach(f => {
          text += `  • ${f.foodName}: ${f.quantityGrams}g | ${f.proteinGrams}g Protein | ${f.calories} kcal\n`;
        });
      }
      text += `  » Meal Total: ${mealProtein.toFixed(1)}g Protein | ${mealCals} kcal\n`;
    });

    text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🔥 TOTAL MACROS:\n`;
    text += `• Total Protein: ${totalPlanProtein.toFixed(1)}g (Target: ${userProfile.dailyProteinTargetGrams || 140}g)\n`;
    text += `• Total Calories: ${totalPlanCalories} kcal\n`;
    text += `• Total Carbs: ${totalPlanCarbs.toFixed(1)}g\n`;
    text += `• Total Fats: ${totalPlanFats.toFixed(1)}g\n`;
    text += `\nGenerated with IronPulse Fitness App`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Compute total macros for current plan
  const totalPlanProtein = useMemo(() => {
    if (!currentPlan) return 0;
    return currentPlan.meals.reduce((sum, m) => {
      return sum + m.foods.reduce((fSum, f) => fSum + f.proteinGrams, 0);
    }, 0);
  }, [currentPlan]);

  const totalPlanCalories = useMemo(() => {
    if (!currentPlan) return 0;
    return currentPlan.meals.reduce((sum, m) => {
      return sum + m.foods.reduce((fSum, f) => fSum + f.calories, 0);
    }, 0);
  }, [currentPlan]);

  const totalPlanCarbs = useMemo(() => {
    if (!currentPlan) return 0;
    return currentPlan.meals.reduce((sum, m) => {
      return sum + m.foods.reduce((fSum, f) => fSum + (f.carbsGrams || 0), 0);
    }, 0);
  }, [currentPlan]);

  const totalPlanFats = useMemo(() => {
    if (!currentPlan) return 0;
    return currentPlan.meals.reduce((sum, m) => {
      return sum + m.foods.reduce((fSum, f) => fSum + (f.fatsGrams || 0), 0);
    }, 0);
  }, [currentPlan]);

  const proteinTarget = userProfile.dailyProteinTargetGrams || 140;
  const proteinPercent = Math.min(100, Math.round((totalPlanProtein / proteinTarget) * 100));

  if (!currentPlan) {
    return (
      <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800">
        <Utensils className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-bounce" />
        <h3 className="font-bold text-white text-base">
          {isEn ? 'Loading Custom Diet Maker...' : 'कस्टम डाइट मेकर लोड हो रहा है...'}
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner: Saved Plans Switcher & Plan Creation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                {isEn ? 'Custom Diet Plan Maker' : 'कस्टम डाइट प्लान मेकर'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEn 
                ? 'Design your own custom bodybuilding meals, grams, and track exact protein & calories.' 
                : 'अपनी पसंद के अनुसार भोजन, ग्राम व कैलोरी तय करके खुद का पर्सनल डाइट प्लान बनाएं।'}
            </p>
          </div>

          {/* Action Buttons: New Plan & Save */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <button
              onClick={handleCreateNewPlan}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? 'New Plan' : 'नया प्लान'}</span>
            </button>

            <button
              onClick={handleCopyPlanToClipboard}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border border-slate-700"
              title={isEn ? "Copy to Clipboard" : "क्लिपबोर्ड पर कॉपी करें"}
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isEn ? 'Copied!' : 'कॉपी हो गया!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isEn ? 'Copy Plan' : 'कॉपी करें'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleSavePlan}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer transition shadow-md shadow-orange-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEn ? 'Save Plan' : 'प्लान सेव करें'}</span>
            </button>
          </div>
        </div>

        {/* Saved Plans Selector Bar */}
        {savedPlans.length > 0 && (
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <FolderOpen className="w-3 h-3 text-amber-400" />
              {isEn ? 'My Saved Plans:' : 'सेव किए गए प्लान्स:'}
            </span>
            {savedPlans.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectPlan(p.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition flex items-center gap-1.5 ${
                  currentPlan.id === p.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{p.title}</span>
                <span className="text-[10px] opacity-75">({p.targetGoal})</span>
              </button>
            ))}
          </div>
        )}

        {/* Plan Configuration Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Plan Title */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isEn ? 'Diet Plan Name' : 'डाइट प्लान का नाम'}
            </label>
            <input
              type="text"
              value={currentPlan.title}
              onChange={(e) => setCurrentPlan({ ...currentPlan, title: e.target.value })}
              placeholder={isEn ? "e.g. My 150g Bulking Diet" : "उदा. मेरा 150g बल्किंग डाइट प्लान"}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
            />
          </div>

          {/* Goal Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isEn ? 'Target Goal' : 'लक्ष्य (Goal)'}
            </label>
            <select
              value={currentPlan.targetGoal}
              onChange={(e) => setCurrentPlan({ ...currentPlan, targetGoal: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer"
            >
              <option value="Bulking">{isEn ? 'Bulking / Muscle Gain' : 'बल्किंग (मसल गेन)'}</option>
              <option value="Fat Loss">{isEn ? 'Fat Loss / Cutting' : 'फैट लॉस (कटिंग)'}</option>
              <option value="Lean Muscle">{isEn ? 'Lean Muscle Building' : 'लीन मसल ग्रोथ'}</option>
              <option value="Fitness">{isEn ? 'General Fitness' : 'सामान्य फिटनेस'}</option>
            </select>
          </div>
        </div>

        {/* Success toast notification */}
        {saveSuccessNotification && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              {isEn ? 'Diet plan saved successfully to your device!' : 'डाइट प्लान सफलतापूर्वक सुरक्षित कर लिया गया है!'}
            </span>
          </div>
        )}
      </div>

      {/* Live Macros Dashboard */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/25 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <h3 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide">
              {isEn ? 'Live Macro & Nutrition Summary' : 'लाइव मैक्रोज़ व पोषण सारांश'}
            </h3>
          </div>

          <span className="text-xs font-bold text-amber-400">
            {isEn ? `Target: ${proteinTarget}g Protein` : `लक्ष्य: ${proteinTarget}g प्रोटीन`}
          </span>
        </div>

        {/* 4 Macro Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-950/90 border border-amber-500/30 p-3 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-400">
              {isEn ? 'Total Protein' : 'कुल प्रोटीन'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
              {totalPlanProtein.toFixed(1)}g
            </div>
            <span className="text-[10px] text-slate-400">
              {proteinPercent}% {isEn ? 'of goal' : 'लक्ष्य का'}
            </span>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-orange-400">
              {isEn ? 'Calories' : 'कुल कैलोरी'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {totalPlanCalories}
            </div>
            <span className="text-[10px] text-slate-400">kcal / day</span>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-cyan-400">
              {isEn ? 'Carbs' : 'कार्ब्स'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {totalPlanCarbs.toFixed(1)}g
            </div>
            <span className="text-[10px] text-slate-400">{isEn ? 'Energy' : 'ऊर्जा'}</span>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-400">
              {isEn ? 'Healthy Fats' : 'फैट्स'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {totalPlanFats.toFixed(1)}g
            </div>
            <span className="text-[10px] text-slate-400">{isEn ? 'Hormones' : 'हॉर्मोन स्वास्थ्य'}</span>
          </div>
        </div>

        {/* Protein Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden mt-1">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${proteinPercent}%` }}
          />
        </div>
      </div>

      {/* Meals Section Header & Add Custom Meal Slot Button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h3 className="font-black text-white text-sm sm:text-base tracking-tight">
            {isEn ? 'Meal Slots & Food Timing' : 'भोजन समय व डाइट स्लॉट्स'}
          </h3>
          <p className="text-xs text-slate-400">
            {isEn 
              ? `${currentPlan.meals.length} meals configured. Add foods with grams to calculate nutrition.` 
              : `${currentPlan.meals.length} भोजन स्लॉट्स तैयार हैं। ग्राम के हिसाब से फूड्स जोड़ें।`}
          </p>
        </div>

        {/* Quick Add Meal Slot Dropdown */}
        <div className="relative">
          {!showAddMealInput ? (
            <button
              onClick={() => setShowAddMealInput(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isEn ? '+ Add Meal Slot' : '+ नया भोजन स्लॉट जोड़ें'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1.5 rounded-xl">
              <input
                type="text"
                value={newMealNameInput}
                onChange={(e) => setNewMealNameInput(e.target.value)}
                placeholder={isEn ? "e.g. Evening Snack" : "उदा. शाम का नाश्ता"}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                autoFocus
              />
              <button
                onClick={() => handleAddMealSlot(newMealNameInput)}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-400"
              >
                {isEn ? 'Add' : 'जोड़ें'}
              </button>
              <button
                onClick={() => setShowAddMealInput(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preset Quick Add Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <span className="text-slate-500 font-semibold whitespace-nowrap">
          {isEn ? 'Quick presets:' : 'जल्दी जोड़ें:'}
        </span>
        {(isEn ? PRESET_MEAL_NAMES_EN : PRESET_MEAL_NAMES_HI).map((pName) => (
          <button
            key={pName}
            onClick={() => handleAddMealSlot(pName)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap cursor-pointer transition"
          >
            + {pName}
          </button>
        ))}
      </div>

      {/* Meal Slots List */}
      <div className="space-y-4">
        {currentPlan.meals.map((mealSlot, index) => {
          const slotProtein = mealSlot.foods.reduce((sum, f) => sum + f.proteinGrams, 0);
          const slotCalories = mealSlot.foods.reduce((sum, f) => sum + f.calories, 0);
          const slotCarbs = mealSlot.foods.reduce((sum, f) => sum + (f.carbsGrams || 0), 0);
          const slotFats = mealSlot.foods.reduce((sum, f) => sum + (f.fatsGrams || 0), 0);

          return (
            <div
              key={mealSlot.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md"
            >
              {/* Meal Slot Header */}
              <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={mealSlot.name}
                      onChange={(e) => {
                        const updated = currentPlan.meals.map(m => m.id === mealSlot.id ? { ...m, name: e.target.value } : m);
                        setCurrentPlan({ ...currentPlan, meals: updated });
                      }}
                      className="bg-transparent font-bold text-white text-sm focus:bg-slate-900 px-1 py-0.5 rounded border border-transparent focus:border-slate-700"
                    />
                  </div>
                </div>

                {/* Slot Macro Badges & Action Buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                      {slotProtein.toFixed(1)}g {isEn ? 'Protein' : 'प्रोटीन'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {slotCalories} kcal
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteMealSlot(mealSlot.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 cursor-pointer transition"
                    title={isEn ? "Delete Meal Slot" : "स्लॉट हटाएं"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Food Items Inside Slot */}
              <div className="p-3.5 space-y-2">
                {mealSlot.foods.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    {isEn 
                      ? 'No foods in this meal yet. Click below to add from food database or add custom item.' 
                      : 'इस भोजन में अभी कोई फूड नहीं जोड़ा गया है। नीचे बटन दबाकर फूड जोड़ें।'}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {mealSlot.foods.map((food) => (
                      <div
                        key={food.id}
                        className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="font-bold text-white">{food.foodName}</span>
                          <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
                            {food.quantityGrams}g
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="font-black text-amber-400">{food.proteinGrams}g P</span>
                            <span className="text-slate-400">{food.calories} kcal</span>
                            {food.carbsGrams !== undefined && (
                              <span className="hidden sm:inline text-slate-500">{food.carbsGrams}g C</span>
                            )}
                            {food.fatsGrams !== undefined && (
                              <span className="hidden sm:inline text-slate-500">{food.fatsGrams}g F</span>
                            )}
                          </div>

                          <button
                            onClick={() => handleRemoveFoodFromSlot(mealSlot.id, food.id)}
                            className="p-1 text-slate-500 hover:text-red-400 cursor-pointer transition rounded"
                            title={isEn ? "Remove food" : "फूड हटाएं"}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Food Buttons for this slot */}
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleOpenDbFoodModal(mealSlot.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>{isEn ? '+ Add from Food Database' : '+ फूड लिस्ट से जोड़ें'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMealSlotIdForFood(mealSlot.id);
                      setShowCustomFoodModal(true);
                      setCustomFoodName('');
                      setCustomFoodGrams(100);
                      setCustomFoodProtein(15);
                      setCustomFoodCalories(120);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isEn ? '+ Add Custom Food Manually' : '+ खुद का फूड टाइप करें'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete whole plan button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => handleDeletePlan(currentPlan.id)}
          className="text-xs text-red-400/80 hover:text-red-300 cursor-pointer flex items-center gap-1 transition p-2 rounded-lg hover:bg-red-500/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isEn ? 'Delete This Diet Plan' : 'यह डाइट प्लान हटाएं'}</span>
        </button>
      </div>

      {/* MODAL 1: Add from Food Database */}
      {activeMealSlotIdForFood && !showCustomFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">
                  {isEn ? 'Add Food from Database' : 'फूड लिस्ट से चुनें'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isEn ? 'Select any item and adjust quantity in grams' : 'कोई भी खाद्य चुनें और ग्राम में मात्रा तय करें'}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveMealSlotIdForFood(null);
                  setSelectedDbFood(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="p-4 space-y-2.5 border-b border-slate-800 bg-slate-950/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={foodSearchQuery}
                  onChange={(e) => setFoodSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search Paneer, Soya, Eggs, Oats, Whey..." : "पनीर, सोया चंक्स, अंडे, ओट्स खोजें..."}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div className="flex gap-1.5 text-[11px] overflow-x-auto pb-0.5 scrollbar-none">
                {(['all', 'veg', 'non-veg', 'supplements'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFoodCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition font-bold whitespace-nowrap ${
                      foodCategoryFilter === cat
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat === 'all' ? (isEn ? 'All' : 'सभी') : cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Selection List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredDbFoods.map(food => {
                const isSelected = selectedDbFood?.id === food.id;

                return (
                  <div
                    key={food.id}
                    onClick={() => {
                      setSelectedDbFood(food);
                      setFoodGramsInput(food.defaultServingSize || 100);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          food.category === 'veg' || food.category === 'vegan' ? 'bg-emerald-400' : 'bg-red-400'
                        }`} />
                        <h5 className="font-bold text-xs sm:text-sm text-white">
                          {isEn ? food.name : food.hindiName}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {food.servingUnit}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-amber-400">
                        {food.proteinPer100g}g {isEn ? 'Protein/100g' : 'प्रोटीन/100g'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {food.caloriesPer100g} kcal
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Grams Adjuster & Add Button */}
            {selectedDbFood && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-white">{isEn ? selectedDbFood.name : selectedDbFood.hindiName}</span>
                    <span className="text-slate-400 block text-[11px]">
                      {Math.round(selectedDbFood.proteinPer100g * (foodGramsInput / 100) * 10) / 10}g Protein • {Math.round(selectedDbFood.caloriesPer100g * (foodGramsInput / 100))} kcal
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">{isEn ? 'Grams:' : 'मात्रा (g):'}</span>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      step="5"
                      value={foodGramsInput}
                      onChange={(e) => setFoodGramsInput(Math.max(10, Number(e.target.value)))}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-400 font-bold text-center focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {[30, 50, 100, 150, 200, 250].map(g => (
                    <button
                      key={g}
                      onClick={() => setFoodGramsInput(g)}
                      className={`px-2.5 py-1 rounded-lg border cursor-pointer font-bold ${
                        foodGramsInput === g ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {g}g
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConfirmAddDbFood}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-md transition"
                >
                  {isEn ? '+ Add to Meal' : '+ इस भोजन में जोड़ें'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Add Custom Manual Food */}
      {showCustomFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm sm:text-base">
                {isEn ? 'Add Custom Food Manually' : 'मैन्युअल फूड आइटम जोड़ें'}
              </h4>
              <button
                onClick={() => setShowCustomFoodModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {isEn ? 'Food Name' : 'फूड का नाम'}
                </label>
                <input
                  type="text"
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                  placeholder={isEn ? "e.g. Sattu Protein Shake" : "उदा. सत्तू प्रोटीन शेक"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {isEn ? 'Quantity (Grams / Portion)' : 'मात्रा (ग्राम)'}
                  </label>
                  <input
                    type="number"
                    value={customFoodGrams}
                    onChange={(e) => setCustomFoodGrams(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    {isEn ? 'Protein (Grams)' : 'प्रोटीन (ग्राम)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={customFoodProtein}
                    onChange={(e) => setCustomFoodProtein(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 focus:outline-none focus:border-amber-400 font-black"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block mb-1">
                    {isEn ? 'Calories (kcal)' : 'कैलोरी (kcal)'}
                  </label>
                  <input
                    type="number"
                    value={customFoodCalories}
                    onChange={(e) => setCustomFoodCalories(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    {isEn ? 'Carbs (Grams - optional)' : 'कार्ब्स (ग्राम)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={customFoodCarbs}
                    onChange={(e) => setCustomFoodCarbs(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmAddCustomFood}
              disabled={!customFoodName.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-md transition"
            >
              {isEn ? '+ Add Custom Food to Meal' : '+ इस भोजन में जोड़ें'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
