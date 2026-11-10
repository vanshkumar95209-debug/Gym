import React, { useState } from 'react';
import { 
  Droplets, 
  Plus, 
  Minus, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Award,
  Zap,
  Info
} from 'lucide-react';
import { DailyWaterLog, WaterScheduleSlot, AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface WaterTrackerProps {
  waterLog: DailyWaterLog;
  onUpdateWaterLog: (log: DailyWaterLog) => void;
  language: AppLanguage;
  userWeightKg?: number;
}

const WATER_SLOTS: WaterScheduleSlot[] = [
  {
    id: 'slot-morning',
    timeSlot: '07:00 AM - 08:00 AM',
    labelEn: 'Wake Up (Empty Stomach)',
    labelHi: 'सुबह उठते ही (खाली पेट)',
    targetGlasses: 2,
    amountMl: 500,
    reasonEn: 'Rehydrates internal organs after 8h sleep, flushes kidney toxins, and boosts resting metabolism by 24%.',
    reasonHi: '8 घंटे की नींद के बाद शरीर को रीहाइड्रेट करता है, पेट साफ करता है और मेटाबॉलिज्म को 24% तक तेज करता है।'
  },
  {
    id: 'slot-pre-lunch',
    timeSlot: '01:30 PM (30m Before Lunch)',
    labelEn: '30 Mins Before Lunch',
    labelHi: 'दोपहर के खाने से 30 मिनट पहले',
    targetGlasses: 1,
    amountMl: 250,
    reasonEn: 'Prepares stomach lining for digestion and prevents overeating. (Wait 45 mins AFTER lunch before drinking).',
    reasonHi: 'पाचन तंत्र को सक्रिय करता है और ओवरईटिंग से बचाता है। (खाना खाने के तुरंत बाद पानी न पिएं, 45 मिनट रुकें)।'
  },
  {
    id: 'slot-pre-workout',
    timeSlot: '05:00 PM (45m Before Gym)',
    labelEn: 'Pre-Workout Hydration',
    labelHi: 'वर्कआउट से 45 मिनट पहले',
    targetGlasses: 2,
    amountMl: 500,
    reasonEn: 'Fills muscle cells with water (hyper-hydration) to maintain high lifting strength and prevent muscle cramps.',
    reasonHi: 'मांसपेशियों में पानी भरता है जिससे वर्कआउट में भारी वजन उठाते समय क्रैम्प्स (ऐंठन) नहीं आते और पंप अच्छा मिलता है।'
  },
  {
    id: 'slot-intra-workout',
    timeSlot: '06:00 PM - 07:00 PM (Gym Time)',
    labelEn: 'During Workout (Small Sips)',
    labelHi: 'वर्कआउट के दौरान (छोटे घूंट)',
    targetGlasses: 2,
    amountMl: 500,
    reasonEn: 'Take small sips between heavy sets to replenish sweat loss without feeling stomach fullness.',
    reasonHi: 'सेट्स के बीच 1-2 घूंट पानी पिएं। एक साथ ज्यादा पानी न पिएं ताकि पेट भारी न लगे और पसीने की भरपाई हो सके।'
  },
  {
    id: 'slot-post-workout',
    timeSlot: '07:15 PM (After Gym)',
    labelEn: 'Post-Workout Recovery',
    labelHi: 'वर्कआउट के तुरंत बाद (रिकवरी)',
    targetGlasses: 2,
    amountMl: 500,
    reasonEn: 'Flushes lactic acid buildup, lowers core temperature, and speeds amino acid delivery to muscles.',
    reasonHi: 'लैक्टिक एसिड को बाहर निकालता है, शरीर का तापमान सामान्य करता है और प्रोटीन को मसल्स तक तेजी से पहुंचाता है।'
  },
  {
    id: 'slot-pre-dinner',
    timeSlot: '08:00 PM (30m Before Dinner)',
    labelEn: '30 Mins Before Dinner',
    labelHi: 'रात के खाने से 30 मिनट पहले',
    targetGlasses: 1,
    amountMl: 250,
    reasonEn: 'Lubricates digestive tract and prevents late evening heaviness.',
    reasonHi: 'पाचन नलिका को सुगम बनाता है और रात को भारीपन से बचाता है।'
  },
  {
    id: 'slot-pre-bed',
    timeSlot: '10:00 PM (1h Before Sleep)',
    labelEn: '1 Hour Before Bed',
    labelHi: 'सोने से 1 घंटा पहले',
    targetGlasses: 1,
    amountMl: 250,
    reasonEn: 'Prevents nocturnal dehydration, keeps blood circulation optimal, and avoids late-night cramps.',
    reasonHi: 'रात को ब्लड सर्कुलेशन सही रखता है और सोते समय मांसपेशियों में खिंचाव या सिरदर्द से बचाता है।'
  }
];

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  waterLog,
  onUpdateWaterLog,
  language,
  userWeightKg = 70
}) => {
  const t = TRANSLATIONS[language];
  const glassSizeMl = 250;
  
  // Calculate recommended target: 35ml per kg + 500ml gym buffer
  const calculatedTargetMl = Math.round((userWeightKg * 35 + 500) / 250) * 250;
  const targetGlasses = Math.max(12, Math.round(calculatedTargetMl / glassSizeMl)); // min 12 glasses (3L)
  
  const consumedMl = waterLog.glassesDrank * glassSizeMl;
  const targetMl = targetGlasses * glassSizeMl;
  const percentage = Math.min(100, Math.round((consumedMl / targetMl) * 100));

  const handleAddGlass = (count: number) => {
    const nextGlasses = Math.max(0, waterLog.glassesDrank + count);
    onUpdateWaterLog({
      ...waterLog,
      glassesDrank: nextGlasses
    });
  };

  const handleReset = () => {
    onUpdateWaterLog({
      ...waterLog,
      glassesDrank: 0,
      completedSlots: []
    });
  };

  const handleToggleSlot = (slotId: string, slotGlasses: number) => {
    const isCompleted = waterLog.completedSlots?.includes(slotId);
    let nextCompleted: string[];
    let nextGlasses = waterLog.glassesDrank;

    if (isCompleted) {
      nextCompleted = (waterLog.completedSlots || []).filter(id => id !== slotId);
      nextGlasses = Math.max(0, nextGlasses - slotGlasses);
    } else {
      nextCompleted = [...(waterLog.completedSlots || []), slotId];
      nextGlasses = nextGlasses + slotGlasses;
    }

    onUpdateWaterLog({
      ...waterLog,
      glassesDrank: nextGlasses,
      completedSlots: nextCompleted
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner / Progress Card */}
      <div className="bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left summary */}
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Droplets className="w-3.5 h-3.5" />
              <span>{t.waterIntakeTitle}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {consumedMl.toLocaleString()} <span className="text-cyan-400 text-lg sm:text-xl font-bold">/ {targetMl.toLocaleString()} ml</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm">
              {waterLog.glassesDrank} {language === 'hi' ? 'ग्लास पिए' : 'glasses drank'} ({percentage}% {language === 'hi' ? 'दैनिक लक्ष्य पूरा' : 'daily target completed'})
            </p>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-800 overflow-hidden mt-3 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Right: Glass Quick Tracker buttons */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-3 w-full md:w-auto shrink-0 shadow-lg">
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => handleAddGlass(1)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+1 Glass (250ml)</span>
              </button>

              <button
                onClick={() => handleAddGlass(2)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+2 Bottle (500ml)</span>
              </button>
            </div>

            <div className="flex items-center justify-between w-full gap-2 text-xs text-slate-400">
              <button
                onClick={() => handleAddGlass(-1)}
                disabled={waterLog.glassesDrank <= 0}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 cursor-pointer transition flex items-center gap-1"
              >
                <Minus className="w-3 h-3" />
                <span>-1 Glass</span>
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer transition flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Glass Grid representation */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
          {Array.from({ length: targetGlasses }).map((_, idx) => {
            const isFilled = idx < waterLog.glassesDrank;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (idx === waterLog.glassesDrank - 1) handleAddGlass(-1);
                  else if (idx === waterLog.glassesDrank) handleAddGlass(1);
                  else onUpdateWaterLog({ ...waterLog, glassesDrank: idx + 1 });
                }}
                title={`Glass ${idx + 1} (250ml)`}
                className={`w-7 h-9 rounded-md border flex flex-col justify-end p-0.5 cursor-pointer transition transform hover:scale-110 ${
                  isFilled
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-sm shadow-cyan-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div 
                  className={`w-full rounded-xs transition-all duration-300 ${
                    isFilled ? 'h-full bg-gradient-to-t from-cyan-500 to-blue-400' : 'h-1 bg-slate-800'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* WHEN TO DRINK & HOW MUCH (कब और कितना पानी पीना है) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>{t.whenAndHowToDrink}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'वैज्ञानिक नियम अनुसार समय पर पानी पीने से पाचन, मसल रिकवरी और स्टैमिना 100% रहता है।'
                : 'Scientific hydration timing for maximum muscle recovery, digestion, and zero cramps.'}
            </p>
          </div>

          <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 whitespace-nowrap">
            7 टाइम स्लॉट (Schedule)
          </span>
        </div>

        {/* Schedule Slots Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {WATER_SLOTS.map(slot => {
            const isDone = waterLog.completedSlots?.includes(slot.id);

            return (
              <div
                key={slot.id}
                onClick={() => handleToggleSlot(slot.id, slot.targetGlasses)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                  isDone
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      ⏰ {slot.timeSlot}
                    </span>
                    <span className="text-xs font-black text-white px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                      💧 {slot.targetGlasses} {language === 'hi' ? 'ग्लास' : 'Glasses'} ({slot.amountMl}ml)
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {language === 'hi' ? slot.labelHi : slot.labelEn}
                  </h4>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {language === 'hi' ? slot.reasonHi : slot.reasonEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {isDone 
                      ? (language === 'hi' ? '✅ पानी पी लिया' : '✅ Completed')
                      : (language === 'hi' ? 'नल पर क्लिक करके मार्क करें' : 'Click to mark drunk')}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSlot(slot.id, slot.targetGlasses);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Done' : '+ मार्क करें'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GOLDEN HYDRATION RULES BOX (सोने जैसे नियम) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-800 pb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{language === 'hi' ? 'जिम में पानी पीने के 4 सुनहरे नियम (Golden Rules)' : '4 Golden Hydration Rules for Gym & Fitness'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-amber-400 block">1. खाने के तुरंत बाद कभी पानी न पिएं</strong>
            <span>खाने के तुरंत बाद पानी पीने से जठराग्नि (पाचन एंजाइम) मंद पड़ जाती है, जिससे खाना पचने के बजाय पेट में सड़ने लगता है और गैस बनती है। हमेशा 40-45 मिनट बाद पिएं।</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-cyan-400 block">2. वर्कआउट में बर्फ जैसा ठंडा पानी न पिएं</strong>
            <span>हैवी सेट्स के बाद अत्यधिक ठंडा पानी पीने से शरीर को शॉक लगता है और पाचन तंत्र सिकुड़ता है। रूम टेम्परेचर या हल्का मटके का ठंडा पानी सबसे सही है।</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-emerald-400 block">3. खड़े होकर नहीं, बैठकर घूंट-घूंट पिएं</strong>
            <span>खड़े होकर गटक-गटक पानी पीने से किडनी पर सीधा दबाव पड़ता है और जोड़ों में दर्द (Arthritis) का खतरा बढ़ता है। शांति से बैठकर घूंट लेकर पिएं।</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-rose-400 block">4. पेशाब का रंग चेक करें (Hydration Indicator)</strong>
            <span>अगर पेशाब का रंग बिल्कुल हल्का पानी जैसा या पारदर्शी है तो आप हाइड्रेटेड हैं। अगर गहरा पीला है, तो तुरंत 2 बड़े ग्लास पानी पिएं।</span>
          </div>
        </div>
      </div>
    </div>
  );
};
