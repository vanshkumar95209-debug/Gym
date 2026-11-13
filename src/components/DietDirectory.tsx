import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Search, 
  Plus, 
  Flame, 
  Scale, 
  Sparkles, 
  Trash2, 
  DollarSign, 
  Clock, 
  Check, 
  ChevronRight, 
  Leaf, 
  Apple, 
  Zap 
} from 'lucide-react';
import { FoodItem, FoodCategory, DailyDietLogItem, UserFitnessProfile, AppLanguage, VegDietPlan } from '../types';
import { FOOD_DATABASE, VEG_DIET_PLANS } from '../data/foods';
import { TRANSLATIONS } from '../utils/translations';
import { CustomDietMaker } from './CustomDietMaker';
import { playFoodAddSound, playResetSound } from '../utils/audio';
import { RotateCcw, Edit2 } from 'lucide-react';

interface DietDirectoryProps {
  userProfile: UserFitnessProfile;
  onUpdateProfile: (profile: UserFitnessProfile) => void;
  todayDietLogs: DailyDietLogItem[];
  onAddDietItem: (item: Omit<DailyDietLogItem, 'id'>) => void;
  onRemoveDietItem: (id: string) => void;
  onResetDietLogs: () => void;
  language?: AppLanguage;
}

export const DietDirectory: React.FC<DietDirectoryProps> = ({
  userProfile,
  onUpdateProfile,
  todayDietLogs,
  onAddDietItem,
  onRemoveDietItem,
  onResetDietLogs,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'custom_maker' | 'veg_plans' | 'foods' | 'calculator'>('custom_maker');
  const [selectedVegPlanId, setSelectedVegPlanId] = useState<string>('veg-muscle-bulking');
  const [showTargetEditModal, setShowTargetEditModal] = useState<boolean>(false);
  const [tempTargetGrams, setTempTargetGrams] = useState<number>(userProfile.dailyProteinTargetGrams || 140);
  
  // Foods state
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFoodForServing, setSelectedFoodForServing] = useState<FoodItem | null>(null);
  const [servingGrams, setServingGrams] = useState<number>(100);

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter(food => {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'veg' && food.category !== 'veg' && food.category !== 'vegan') return false;
        if (selectedCategory === 'vegan' && food.category !== 'vegan') return false;
        if (selectedCategory === 'non-veg' && food.category !== 'non-veg') return false;
        if (selectedCategory === 'supplements' && food.category !== 'supplements') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return food.name.toLowerCase().includes(q) || food.hindiName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const currentVegPlan = VEG_DIET_PLANS.find(p => p.id === selectedVegPlanId) || VEG_DIET_PLANS[0];

  const totalProteinConsumed = todayDietLogs.reduce((sum, item) => sum + item.proteinGrams, 0);
  const proteinTarget = userProfile.dailyProteinTargetGrams || 140;
  const progressPercent = Math.min(100, Math.round((totalProteinConsumed / proteinTarget) * 100));

  const handleQuickAdd = (food: FoodItem) => {
    playFoodAddSound();
    onAddDietItem({
      foodId: food.id,
      foodName: food.name,
      quantityGramsOrUnits: food.defaultServingSize,
      proteinGrams: food.servingProtein,
      calories: food.servingCalories,
      mealType: 'Lunch'
    });
  };

  const handleCustomAdd = () => {
    if (!selectedFoodForServing) return;
    playFoodAddSound();
    const ratio = servingGrams / 100;
    onAddDietItem({
      foodId: selectedFoodForServing.id,
      foodName: `${selectedFoodForServing.name} (${servingGrams}g)`,
      quantityGramsOrUnits: servingGrams,
      proteinGrams: Math.round(selectedFoodForServing.proteinPer100g * ratio * 10) / 10,
      calories: Math.round(selectedFoodForServing.caloriesPer100g * ratio),
      mealType: 'Lunch'
    });
    setSelectedFoodForServing(null);
  };

  const handleResetProtein = () => {
    playResetSound();
    onResetDietLogs();
  };

  const handleSaveNewTarget = (newTarget: number) => {
    playFoodAddSound();
    onUpdateProfile({
      ...userProfile,
      dailyProteinTargetGrams: newTarget
    });
    setShowTargetEditModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Daily Protein Target Tracker Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'hi' ? 'दैनिक प्रोटीन लक्ष्य' : 'Daily Protein Target'}
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalProteinConsumed.toFixed(1)}g <span className="text-sm font-semibold text-slate-400">/ {proteinTarget}g</span>
            </div>

            {/* Quick Edit Target Button */}
            <button
              onClick={() => {
                setTempTargetGrams(proteinTarget);
                setShowTargetEditModal(true);
              }}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
              title={language === 'hi' ? 'लक्ष्य बदलें' : 'Change Target'}
            >
              <Edit2 className="w-3 h-3" />
              <span>{language === 'hi' ? 'लक्ष्य बदलें' : 'Edit Target'}</span>
            </button>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl whitespace-nowrap">
            {progressPercent}% {language === 'hi' ? 'पूरा' : 'Achieved'}
          </span>

          {/* Reset Today's Protein Button */}
          <button
            onClick={handleResetProtein}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 text-slate-300 hover:text-red-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            title={language === 'hi' ? 'आज का प्रोटीन 0g पर रीसेट करें' : 'Reset Today\'s Protein to 0g'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'प्रोटीन रीसेट करें' : 'Reset Protein'}</span>
          </button>
        </div>
      </div>

      {/* Target Edit Modal */}
      {showTargetEditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm">
                {language === 'hi' ? 'दैनिक प्रोटीन लक्ष्य सेट करें' : 'Set Daily Protein Target'}
              </h4>
              <button 
                onClick={() => setShowTargetEditModal(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {language === 'hi' ? 'दैनिक प्रोटीन (ग्राम में)' : 'Daily Protein (in Grams)'}
                </label>
                <input
                  type="number"
                  min="50"
                  max="400"
                  value={tempTargetGrams}
                  onChange={(e) => setTempTargetGrams(Math.max(10, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-black text-lg focus:outline-none focus:border-amber-400 text-center"
                />
              </div>

              {/* Preset buttons */}
              <div className="flex gap-1.5 flex-wrap justify-center">
                {[100, 120, 140, 160, 180, 200].map(p => (
                  <button
                    key={p}
                    onClick={() => setTempTargetGrams(p)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-bold cursor-pointer transition ${
                      tempTargetGrams === p ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {p}g
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowTargetEditModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-700"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={() => handleSaveNewTarget(tempTargetGrams)}
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md"
              >
                {language === 'hi' ? 'सुरक्षित करें' : 'Save Target'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('custom_maker')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'custom_maker'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'hi' ? 'कस्टम डाइट मेकर' : 'Custom Diet Maker'}</span>
        </button>

        <button
          onClick={() => setActiveTab('veg_plans')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'veg_plans'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>{language === 'hi' ? 'शाकाहारी डाइट प्लान्स' : 'Veg Diet Plans'}</span>
        </button>

        <button
          onClick={() => setActiveTab('foods')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'foods'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>{language === 'hi' ? 'हाई-प्रोटीन फूड लिस्ट' : 'High Protein Foods'}</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{language === 'hi' ? 'कैलकुलेटर' : 'Calculator'}</span>
        </button>
      </div>

      {/* ===================== TAB 0: CUSTOM DIET MAKER ===================== */}
      {activeTab === 'custom_maker' && (
        <CustomDietMaker
          userProfile={userProfile}
          language={language}
        />
      )}

      {/* ===================== TAB 1: VEG DIET PLANS ===================== */}
      {activeTab === 'veg_plans' && (
        <div className="space-y-5">
          {/* Plan Selector Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {VEG_DIET_PLANS.map(plan => {
              const isSelected = plan.id === selectedVegPlanId;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedVegPlanId(plan.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/30'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {plan.badge}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </div>

                  <div>
                    <h4 className="font-black text-white text-xs sm:text-sm line-clamp-1">
                      {language === 'hi' ? plan.titleHi : plan.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {language === 'hi' ? plan.subtitleHi : plan.subtitleEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Veg Plan View */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {language === 'hi' ? currentVegPlan.titleHi : currentVegPlan.titleEn}
                </h3>
              </div>

              <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">{language === 'hi' ? 'कैलोरी' : 'Calories'}</span>
                  <span className="text-sm font-black text-white">{currentVegPlan.totalCalories} kcal</span>
                </div>
                <div className="w-px h-7 bg-slate-800" />
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">{language === 'hi' ? 'प्रोटीन' : 'Protein'}</span>
                  <span className="text-sm font-black text-emerald-400">{currentVegPlan.totalProteinGrams}g</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentVegPlan.meals.map((meal, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400">{meal.time}</span>
                      <h5 className="font-bold text-white text-xs sm:text-sm">
                        {language === 'hi' ? meal.mealNameHi : meal.mealNameEn}
                      </h5>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 block">{meal.totalMealProtein}g</span>
                      <span className="text-[10px] text-slate-400">{meal.totalMealCalories} kcal</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {meal.foodItems.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center justify-between gap-2 bg-slate-900/60 p-2 rounded-lg">
                        <div>
                          <span className="font-semibold text-white">{item.name}</span>
                          <span className="text-[11px] text-slate-400 block">{item.portion}</span>
                        </div>
                        <span className="text-amber-400 font-bold shrink-0">{item.proteinGrams}g</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: HIGH PROTEIN FOODS DIRECTORY ===================== */}
      {activeTab === 'foods' && (
        <div className="space-y-4">
          {/* Category Filter Pills & Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'hi' ? "फूड खोजें (उदा: पनीर, सोया, चना, ओट्स...)" : "Search food items (Paneer, Soya, Chana, Oats...)"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 whitespace-nowrap">
                {filteredFoods.length} {language === 'hi' ? 'खाद्य पदार्थ' : 'Items'}
              </span>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {(['all', 'veg', 'vegan', 'non-veg', 'supplements'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'all' && (language === 'hi' ? 'सभी (All)' : 'All Foods')}
                  {cat === 'veg' && (language === 'hi' ? '🌿 शाकाहारी (Veg)' : 'Vegetarian')}
                  {cat === 'vegan' && (language === 'hi' ? '🌱 वीगन (Plant)' : 'Vegan (Plant)')}
                  {cat === 'non-veg' && (language === 'hi' ? '🍗 मांसाहारी (Non-Veg)' : 'Non-Veg')}
                  {cat === 'supplements' && (language === 'hi' ? '⚡ सप्लीमेंट्स' : 'Supplements')}
                </button>
              ))}
            </div>
          </div>

          {/* Foods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredFoods.map(food => (
              <div 
                key={food.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-md transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      food.category === 'veg' || food.category === 'vegan'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : food.category === 'supplements'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                    {food.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition">{food.name}</h3>
                  <p className="text-[11px] text-slate-400">{food.hindiName.split('-')[0]}</p>

                  <div className="mt-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">100g</span>
                      <span className="text-base font-black text-amber-400">
                        {food.proteinPer100g}g <span className="text-xs font-normal text-slate-400">Protein</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Calories</span>
                      <span className="text-xs font-bold text-slate-300">{food.caloriesPer100g} kcal</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2">
                    <strong className="text-slate-300">{food.servingUnit}</strong> = <span className="text-amber-400 font-bold">{food.servingProtein}g</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedFoodForServing(food);
                      setServingGrams(food.defaultServingSize);
                    }}
                    className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1"
                  >
                    <Scale className="w-3 h-3" />
                    <span>{language === 'hi' ? 'मापें' : 'Measure'}</span>
                  </button>

                  <button
                    onClick={() => handleQuickAdd(food)}
                    className="py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{language === 'hi' ? 'जोड़ें' : 'Add'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: PROTEIN CALCULATOR ===================== */}
      {activeTab === 'calculator' && (
        <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
          <h3 className="font-black text-white text-base sm:text-lg text-center">
            {language === 'hi' ? 'प्रोटीन कैलकुलेटर' : 'Protein Calculator'}
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>{language === 'hi' ? 'वजन:' : 'Weight:'}</span>
                <span className="text-amber-400 font-black text-base">{userProfile.weightKg} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="130"
                value={userProfile.weightKg}
                onChange={(e) => {
                  const w = parseInt(e.target.value, 10);
                  const mult = userProfile.goal === 'muscle_gain' ? 2.0 : userProfile.goal === 'fat_loss' ? 2.2 : 1.4;
                  onUpdateProfile({
                    ...userProfile,
                    weightKg: w,
                    dailyProteinTargetGrams: Math.round(w * mult)
                  });
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl text-center space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                {language === 'hi' ? 'दैनिक लक्ष्य' : 'Daily Target'}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400">
                {userProfile.dailyProteinTargetGrams}g <span className="text-base text-slate-400 font-normal">/ {language === 'hi' ? 'दिन' : 'day'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Serving Modal */}
      {selectedFoodForServing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm">{selectedFoodForServing.name}</h4>
              <button 
                onClick={() => setSelectedFoodForServing(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>मात्रा (Serving in Grams):</span>
                <span className="text-amber-400 font-bold">{servingGrams}g</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[50, 75, 100, 150, 200].map(g => (
                  <button
                    key={g}
                    onClick={() => setServingGrams(g)}
                    className={`px-3 py-1.5 text-xs rounded-xl border cursor-pointer font-bold ${
                      servingGrams === g ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {g}g
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-amber-400">
                {Math.round(selectedFoodForServing.proteinPer100g * (servingGrams / 100) * 10) / 10}g प्रोटीन
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {Math.round(selectedFoodForServing.caloriesPer100g * (servingGrams / 100))} Calories
              </div>
            </div>

            <button
              onClick={handleCustomAdd}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm cursor-pointer shadow-md"
            >
              लॉग में जोड़ें (+ Add to Diet)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
