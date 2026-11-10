import { FoodItem, VegDietPlan } from '../types';

export const FOOD_DATABASE: FoodItem[] = [
  // ===================== HIGH-PROTEIN VEGETARIAN & VEGAN =====================
  {
    id: 'soya-chunks',
    name: 'Soya Chunks / Meal Maker',
    hindiName: 'सोया चंक्स (Soya Chunks) - सबसे सस्ता 52% प्रोटीन',
    category: 'vegan',
    proteinPer100g: 52.0,
    caloriesPer100g: 345,
    carbsPer100g: 33.0,
    fatsPer100g: 0.5,
    defaultServingSize: 50,
    servingUnit: '50g (सूखा / Raw)',
    servingProtein: 26.0,
    servingCalories: 172,
    bestTime: 'Lunch / Dinner',
    budgetFriendly: true,
    notes: 'Gym goers का सबसे सस्ता प्रोटीन (~₹15 में 26g प्रोटीन)। उबालकर पानी निचोड़ें, फिर सब्जी या पुलाव में बनाएं।',
    tags: ['Super High Protein', 'Budget Friendly', 'Plant Based', 'Lean']
  },
  {
    id: 'soya-granules',
    name: 'Soya Granules (Bhurji)',
    hindiName: 'सोया ग्रेन्यूल्स (Soya Bhurji)',
    category: 'vegan',
    proteinPer100g: 52.0,
    caloriesPer100g: 345,
    carbsPer100g: 33.0,
    fatsPer100g: 0.5,
    defaultServingSize: 50,
    servingUnit: '50g',
    servingProtein: 26.0,
    servingCalories: 172,
    bestTime: 'Breakfast / Lunch',
    budgetFriendly: true,
    notes: 'कीमा या भुर्जी स्टाइल में बनाने के लिए बेस्ट। 50 ग्राम में 26 ग्राम शुद्ध प्रोटीन।',
    tags: ['High Protein', 'Bhurji Style', 'Budget Friendly']
  },
  {
    id: 'paneer-raw',
    name: 'Fresh Cow / Buffalo Paneer',
    hindiName: 'ताज़ा पनीर (Fresh Cottage Cheese)',
    category: 'veg',
    proteinPer100g: 18.3,
    caloriesPer100g: 265,
    carbsPer100g: 4.5,
    fatsPer100g: 20.8,
    defaultServingSize: 100,
    servingUnit: '100g (ताज़ा पनीर)',
    servingProtein: 18.3,
    servingCalories: 265,
    bestTime: 'Dinner / Before Bed (Slow Digestion)',
    budgetFriendly: false,
    notes: 'कैसीन प्रोटीन से भरपूर। रात को सोने से पहले खाने से पूरी रात मसल रिकवरी होती है।',
    tags: ['Slow Digesting', 'Rich in Casein', 'High Calcium', 'Bulking']
  },
  {
    id: 'low-fat-paneer',
    name: 'Low Fat / Skimmed Milk Paneer',
    hindiName: 'लो-फैट पनीर (Low Fat Paneer)',
    category: 'veg',
    proteinPer100g: 25.0,
    caloriesPer100g: 160,
    carbsPer100g: 3.0,
    fatsPer100g: 4.0,
    defaultServingSize: 100,
    servingUnit: '100g',
    servingProtein: 25.0,
    servingCalories: 160,
    bestTime: 'Post-Workout / Dinner',
    budgetFriendly: false,
    notes: 'फैट कम और प्रोटीन ज्यादा (100g में 25g प्रोटीन)। कटिंग और फैट लॉस के लिए बेस्ट।',
    tags: ['High Protein', 'Low Fat', 'Fat Loss Friendly']
  },
  {
    id: 'tofu-soya-paneer',
    name: 'Tofu (Soya Paneer)',
    hindiName: 'टोफू (Tofu / Soya Paneer)',
    category: 'vegan',
    proteinPer100g: 15.0,
    caloriesPer100g: 120,
    carbsPer100g: 2.5,
    fatsPer100g: 6.0,
    defaultServingSize: 100,
    servingUnit: '100g',
    servingProtein: 15.0,
    servingCalories: 120,
    bestTime: 'Lunch / Dinner / Post-Workout',
    budgetFriendly: true,
    notes: 'पनीर के मुकाबले कम कैलोरी और फैट। लैक्टोज फ्री और 100% शाकाहारी।',
    tags: ['Low Calorie', 'Lactose Free', 'Vegan Favorite', 'Cutting']
  },
  {
    id: 'bhuna-chana',
    name: 'Roasted Chana (With Skin)',
    hindiName: 'भुना चना (Roasted Bengal Gram) - देसी सुपरफूड',
    category: 'vegan',
    proteinPer100g: 22.5,
    caloriesPer100g: 360,
    carbsPer100g: 58.0,
    fatsPer100g: 5.5,
    defaultServingSize: 60,
    servingUnit: '60g (1 कटोरी)',
    servingProtein: 13.5,
    servingCalories: 216,
    bestTime: 'Evening Snack / Pre-Workout',
    budgetFriendly: true,
    notes: 'सस्ता और कहीं भी खाने योग्य। हाई-फाइबर और कॉम्प्लेक्स कार्ब्स से भरपूर जो देर तक भूख नहीं लगने देते।',
    tags: ['Ready to Eat', 'Desi Superfood', 'Budget Friendly', 'High Fiber']
  },
  {
    id: 'chana-sattu',
    name: 'Chana Sattu (सत्तू ड्रिंक)',
    hindiName: 'चना सत्तू (Chana Sattu) - देसी व्हे प्रोटीन',
    category: 'vegan',
    proteinPer100g: 20.6,
    caloriesPer100g: 380,
    carbsPer100g: 64.0,
    fatsPer100g: 5.0,
    defaultServingSize: 50,
    servingUnit: '50g (3 बड़े चम्मच)',
    servingProtein: 10.3,
    servingCalories: 190,
    bestTime: 'Morning / Pre-Workout Drink',
    budgetFriendly: true,
    notes: 'पानी या छाछ में भुना जीरा, नींबू व नमक मिलाकर पिएं। पेट को ठंडा रखता है और नेचुरल स्टैमिना देता है।',
    tags: ['Desi Shake', 'Digestive', 'Instant Energy']
  },
  {
    id: 'moong-sprouts',
    name: 'Moong Dal Sprouts (Raw/Steamed)',
    hindiName: 'अंकुरित मूंग दाल (Moong Sprouts)',
    category: 'vegan',
    proteinPer100g: 24.0,
    caloriesPer100g: 340,
    carbsPer100g: 60.0,
    fatsPer100g: 1.2,
    defaultServingSize: 75,
    servingUnit: '75g (Raw Moong Dal अंकुरित)',
    servingProtein: 18.0,
    servingCalories: 255,
    bestTime: 'Morning Breakfast',
    budgetFriendly: true,
    notes: 'अंकुरित होने पर प्रोटीन का पाचन 30% बढ़ जाता है। इसमें नींबू, टमाटर और प्याज डालकर खाएं।',
    tags: ['Raw Living Food', 'Enzyme Rich', 'Breakfast King']
  },
  {
    id: 'kala-chana-boiled',
    name: 'Boiled Black Chana (काला चना)',
    hindiName: 'उबला काला चना (Boiled Kala Chana)',
    category: 'vegan',
    proteinPer100g: 19.0,
    caloriesPer100g: 378,
    carbsPer100g: 61.0,
    fatsPer100g: 6.0,
    defaultServingSize: 75,
    servingUnit: '75g (Raw equivalent)',
    servingProtein: 14.2,
    servingCalories: 283,
    bestTime: 'Breakfast / Pre-Workout',
    budgetFriendly: true,
    notes: 'प्राकृतिक आयरन और स्ट्रेंथ बूस्टर। पहलवानों का पसंदीदा देसी ऊर्जा स्रोत।',
    tags: ['High Iron', 'Endurance Booster', 'Desi Favorite']
  },
  {
    id: 'rajma-cooked',
    name: 'Rajma / Kidney Beans',
    hindiName: 'राजमा (Kidney Beans Curry)',
    category: 'vegan',
    proteinPer100g: 24.0,
    caloriesPer100g: 333,
    carbsPer100g: 60.0,
    fatsPer100g: 0.8,
    defaultServingSize: 80,
    servingUnit: '80g (Raw dry weight)',
    servingProtein: 19.2,
    servingCalories: 266,
    bestTime: 'Lunch with Brown Rice',
    budgetFriendly: true,
    notes: 'चावल के साथ खाने से इसका अमीनो एसिड प्रोफाइल पूरा (Complete Protein) हो जाता है।',
    tags: ['Complete Protein with Rice', 'Bulking', 'High Fiber']
  },
  {
    id: 'chole-chickpeas',
    name: 'Kabuli Chana / Chickpeas',
    hindiName: 'सफेद छोले (Kabuli Chana)',
    category: 'vegan',
    proteinPer100g: 19.0,
    caloriesPer100g: 364,
    carbsPer100g: 61.0,
    fatsPer100g: 6.0,
    defaultServingSize: 75,
    servingUnit: '75g (Dry weight)',
    servingProtein: 14.2,
    servingCalories: 273,
    bestTime: 'Lunch / Salad',
    budgetFriendly: true,
    notes: 'उबालकर चाट या ऑलिव ऑयल में सौते करके खाने से शानदार टेस्ट और प्रोटीन मिलता है।',
    tags: ['Plant Protein', 'Satiety', 'High Magnesium']
  },
  {
    id: 'besan-chilla',
    name: 'Besan Chilla (Gram Flour Pancakes)',
    hindiName: 'बेसन का चीला (Besan Chilla with Paneer)',
    category: 'veg',
    proteinPer100g: 22.0,
    caloriesPer100g: 387,
    carbsPer100g: 58.0,
    fatsPer100g: 6.7,
    defaultServingSize: 70,
    servingUnit: '2 चीले (70g बेसन)',
    servingProtein: 15.4,
    servingCalories: 270,
    bestTime: 'Breakfast / Evening Snack',
    budgetFriendly: true,
    notes: 'बेसन में प्याज, हरी मिर्च और ऊपर से 30g कद्दूकस पनीर डालकर बनाएं (20g+ प्रोटीन नाश्ता)।',
    tags: ['Indian Breakfast', 'High Protein Snack', 'Quick to Cook']
  },
  {
    id: 'dahi-curd',
    name: 'Fresh Curd / Dahi',
    hindiName: 'ताज़ा दही / छाछ (Curd / Buttermilk)',
    category: 'veg',
    proteinPer100g: 4.5,
    caloriesPer100g: 65,
    carbsPer100g: 4.7,
    fatsPer100g: 3.2,
    defaultServingSize: 200,
    servingUnit: '200g (1 बड़ी कटोरी)',
    servingProtein: 9.0,
    servingCalories: 130,
    bestTime: 'Lunch (Digestive Gut Health)',
    budgetFriendly: true,
    notes: 'नेचुरल प्रोबायोटिक। भारी प्रोटीन डाइट को आसानी से पचाने के लिए हर दोपहर 1 कटोरी दही खाएं।',
    tags: ['Probiotic', 'Gut Health', 'Digestive Aid']
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt / Hung Curd',
    hindiName: 'ग्रीक योगर्ट / चक्का दही (Hung Curd)',
    category: 'veg',
    proteinPer100g: 10.0,
    caloriesPer100g: 80,
    carbsPer100g: 3.6,
    fatsPer100g: 1.5,
    defaultServingSize: 150,
    servingUnit: '150g',
    servingProtein: 15.0,
    servingCalories: 120,
    bestTime: 'Snack / Post-Workout',
    budgetFriendly: false,
    notes: 'दही का पानी मलमल के कपड़े में छानकर घर पर बनाएं। गाढ़ा मलाईदार टेक्सचर और डबल प्रोटीन।',
    tags: ['Double Protein Dahi', 'Low Calorie', 'Snack']
  },
  {
    id: 'peanuts-roasted',
    name: 'Roasted Peanuts (मूंगफली)',
    hindiName: 'भुनी मूंगफली (Peanuts) - गरीबों का बादाम',
    category: 'vegan',
    proteinPer100g: 26.0,
    caloriesPer100g: 567,
    carbsPer100g: 16.0,
    fatsPer100g: 49.0,
    defaultServingSize: 35,
    servingUnit: '35g (1 मुट्ठी)',
    servingProtein: 9.1,
    servingCalories: 198,
    bestTime: 'Snack (Bulking calories)',
    budgetFriendly: true,
    notes: 'सस्ते दामों में 26% प्रोटीन और हेल्दी फैट्स। वजन और मसल बढ़ाने (Bulking) के लिए बेस्ट।',
    tags: ['Healthy Fats', 'Bulking Staple', 'Cheap & Nutritious']
  },
  {
    id: 'peanut-butter',
    name: 'Natural 100% Peanut Butter',
    hindiName: 'नेचुरल पीनट बटर (No Added Sugar)',
    category: 'vegan',
    proteinPer100g: 28.0,
    caloriesPer100g: 620,
    carbsPer100g: 15.0,
    fatsPer100g: 50.0,
    defaultServingSize: 32,
    servingUnit: '2 tbsp (32g)',
    servingProtein: 9.0,
    servingCalories: 198,
    bestTime: 'Pre-Workout with Banana / Toast',
    budgetFriendly: true,
    notes: 'ब्राउन ब्रेड या केले के साथ वर्कआउट से 1 घंटा पहले लें। लंबे वर्कआउट के लिए टिकाऊ ऊर्जा देता है।',
    tags: ['Healthy Fats', 'Pre-Workout Fuel', 'Mass Gainer']
  },
  {
    id: 'pumpkin-seeds',
    name: 'Pumpkin Seeds (कद्दू के बीज)',
    hindiName: 'कद्दू के बीज (Pumpkin Seeds) - टेस्टोस्टेरोन बूस्टर',
    category: 'vegan',
    proteinPer100g: 30.0,
    caloriesPer100g: 559,
    carbsPer100g: 10.7,
    fatsPer100g: 49.0,
    defaultServingSize: 30,
    servingUnit: '30g (2 चम्मच)',
    servingProtein: 9.0,
    servingCalories: 167,
    bestTime: 'Morning / Bedtime with Milk',
    budgetFriendly: false,
    notes: 'जिंक और मैग्नीशियम से भरपूर जो नेचुरल टेस्टोस्टेरोन और रात की गहरी नींद को बढ़ाते हैं।',
    tags: ['Zinc Rich', 'Testosterone Booster', 'Deep Sleep']
  },
  {
    id: 'chia-seeds',
    name: 'Chia Seeds',
    hindiName: 'चिया सीड्स (Chia Seeds) - ओमेगा-3 पावर',
    category: 'vegan',
    proteinPer100g: 17.0,
    caloriesPer100g: 486,
    carbsPer100g: 42.0,
    fatsPer100g: 31.0,
    defaultServingSize: 20,
    servingUnit: '20g (भिगोकर / Soaked)',
    servingProtein: 3.4,
    servingCalories: 97,
    bestTime: 'Morning Water / Oatmeal',
    budgetFriendly: false,
    notes: 'पानी में 15 मिनट भिगोकर पिएं। जोड़ों के दर्द से बचाव और ओमेगा-3 फैटी एसिड्स का बेहतरीन सोर्स।',
    tags: ['Omega 3', 'Joint Health', 'Hydration Gel']
  },
  {
    id: 'cow-milk',
    name: 'Full Cream / Cow Milk',
    hindiName: 'देसी गाय का दूध (Cow Milk)',
    category: 'veg',
    proteinPer100g: 3.4,
    caloriesPer100g: 62,
    carbsPer100g: 4.8,
    fatsPer100g: 3.5,
    defaultServingSize: 250,
    servingUnit: '1 बड़ा ग्लास (250ml)',
    servingProtein: 8.5,
    servingCalories: 155,
    bestTime: 'Morning / Night with Ashwagandha',
    budgetFriendly: true,
    notes: 'व्हे और कैसीन दोनों का प्राकृतिक मिश्रण। रात को हल्दी या अश्वगंधा के साथ लेने से तेजी से रिकवरी होती है।',
    tags: ['Natural Blend', 'Calcium Power', 'Bedtime Ritual']
  },
  {
    id: 'rolled-oats',
    name: 'Rolled Oats (जई)',
    hindiName: 'रोल्ड ओट्स (Rolled Oats)',
    category: 'vegan',
    proteinPer100g: 13.5,
    caloriesPer100g: 389,
    carbsPer100g: 66.0,
    fatsPer100g: 6.9,
    defaultServingSize: 60,
    servingUnit: '60g',
    servingProtein: 8.1,
    servingCalories: 233,
    bestTime: 'Breakfast / Pre-Workout',
    budgetFriendly: true,
    notes: 'कॉम्प्लेक्स कार्ब्स और बीटा-ग्लूकन फाइबर। दूध, पीनट बटर और केले के साथ हाई-प्रोटीन दलिया बनाएं।',
    tags: ['Slow Burning Fuel', 'Heart Healthy', 'Gym Breakfast']
  },

  // ===================== NON-VEG & SUPPLEMENTS =====================
  {
    id: 'chicken-breast',
    name: 'Raw Chicken Breast (Skinless)',
    hindiName: 'चिकन ब्रेस्ट (Chicken Breast) - गोल्ड स्टैंडर्ड',
    category: 'non-veg',
    proteinPer100g: 31.0,
    caloriesPer100g: 165,
    carbsPer100g: 0.0,
    fatsPer100g: 3.6,
    defaultServingSize: 150,
    servingUnit: '150g',
    servingProtein: 46.5,
    servingCalories: 247,
    bestTime: 'Lunch / Dinner / Post-Workout',
    budgetFriendly: false,
    notes: 'लीन बॉडी और फैट लॉस के लिए सबसे शुद्ध प्रोटीन सोर्स। 0 ग्राम कार्ब्स।',
    tags: ['Lean Muscle Gold', 'Zero Carbs', 'Ultra High Protein']
  },
  {
    id: 'whole-eggs',
    name: 'Whole Boiled Eggs',
    hindiName: 'साबुत उबले अंडे (Whole Eggs)',
    category: 'non-veg',
    proteinPer100g: 13.0,
    caloriesPer100g: 155,
    carbsPer100g: 1.1,
    fatsPer100g: 11.0,
    defaultServingSize: 100,
    servingUnit: '2 बड़े अंडे (100g)',
    servingProtein: 13.0,
    servingCalories: 155,
    bestTime: 'Breakfast / Post-Workout',
    budgetFriendly: true,
    notes: 'अंडे की जर्दी में कोलीन, विटामिन D और हेल्दी कोलेस्ट्रॉल होता है जो टेस्टोस्टेरोन बनाता है।',
    tags: ['Complete Bioavailability', 'Cheap Protein', 'Testosterone Boost']
  },
  {
    id: 'egg-whites',
    name: 'Egg Whites (Boiled)',
    hindiName: 'अंडे का सफेद भाग (Egg Whites)',
    category: 'non-veg',
    proteinPer100g: 11.0,
    caloriesPer100g: 52,
    carbsPer100g: 0.7,
    fatsPer100g: 0.2,
    defaultServingSize: 100,
    servingUnit: '3 अंडों की सफेदी (100g)',
    servingProtein: 11.0,
    servingCalories: 52,
    bestTime: 'Anytime / Pre-Bed / Post-Workout',
    budgetFriendly: true,
    notes: 'शुद्ध एल्ब्यूमिन प्रोटीन, 0 फैट, न्यूनतम कैलोरी। कटिंग फेज के लिए बेस्ट।',
    tags: ['Pure Albumin', 'Zero Fat', 'Calorie Friendly']
  },
  {
    id: 'whey-protein',
    name: 'Whey Protein Concentrate / Isolate',
    hindiName: 'व्हे प्रोटीन (100% Whey Protein)',
    category: 'supplements',
    proteinPer100g: 80.0,
    caloriesPer100g: 400,
    carbsPer100g: 6.0,
    fatsPer100g: 4.0,
    defaultServingSize: 30,
    servingUnit: '1 Scoop (30g powder)',
    servingProtein: 24.5,
    servingCalories: 120,
    bestTime: 'Post-Workout (immediately within 45 mins)',
    budgetFriendly: false,
    notes: 'सबसे तेजी से पचने वाला प्रोटीन। वर्कआउट के बाद मसल डैमेज रिपेयर करने के लिए बेस्ट।',
    tags: ['Fast Absorbing', 'Post-Workout Gold', 'Convenient']
  }
];

// ===================== DEDICATED VEGETARIAN DIET PLANS =====================
export const VEG_DIET_PLANS: VegDietPlan[] = [
  {
    id: 'veg-muscle-bulking',
    titleEn: 'Veg Muscle Mass & Bulking Plan',
    titleHi: 'शाकाहारी मसल मास और बल्किंग प्लान',
    subtitleEn: 'High Calorie, 140g+ Pure Vegetarian Protein for Muscle Size',
    subtitleHi: 'वजन और मांसपेशियों का साइज बढ़ाने के लिए 140g+ शाकाहारी प्रोटीन',
    targetGoal: 'Bulking',
    badge: '3000 Kcal • 145g Protein',
    totalCalories: 2980,
    totalProteinGrams: 145,
    descriptionEn: 'Designed for skinny individuals or hardgainers looking to pack on thick muscle mass without non-veg or eggs.',
    descriptionHi: 'दुबले-पतले लोगों और जिम में भारी वजन उठाने वालों के लिए बिना अंडे या मांस के 145g शुद्ध प्रोटीन वाला बल्किंग प्लान।',
    meals: [
      {
        mealNameEn: 'Meal 1: Morning Power Breakfast',
        mealNameHi: 'मील 1: सुबह का दमदार नाश्ता (8:00 AM)',
        time: '8:00 AM',
        foodItems: [
          { name: 'Oats cooked in Cow Milk (250ml)', portion: '70g Oats + 250ml Milk', proteinGrams: 18, calories: 380 },
          { name: 'Natural Peanut Butter', portion: '2 tbsp (32g)', proteinGrams: 9, calories: 198 },
          { name: 'Banana + Almonds', portion: '1 Banana + 10 Badam', proteinGrams: 3, calories: 170 }
        ],
        totalMealProtein: 30,
        totalMealCalories: 748,
        tips: 'ओट्स को दूध में पकाएं, ऊपर से पीनट बटर और केला काटकर डालें। यह लंबे समय तक ताकत देगा।'
      },
      {
        mealNameEn: 'Meal 2: Mid-Morning Snack',
        mealNameHi: 'मील 2: दोपहर पूर्व स्नैक (11:00 AM)',
        time: '11:00 AM',
        foodItems: [
          { name: 'Moong Dal Sprouts + Boiled Kala Chana', portion: '1 Bowl (100g sprouted)', proteinGrams: 16, calories: 230 },
          { name: 'Lemon, Onion & Tomato Salad', portion: '1 Plate', proteinGrams: 1, calories: 40 }
        ],
        totalMealProtein: 17,
        totalMealCalories: 270,
        tips: 'अंकुरित मूंग में नींबू निचोड़ें ताकि विटामिन सी से आयरन और प्रोटीन का अवशोषण बढ़ सके।'
      },
      {
        mealNameEn: 'Meal 3: Heavy Gym Lunch',
        mealNameHi: 'मील 3: दोपहर का मुख्य भोजन (2:00 PM)',
        time: '2:00 PM',
        foodItems: [
          { name: 'Soya Chunks Curry (50g raw soya)', portion: '1 Big Bowl', proteinGrams: 26, calories: 210 },
          { name: 'Cooked Rajma or Dal', portion: '1 Katori (150g)', proteinGrams: 9, calories: 160 },
          { name: 'Brown / White Rice or 3 Rotis', portion: '200g Rice or 3 Roti', proteinGrams: 7, calories: 260 },
          { name: 'Fresh Curd / Dahi', portion: '1 Bowl (150g)', proteinGrams: 6, calories: 95 }
        ],
        totalMealProtein: 48,
        totalMealCalories: 725,
        tips: 'सोया चंक्स को 10 मिनट उबालकर पानी अच्छी तरह निचोड़ लें ताकि टेस्ट और प्रोटीन दोनों बढ़ जाएं।'
      },
      {
        mealNameEn: 'Meal 4: Pre-Workout Fuel',
        mealNameHi: 'मील 4: वर्कआउट से पहले (5:30 PM)',
        time: '5:30 PM',
        foodItems: [
          { name: 'Roasted Bhuna Chana', portion: '50g', proteinGrams: 11, calories: 180 },
          { name: 'Banana + Black Coffee (Sugar free)', portion: '1 Banana + 1 Cup Coffee', proteinGrams: 1, calories: 105 }
        ],
        totalMealProtein: 12,
        totalMealCalories: 285,
        tips: 'जिम जाने से 45 मिनट पहले लें। ब्लैक कॉफी कैफीन पंप देगी और चना स्थिर ऊर्जा देगा।'
      },
      {
        mealNameEn: 'Meal 5: Post-Workout Recovery Dinner',
        mealNameHi: 'मील 5: वर्कआउट के बाद का डिनर (8:30 PM)',
        time: '8:30 PM',
        foodItems: [
          { name: 'Fresh Paneer Bhurji', portion: '100g Paneer', proteinGrams: 18, calories: 265 },
          { name: 'Whole Wheat Roti', portion: '2 Rotis', proteinGrams: 6, calories: 180 },
          { name: 'Mixed Green Salad (Cucumber, Beetroot)', portion: '1 Plate', proteinGrams: 1, calories: 50 }
        ],
        totalMealProtein: 25,
        totalMealCalories: 495,
        tips: 'पनीर में थोड़ा जीरा, हल्दी और टमाटर डालकर हल्की भुर्जी बनाएं। यह पचने में आसान होती है।'
      },
      {
        mealNameEn: 'Meal 6: Bedtime Casein Recovery',
        mealNameHi: 'मील 6: सोने से पहले (10:30 PM)',
        time: '10:30 PM',
        foodItems: [
          { name: 'Warm Cow Milk with Haldi & Ashwagandha', portion: '1 Glass (250ml)', proteinGrams: 8, calories: 155 },
          { name: 'Pumpkin Seeds (Testosterone Booster)', portion: '20g', proteinGrams: 5, calories: 110 }
        ],
        totalMealProtein: 13,
        totalMealCalories: 265,
        tips: 'रात भर धीमी गति से प्रोटीन रिलीज (Slow-digesting Casein) होता है जिससे रात में मसल्स टूटती नहीं हैं।'
      }
    ]
  },
  {
    id: 'veg-lean-fitness',
    titleEn: 'Veg Lean Athletic & Fitness Plan',
    titleHi: 'शाकाहारी लीन फिटनेस व एथलेटिक प्लान',
    subtitleEn: 'Clean Carbs & 120g Protein for Flat Belly and Muscular Frame',
    subtitleHi: 'सिक्स पैक व लीन मांसपेशियों के लिए 120g शुद्ध शाकाहारी प्रोटीन',
    targetGoal: 'Fitness',
    badge: '2200 Kcal • 122g Protein',
    totalCalories: 2180,
    totalProteinGrams: 122,
    descriptionEn: 'Ideal for those wanting an athletic, fit body without excess body fat. Balances high protein with complex carbs and fiber.',
    descriptionHi: 'जो लोग चर्बी बढ़ाए बिना फिट, एक्टिव और आकर्षक बॉडी चाहते हैं, उनके लिए संतुलित शाकाहारी डाइट प्लान।',
    meals: [
      {
        mealNameEn: 'Meal 1: High-Protein Besan Paneer Chilla',
        mealNameHi: 'मील 1: बेसन-पनीर चीला (8:30 AM)',
        time: '8:30 AM',
        foodItems: [
          { name: 'Besan Chilla stuffed with 50g Paneer', portion: '2 Chillas (60g Besan + 50g Paneer)', proteinGrams: 23, calories: 340 },
          { name: 'Green Mint Chutney', portion: '2 tbsp', proteinGrams: 1, calories: 30 }
        ],
        totalMealProtein: 24,
        totalMealCalories: 370,
        tips: 'चीले में पनीर की स्टफिंग करने से नाश्ते में ही 24 ग्राम प्रोटीन मिल जाता है।'
      },
      {
        mealNameEn: 'Meal 2: Midday Hydration Snack',
        mealNameHi: 'मील 2: फ्रूट व सीड्स स्नैक (11:30 AM)',
        time: '11:30 AM',
        foodItems: [
          { name: 'Apple / Papaya + Chia Seeds soaked', portion: '1 Fruit + 15g Chia', proteinGrams: 4, calories: 150 },
          { name: 'Buttermilk / Chhachh with roasted Jeera', portion: '1 Glass (250ml)', proteinGrams: 4, calories: 50 }
        ],
        totalMealProtein: 8,
        totalMealCalories: 200,
        tips: 'छाछ पाचन को दुरुस्त रखती है और शरीर को हाइड्रेट रखती है।'
      },
      {
        mealNameEn: 'Meal 3: Clean Fitness Lunch',
        mealNameHi: 'मील 3: दोपहर का लीन लंच (2:00 PM)',
        time: '2:00 PM',
        foodItems: [
          { name: 'Soya Chunks Stir-fry with Veggies', portion: '50g Raw Soya + Shimla Mirch/Pyaz', proteinGrams: 26, calories: 215 },
          { name: 'Thick Moong Dal / Toor Dal', portion: '1 Katori (150g)', proteinGrams: 8, calories: 140 },
          { name: 'Multi-grain Roti', portion: '2 Rotis', proteinGrams: 6, calories: 170 },
          { name: 'Cucumber & Tomato Salad', portion: '1 Plate', proteinGrams: 1, calories: 40 }
        ],
        totalMealProtein: 41,
        totalMealCalories: 565,
        tips: 'सोया चंक्स को कम तेल में सब्जियों के साथ सॉते करें। यह बहुत क्रिस्पी और टेस्टी बनता है।'
      },
      {
        mealNameEn: 'Meal 4: Pre-Workout Energy',
        mealNameHi: 'मील 4: प्री-वर्कआउट स्नैक (5:30 PM)',
        time: '5:30 PM',
        foodItems: [
          { name: 'Chana Sattu Sharbat (Namkeen)', portion: '40g Sattu in cold water', proteinGrams: 8, calories: 150 },
          { name: '1 Small Banana', portion: '1 Banana', proteinGrams: 1, calories: 85 }
        ],
        totalMealProtein: 9,
        totalMealCalories: 235,
        tips: 'सत्तू नेचुरल इलेक्ट्रोलाइट्स और ग्लूकोज देता है, जिससे वर्कआउट में थकावट नहीं होती।'
      },
      {
        mealNameEn: 'Meal 5: Post-Workout Light Dinner',
        mealNameHi: 'मील 5: हल्का रात का खाना (8:30 PM)',
        time: '8:30 PM',
        foodItems: [
          { name: 'Tofu or Low-Fat Paneer Grilled', portion: '120g Tofu / Low Fat Paneer', proteinGrams: 24, calories: 180 },
          { name: 'Steamed Mixed Veggies / Clear Soup', portion: '1 Bowl', proteinGrams: 3, calories: 80 },
          { name: '1 Small Whole Wheat Phulka', portion: '1 Roti', proteinGrams: 3, calories: 85 }
        ],
        totalMealProtein: 30,
        totalMealCalories: 345,
        tips: 'रात को कार्ब्स कम रखें ताकि सोते समय ग्रोथ हॉर्मोन और फैट बर्निंग सक्रिय रहे।'
      },
      {
        mealNameEn: 'Meal 6: Calming Milk',
        mealNameHi: 'मील 6: सोने से पहले (10:30 PM)',
        time: '10:30 PM',
        foodItems: [
          { name: 'Skimmed Milk with Cinnamon', portion: '1 Glass (200ml)', proteinGrams: 7, calories: 95 },
          { name: 'Pumpkin Seeds', portion: '10g', proteinGrams: 3, calories: 55 }
        ],
        totalMealProtein: 10,
        totalMealCalories: 150,
        tips: 'दालचीनी ब्लड शुगर को नियंत्रित रखती है और गहरी नींद लाती है।'
      }
    ]
  },
  {
    id: 'veg-fat-loss',
    titleEn: 'Veg Fat Loss & Shredding Plan',
    titleHi: 'शाकाहारी फैट लॉस व पेट की चर्बी घटाने का प्लान',
    subtitleEn: 'Calorie Deficit with High Satiety 105g+ Protein for Six-Pack Cut',
    subtitleHi: 'कम कैलोरी (1650 Kcal) लेकिन 105g+ प्रोटीन ताकि सिर्फ चर्बी घटे, मसल नहीं',
    targetGoal: 'Fat Loss',
    badge: '1650 Kcal • 108g Protein',
    totalCalories: 1640,
    totalProteinGrams: 108,
    descriptionEn: 'High-protein calorie deficit diet to burn belly fat while preserving muscle mass using low-fat paneer, sprouts, tofu, and soya.',
    descriptionHi: 'अगर आपका वजन ज्यादा है या पेट पर चर्बी है, तो यह डाइट प्लान भूख लगे बिना चर्बी पिघलाने में मदद करेगा।',
    meals: [
      {
        mealNameEn: 'Meal 1: Green High-Protein Breakfast',
        mealNameHi: 'मील 1: अंकुरित मूंग व चना चाट (8:30 AM)',
        time: '8:30 AM',
        foodItems: [
          { name: 'Steamed Moong Sprouts + Kala Chana', portion: '120g Sprouts Mix', proteinGrams: 20, calories: 230 },
          { name: 'Lemon, Ginger & Green Chili Salad', portion: '1 Plate', proteinGrams: 1, calories: 30 },
          { name: 'Green Tea (No Sugar)', portion: '1 Cup', proteinGrams: 0, calories: 2 }
        ],
        totalMealProtein: 21,
        totalMealCalories: 262,
        tips: 'स्प्राउट्स को 2 मिनट भाप में पकाएं ताकि गैस या ब्लोटिंग की समस्या न हो।'
      },
      {
        mealNameEn: 'Meal 2: Mid-Morning Metabolism Drink',
        mealNameHi: 'मील 2: जीरा छाछ (11:30 AM)',
        time: '11:30 AM',
        foodItems: [
          { name: 'Low Fat Curd Buttermilk with Chia', portion: '300ml Chaas + 10g Chia', proteinGrams: 7, calories: 95 }
        ],
        totalMealProtein: 7,
        totalMealCalories: 95,
        tips: 'जीरा छाछ भूख को शांत रखती है और अनहेल्दी स्नैकिंग से बचाती है।'
      },
      {
        mealNameEn: 'Meal 3: Soya & Veggie Low-Carb Lunch',
        mealNameHi: 'मील 3: हाई-प्रोटीन लंच (2:00 PM)',
        time: '2:00 PM',
        foodItems: [
          { name: 'Boiled Soya Chunks sauteed with Veggies', portion: '45g Soya Raw', proteinGrams: 23, calories: 155 },
          { name: '1 Multi-grain Roti (No Ghee/Butter)', portion: '1 Roti', proteinGrams: 3, calories: 85 },
          { name: 'Large Salad (Kakdi, Kheera, Tamatar)', portion: '1 Large Bowl', proteinGrams: 2, calories: 45 }
        ],
        totalMealProtein: 28,
        totalMealCalories: 285,
        tips: 'खाने से पहले आधा सलाद खा लें, इससे पेट भर जाएगा और ओवरईटिंग नहीं होगी।'
      },
      {
        mealNameEn: 'Meal 4: Pre-Workout Fat Burn Fuel',
        mealNameHi: 'मील 4: भुना चना व ब्लैक कॉफी (5:30 PM)',
        time: '5:30 PM',
        foodItems: [
          { name: 'Roasted Bhuna Chana with peel', portion: '40g', proteinGrams: 9, calories: 144 },
          { name: 'Black Coffee with Lemon', portion: '1 Cup', proteinGrams: 0, calories: 5 }
        ],
        totalMealProtein: 9,
        totalMealCalories: 149,
        tips: 'ब्लैक कॉफी वर्कआउट के दौरान फैट मोबिलाइजेशन और कैलोरी बर्न को 15% बढ़ा देती है।'
      },
      {
        mealNameEn: 'Meal 5: Shredding Dinner (Zero Refined Carbs)',
        mealNameHi: 'मील 5: टोफू / लो-फैट पनीर सलाद (8:30 PM)',
        time: '8:30 PM',
        foodItems: [
          { name: 'Grilled Tofu or Low Fat Paneer', portion: '150g Tofu / 120g Low Fat Paneer', proteinGrams: 25, calories: 190 },
          { name: 'Broccoli, Capsicum & Onion Stir-fry', portion: '1 Bowl with oregano', proteinGrams: 4, calories: 75 }
        ],
        totalMealProtein: 29,
        totalMealCalories: 265,
        tips: 'रात को रोटी/चावल पूरी तरह बंद रखें। सिर्फ ग्रिल्ड टोफू/पनीर और हरी सब्जियां खाएं।'
      },
      {
        mealNameEn: 'Meal 6: Chamomile Tea / Warm Turmeric Water',
        mealNameHi: 'मील 6: सोने से पहले (10:30 PM)',
        time: '10:30 PM',
        foodItems: [
          { name: 'Warm Water with Turmeric & 5 Soaked Almonds', portion: '1 Glass + 5 Badam', proteinGrams: 2, calories: 40 }
        ],
        totalMealProtein: 2,
        totalMealCalories: 40,
        tips: 'रात को पर्याप्त नींद लें। 7-8 घंटे की गहरी नींद के बिना फैट लॉस कभी नहीं होता।'
      }
    ]
  },
  {
    id: 'veg-budget-student',
    titleEn: 'Desi Student Budget Veg Plan (Under ₹80/Day)',
    titleHi: 'देसी स्टूडेंट बजट प्लान (रोज ₹80 से कम में 110g प्रोटीन)',
    subtitleEn: 'High Protein Indian Diet Without Expensive Powders or Avocados',
    subtitleHi: 'बिना किसी महंगे सप्लीमेंट के घर के आम खाने से 110g+ प्रोटीन',
    targetGoal: 'Budget Student',
    badge: '₹75/Day • 112g Protein',
    totalCalories: 2450,
    totalProteinGrams: 112,
    descriptionEn: 'Specially crafted for college students and hostelers on a tight budget. Relies on Kala Chana, Soya, Roasted Gram, Curd, and Peanuts.',
    descriptionHi: 'हॉस्टल और कॉलेज के लड़कों के लिए सबसे किफायती प्लान। सोया चंक्स (₹10), भुना चना (₹15), दूध (₹15), दही (₹10) और दालों से भरपूर।',
    meals: [
      {
        mealNameEn: 'Meal 1: Morning Kala Chana & Milk',
        mealNameHi: 'मील 1: उबला काला चना व दूध (8:00 AM)',
        time: '8:00 AM',
        foodItems: [
          { name: 'Boiled Kala Chana with onion & lemon', portion: '80g dry boiled', proteinGrams: 15, calories: 300 },
          { name: 'Cow Milk from dairy', portion: '250ml', proteinGrams: 8, calories: 150 }
        ],
        totalMealProtein: 23,
        totalMealCalories: 450,
        tips: 'रात को चना भिगो दें, सुबह 10 मिनट उबालकर नमक-नींबू डालें। खर्च मात्र ₹15।'
      },
      {
        mealNameEn: 'Meal 2: Mid-Day Desi Energy',
        mealNameHi: 'मील 2: भुना चना स्नैक (11:30 AM)',
        time: '11:30 AM',
        foodItems: [
          { name: 'Roasted Bhuna Chana with skin', portion: '50g', proteinGrams: 11, calories: 180 }
        ],
        totalMealProtein: 11,
        totalMealCalories: 180,
        tips: 'जेब में या बैग में रखकर कॉलेज में खाएं। ₹10 में 11 ग्राम प्रोटीन।'
      },
      {
        mealNameEn: 'Meal 3: Mess / Home Lunch',
        mealNameHi: 'मील 3: दोपहर का लंच (2:00 PM)',
        time: '2:00 PM',
        foodItems: [
          { name: 'Soya Chunks Sabzi (Made in room/mess)', portion: '50g raw soya', proteinGrams: 26, calories: 172 },
          { name: 'Mess Dal', portion: '1 Katori', proteinGrams: 6, calories: 120 },
          { name: 'Rotis', portion: '3 Rotis', proteinGrams: 8, calories: 240 },
          { name: 'Packaged / Dairy Dahi', portion: '100g', proteinGrams: 4, calories: 65 }
        ],
        totalMealProtein: 44,
        totalMealCalories: 597,
        tips: 'सोया चंक्स का 200g पैकेट सिर्फ ₹45-50 में आता है जो 4 दिन चलता है।'
      },
      {
        mealNameEn: 'Meal 4: Pre-Workout Desi Sattu Shake',
        mealNameHi: 'मील 4: देसी सत्तू शेक (5:30 PM)',
        time: '5:30 PM',
        foodItems: [
          { name: 'Chana Sattu in water + roasted Jeera', portion: '50g Sattu', proteinGrams: 10, calories: 190 },
          { name: 'Roasted Peanuts (Mungfali)', portion: '25g', proteinGrams: 7, calories: 140 }
        ],
        totalMealProtein: 17,
        totalMealCalories: 330,
        tips: 'सत्तू किसी भी सप्लीमेंट से बेहतर और शुद्ध देसी प्राकृतिक ऊर्जा देता है।'
      },
      {
        mealNameEn: 'Meal 5: Dinner with Mess Food',
        mealNameHi: 'मील 5: रात का खाना (8:30 PM)',
        time: '8:30 PM',
        foodItems: [
          { name: 'Mixed Dal / Rajma / Chole', portion: '1 Big Bowl (200g)', proteinGrams: 11, calories: 200 },
          { name: 'Rotis or Rice', portion: '2 Rotis + Rice', proteinGrams: 6, calories: 220 }
        ],
        totalMealProtein: 17,
        totalMealCalories: 420,
        tips: 'दाल में थोड़ा ज्यादा पानी न लें, गाढ़ी दाल मांगें।'
      }
    ]
  }
];
