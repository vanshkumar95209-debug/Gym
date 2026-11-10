import React, { useState } from 'react';
import { Calendar, Plus, Trash2, TrendingUp, Dumbbell, Award, Flame, Check, Sparkles, Scale, Clock, ChevronDown } from 'lucide-react';
import { DailyWorkoutLog, BodyMetrics, MuscleGroup, AppLanguage } from '../types';
import { EXERCISES } from '../data/exercises';

interface DailyLogProps {
  workoutLogs: DailyWorkoutLog[];
  onSaveWorkoutLog: (log: DailyWorkoutLog) => void;
  onDeleteWorkoutLog: (id: string) => void;
  bodyMetrics: BodyMetrics[];
  onSaveBodyMetric: (metric: BodyMetrics) => void;
  onOpenExplorerWithMuscle: (muscle: MuscleGroup) => void;
  language?: AppLanguage;
}

export const DailyLog: React.FC<DailyLogProps> = ({
  workoutLogs,
  onSaveWorkoutLog,
  onDeleteWorkoutLog,
  bodyMetrics,
  onSaveBodyMetric,
  onOpenExplorerWithMuscle,
  language = 'en'
}) => {
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<'workouts' | 'measurements'>('workouts');
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState<boolean>(false);
  const [showAddMetricModal, setShowAddMetricModal] = useState<boolean>(false);

  // New Workout Form State
  const [workoutTitle, setWorkoutTitle] = useState<string>('Chest & Triceps Day (चेस्ट डे)');
  const [workoutDate, setWorkoutDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [workoutDuration, setWorkoutDuration] = useState<number>(50);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('chest');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('chest-flat-bench-press');
  const [numSets, setNumSets] = useState<number>(3);
  const [weightKg, setWeightKg] = useState<number>(50);
  const [reps, setReps] = useState<number>(10);
  const [workoutNotes, setWorkoutNotes] = useState<string>('Great chest pump! Form was clean.');

  // New Measurement Form State
  const [metricDate, setMetricDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [metricWeight, setMetricWeight] = useState<number>(70);
  const [metricChest, setMetricChest] = useState<number>(39);
  const [metricBiceps, setMetricBiceps] = useState<number>(14);
  const [metricWaist, setMetricWaist] = useState<number>(31.5);
  const [metricNotes, setMetricNotes] = useState<string>('');

  // Calculations
  const totalWorkouts = workoutLogs.length;
  const totalVolumeAllTime = workoutLogs.reduce((acc, log) => {
    const logVol = log.exercises.reduce((exAcc, ex) => {
      return exAcc + ex.sets.reduce((sAcc, s) => sAcc + (s.weightKg * s.reps), 0);
    }, 0);
    return acc + logVol;
  }, 0);

  // Latest measurements
  const sortedMetrics = [...bodyMetrics].sort((a, b) => b.date.localeCompare(a.date));
  const latestMetric = sortedMetrics[0];
  const oldestMetric = sortedMetrics[sortedMetrics.length - 1];

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const exObj = EXERCISES.find(e => e.id === selectedExerciseId) || EXERCISES[0];

    const generatedSets = Array.from({ length: numSets }, (_, i) => ({
      id: `s-${Date.now()}-${i}`,
      setNumber: i + 1,
      weightKg: weightKg + (i * 2.5),
      reps: Math.max(6, reps - i),
      completed: true
    }));

    const newLog: DailyWorkoutLog = {
      id: 'log-' + Date.now(),
      date: workoutDate,
      title: workoutTitle,
      muscleGroups: [selectedMuscle],
      durationMinutes: workoutDuration,
      exercises: [
        {
          exerciseId: exObj.id,
          exerciseName: exObj.name,
          targetMuscle: exObj.targetMuscle,
          sets: generatedSets,
          notes: workoutNotes
        }
      ],
      notes: workoutNotes
    };

    onSaveWorkoutLog(newLog);
    setShowAddWorkoutModal(false);
  };

  const handleCreateMetric = (e: React.FormEvent) => {
    e.preventDefault();
    const newMetric: BodyMetrics = {
      id: 'metric-' + Date.now(),
      date: metricDate,
      weightKg: metricWeight,
      chestInches: metricChest,
      bicepsInches: metricBiceps,
      waistInches: metricWaist,
      notes: metricNotes
    };
    onSaveBodyMetric(newMetric);
    setShowAddMetricModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Overview Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
            <Flame className="w-5 h-5 fill-orange-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{totalWorkouts}</div>
            <div className="text-[11px] text-slate-400">{isEn ? 'Workout Sessions' : 'वर्कआउट सत्र'}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">
              {Math.round(totalVolumeAllTime / 1000)}k <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[11px] text-slate-400">{isEn ? 'Total Lifted Volume' : 'कुल लिफ्टेड वॉल्यूम'}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-400">
              {latestMetric ? `${latestMetric.bicepsInches}"` : '14"'}
            </div>
            <div className="text-[11px] text-slate-400">{isEn ? 'Biceps Size' : 'बाइसेप्स साइज'}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-cyan-400">
              {latestMetric ? `${latestMetric.weightKg} kg` : '70 kg'}
            </div>
            <div className="text-[11px] text-slate-400">{isEn ? 'Current Body Weight' : 'वर्तमान शरीर का वजन'}</div>
          </div>
        </div>
      </div>

      {/* Main Tab Controls & New Log Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('workouts')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'workouts'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{isEn ? 'Workout History' : 'वर्कआउट इतिहास'}</span>
          </button>

          <button
            onClick={() => setActiveTab('measurements')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'measurements'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isEn ? 'Body Measurements' : 'शारीरिक माप'}</span>
          </button>
        </div>

        {activeTab === 'workouts' ? (
          <button
            onClick={() => setShowAddWorkoutModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? '+ Log Workout' : '+ वर्कआउट दर्ज करें'}</span>
          </button>
        ) : (
          <button
            onClick={() => setShowAddMetricModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? '+ Record Measurement' : '+ माप दर्ज करें'}</span>
          </button>
        )}
      </div>

      {/* TAB 1: WORKOUT LOGS LIST */}
      {activeTab === 'workouts' && (
        <div className="space-y-4">
          {workoutLogs.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <h4 className="font-bold text-white text-base">अभी कोई वर्कआउट दर्ज नहीं है</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                कसरत पूरी करने के बाद "Save & Log Workout" बटन दबाएं या ऊपर + बटन से अपना पिछला वर्कआउट जोड़ें।
              </p>
              <button
                onClick={() => setShowAddWorkoutModal(true)}
                className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                पहला वर्कआउट जोड़ें
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {workoutLogs.map(log => {
                // Calculate single log volume
                const logVolume = log.exercises.reduce((acc, ex) => {
                  return acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weightKg * s.reps), 0);
                }, 0);

                return (
                  <div
                    key={log.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition shadow-lg space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            📅 {log.date}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.durationMinutes} min
                          </span>
                          {log.muscleGroups.map(m => (
                            <span key={m} className="text-[10px] uppercase font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                              {m}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1.5">{log.title}</h3>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Volume</div>
                          <div className="text-sm font-extrabold text-amber-400">{logVolume} kg</div>
                        </div>

                        <button
                          onClick={() => onDeleteWorkoutLog(log.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                          title="डिलीट करें"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Exercises in this log */}
                    <div className="space-y-3">
                      {log.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              <span>{ex.exerciseName}</span>
                            </div>
                            <span className="text-xs text-slate-400">{ex.sets.length} Sets completed</span>
                          </div>

                          {/* Sets Badges Grid */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {ex.sets.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5"
                              >
                                <span className="text-slate-500 font-bold">Set {s.setNumber}:</span>
                                <span className="text-white font-semibold">{s.weightKg}kg</span>
                                <span className="text-slate-500">×</span>
                                <span className="text-amber-400 font-semibold">{s.reps} reps</span>
                              </div>
                            ))}
                          </div>

                          {ex.notes && (
                            <p className="text-[11px] text-slate-400 italic pt-1">
                              💬 {ex.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEASUREMENTS & BODY METRICS */}
      {activeTab === 'measurements' && (
        <div className="space-y-6">
          {/* Progress Comparison Card (Baseline vs Current) */}
          {oldestMetric && latestMetric && oldestMetric.id !== latestMetric.id && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                  प्रोग्रेस तुलना
                </span>
                <h4 className="font-bold text-white text-sm mt-1">
                  डोले: {oldestMetric.bicepsInches}" ➜ <span className="text-emerald-400 font-extrabold">{latestMetric.bicepsInches}"</span> • वजन: {latestMetric.weightKg} kg
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">छाती (Chest)</div>
                  <div className="text-base font-extrabold text-amber-400">{latestMetric.chestInches}"</div>
                </div>
                <div className="text-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">कमर (Waist)</div>
                  <div className="text-base font-extrabold text-cyan-400">{latestMetric.waistInches}"</div>
                </div>
              </div>
            </div>
          )}

          {/* Measurements Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">शारीरिक माप इतिहास (Body Measurement History)</h4>
              <span className="text-xs text-slate-400">{bodyMetrics.length} रिकॉर्ड्स दर्ज हैं</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">तारीख (Date)</th>
                    <th className="p-3.5">वजन (Weight)</th>
                    <th className="p-3.5">छाती (Chest)</th>
                    <th className="p-3.5">डोले (Biceps)</th>
                    <th className="p-3.5">कमर (Waist)</th>
                    <th className="p-3.5">नोट्स (Notes)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {sortedMetrics.map(m => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-bold text-amber-400">{m.date}</td>
                      <td className="p-3.5 font-semibold text-white">{m.weightKg} kg</td>
                      <td className="p-3.5">{m.chestInches ? `${m.chestInches} inches` : '-'}</td>
                      <td className="p-3.5 font-bold text-emerald-400">{m.bicepsInches ? `${m.bicepsInches} inches` : '-'}</td>
                      <td className="p-3.5">{m.waistInches ? `${m.waistInches} inches` : '-'}</td>
                      <td className="p-3.5 text-slate-400 italic">{m.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD WORKOUT LOG MODAL */}
      {showAddWorkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">आज का वर्कआउट दर्ज करें (Log Workout)</h3>
              <button
                onClick={() => setShowAddWorkoutModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkout} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">वर्कआउट का नाम / सेशन (Title):</label>
                <input
                  type="text"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  placeholder="उदा: Chest & Triceps Day"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">तारीख (Date):</label>
                  <input
                    type="date"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">अवधि (Duration Minutes):</label>
                  <input
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">टारगेट मसल (Muscle Targeted):</label>
                <select
                  value={selectedMuscle}
                  onChange={(e) => {
                    const m = e.target.value as MuscleGroup;
                    setSelectedMuscle(m);
                    const matched = EXERCISES.find(ex => ex.targetMuscle === m);
                    if (matched) setSelectedExerciseId(matched.id);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="chest">छाती (Chest)</option>
                  <option value="back">पीठ (Back)</option>
                  <option value="biceps">डोले (Biceps)</option>
                  <option value="triceps">ट्राइसेप्स (Triceps)</option>
                  <option value="shoulders">कंधे (Shoulders)</option>
                  <option value="legs">टांगें (Legs)</option>
                  <option value="abs">एब्स (Abs & Core)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">एक्सरसाइज चुनें (Exercise):</label>
                <select
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {EXERCISES.filter(ex => ex.targetMuscle === selectedMuscle).map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.equipment})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Sets:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={numSets}
                    onChange={(e) => setNumSets(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">वजन (Weight kg):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Reps:</label>
                  <input
                    type="number"
                    min="1"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">नोट्स (Workout Notes):</label>
                <input
                  type="text"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="उदा: चेस्ट में तगड़ा पंप आया, 50kg स्मूद गया"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-orange-500/20 mt-2"
              >
                Save Workout Log (लॉग सेव करें)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD BODY METRIC MODAL */}
      {showAddMetricModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">शारीरिक माप दर्ज करें (Add Measurements)</h3>
              <button
                onClick={() => setShowAddMetricModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMetric} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">तारीख (Date):</label>
                <input
                  type="date"
                  value={metricDate}
                  onChange={(e) => setMetricDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">बॉडी वेट (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={metricWeight}
                    onChange={(e) => setMetricWeight(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">डोले साइज (Biceps inches):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={metricBiceps}
                    onChange={(e) => setMetricBiceps(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">छाती (Chest inches):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={metricChest}
                    onChange={(e) => setMetricChest(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">कमर (Waist inches):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={metricWaist}
                    onChange={(e) => setMetricWaist(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">नोट्स (Progress Remarks):</label>
                <input
                  type="text"
                  value={metricNotes}
                  onChange={(e) => setMetricNotes(e.target.value)}
                  placeholder="उदा: आर्म्स में कटिंग बेहतर हुई है"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-orange-500/20 mt-2"
              >
                Save Measurements (नाप सेव करें)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
