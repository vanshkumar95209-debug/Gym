import React, { useState, useEffect } from 'react';
import { Bell, Clock, X, Check, Volume2 } from 'lucide-react';
import { UserFitnessProfile, AppLanguage } from '../types';

interface ProfileModalProps {
  userProfile: UserFitnessProfile;
  onUpdateProfile: (profile: UserFitnessProfile) => void;
  onClose: () => void;
  language?: AppLanguage;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userProfile,
  onUpdateProfile,
  onClose,
  language = 'en'
}) => {
  const isEn = language === 'en';
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(userProfile.dailyReminderEnabled ?? false);
  const [reminderTime, setReminderTime] = useState<string>(userProfile.reminderTime || '18:00');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [weightKg, setWeightKg] = useState<number>(userProfile.weightKg || 70);
  const [goal, setGoal] = useState<UserFitnessProfile['goal']>(userProfile.goal || 'muscle_gain');
  const [testNotificationSent, setTestNotificationSent] = useState<boolean>(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  // Check browser Notification permission on load
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleToggleReminder = async (enabled: boolean) => {
    setNotificationError(null);
    if (enabled) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission !== 'granted') {
          const res = await Notification.requestPermission();
          setPermissionStatus(res);
          if (res !== 'granted') {
            setNotificationError(isEn 
              ? 'Notification permission was not granted. Please allow notifications in browser settings.'
              : 'नोटिफिकेशन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।');
            setReminderEnabled(false);
            return;
          }
        }
      } else {
        setNotificationError(isEn 
          ? 'Browser notification is not supported on this device.'
          : 'आपके ब्राउज़र में नोटिफिकेशन सपोर्ट उपलब्ध नहीं है।');
        setReminderEnabled(false);
        return;
      }
    }

    setReminderEnabled(enabled);
  };

  const handleSendTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🏋️ FitBro Gym Reminder!', {
          body: isEn 
            ? `Workout time (${reminderTime})! Complete today's training session.`
            : `वर्कआउट का समय हो गया है (${reminderTime})! आज का कसरत सत्र पूरा करें।`,
          icon: '/favicon.ico'
        });
        setTestNotificationSent(true);
        setTimeout(() => setTestNotificationSent(false), 3000);
      } else {
        Notification.requestPermission().then(perm => {
          setPermissionStatus(perm);
          if (perm === 'granted') {
            new Notification('🏋️ FitBro Gym Reminder!', {
              body: isEn
                ? `Workout time (${reminderTime})! Complete today's training session.`
                : `वर्कआउट का समय हो गया है (${reminderTime})! आज का कसरत सत्र पूरा करें।`
            });
            setTestNotificationSent(true);
          }
        });
      }
    }
  };

  const handleSave = () => {
    const proteinMultiplier = goal === 'beast_body' ? 2.2 : goal === 'fat_loss' ? 2.2 : goal === 'muscle_gain' ? 2.0 : 1.4;
    onUpdateProfile({
      ...userProfile,
      dailyReminderEnabled: reminderEnabled,
      reminderTime: reminderTime,
      weightKg: weightKg,
      goal: goal,
      dailyProteinTargetGrams: Math.round(weightKg * proteinMultiplier)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Bell className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-white text-base">
              {isEn ? 'Settings' : 'सेटिंग्स'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* DAILY REMINDER SECTION */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span>{isEn ? 'Workout Reminder' : 'वर्कआउट रिमाइंडर'}</span>
              {reminderEnabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => handleToggleReminder(!reminderEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                reminderEnabled ? 'bg-amber-500' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                  reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Time Selector when enabled */}
          {reminderEnabled && (
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Reminder Time:' : 'रिमाइंडर समय:'}</span>
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-bold text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  {permissionStatus === 'granted' 
                    ? (isEn ? '✓ Notifications Allowed' : '✓ नोटिफिकेशन अनुमति प्राप्त')
                    : (isEn ? '⚠️ Permission Required' : '⚠️ अनुमति आवश्यक')}
                </span>

                <button
                  onClick={handleSendTestNotification}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer transition flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{testNotificationSent ? (isEn ? 'Sent!' : 'भेज दिया!') : (isEn ? 'Test Alert' : 'टेस्ट अलर्ट')}</span>
                </button>
              </div>
            </div>
          )}
          {notificationError && (
            <p className="text-[11px] text-rose-400 font-medium">{notificationError}</p>
          )}
        </div>

        {/* FITNESS PROFILE */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isEn ? 'Body Weight (kg):' : 'शरीर का वजन (kg):'}
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 70)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-bold outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isEn ? 'Fitness Goal:' : 'फिटनेस लक्ष्य:'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'muscle_gain', labelEn: 'Muscle Mass', labelHi: 'मसल गेन' },
                { id: 'fat_loss', labelEn: 'Fat Loss & Shred', labelHi: 'फैट लॉस' },
                { id: 'beast_body', labelEn: 'Strength & Bulk', labelHi: 'स्ट्रेंथ व बल्क' },
                { id: 'maintenance', labelEn: 'Stay Fit', labelHi: 'फिटनेस व एक्टिव' }
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    goal === g.id
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isEn ? g.labelEn : g.labelHi}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm cursor-pointer shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{isEn ? 'Save Profile' : 'सेव करें'}</span>
        </button>
      </div>
    </div>
  );
};
