import { Minus, Plus, RotateCcw } from "lucide-react";
import type { WaterSettings } from "@/lib/water-store";
import type { UserProfile } from "@/lib/user-profile";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { scheduleReminders, scheduleWeeklySummary } from "@/lib/notifications";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

interface SettingsPageProps {
  settings: WaterSettings;
  updateSettings: (s: Partial<WaterSettings>) => void;
  resetProgress: () => void;
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
}

const CUP_SIZES: { value: WaterSettings["cupSize"]; label: string }[] = [
  { value: "small", label: "1 Cup" },
  { value: "medium", label: "2 Cups" },
  { value: "large", label: "3 Cups" },
];

const INTERVALS = [0.5, 1, 1.5, 2, 3];

export default function SettingsPage({ settings, updateSettings, resetProgress, profile, updateProfile }: SettingsPageProps) {
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Settings ⚙️</h1>

      {/* Theme */}
      <div className="rounded-2xl bg-card border border-border p-5 mb-4">
        <h2 className="font-display font-bold text-sm mb-3 text-foreground">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Dark Mode</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Daily Goal */}
      <div className="rounded-2xl bg-card border border-border p-5 mb-4">
        <h2 className="font-display font-bold text-sm mb-3 text-foreground">Daily Goal</h2>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => { updateSettings({ dailyGoal: Math.max(1, settings.dailyGoal - 1) }); toast.success("Daily goal updated! 🎯"); }}
            className="rounded-full bg-muted p-2 active:scale-90 transition-transform"
          >
            <Minus size={18} />
          </button>
          <span className="font-display text-3xl font-bold text-primary w-16 text-center">{settings.dailyGoal}</span>
          <button
            onClick={() => { updateSettings({ dailyGoal: settings.dailyGoal + 1 }); toast.success("Daily goal updated! 🎯"); }}
            className="rounded-full bg-muted p-2 active:scale-90 transition-transform"
          >
            <Plus size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-1">glasses per day</p>
      </div>

      {/* Cup Size */}
      <div className="rounded-2xl bg-card border border-border p-5 mb-4">
        <h2 className="font-display font-bold text-sm mb-3 text-foreground">Cup Size</h2>
        <div className="flex gap-2">
          {CUP_SIZES.map(cup => (
            <button
              key={cup.value}
              onClick={() => { updateSettings({ cupSize: cup.value }); toast.success(`Cup size set to ${cup.label} 🥤`); }}
              className={`flex-1 rounded-xl py-3 text-center font-semibold text-sm transition-all border ${
                settings.cupSize === cup.value
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {cup.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="rounded-2xl bg-card border border-border p-5 mb-4">
        <h2 className="font-display font-bold text-sm mb-3 text-foreground">Notification Schedule</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">🌅 Wake Time</label>
            <input
              type="time"
              value={profile.wakeTime}
              onChange={(e) => { updateProfile({ wakeTime: e.target.value }); toast.success("Wake time updated! 🌅"); }}
              className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">🌙 Bed Time</label>
            <input
              type="time"
              value={profile.bedTime}
              onChange={(e) => { updateProfile({ bedTime: e.target.value }); toast.success("Bed time updated! 🌙"); }}
              className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <h2 className="font-display font-bold text-sm mb-2 text-foreground">Reminder Frequency</h2>
        <div className="flex gap-2 flex-wrap">
          {INTERVALS.map(h => (
            <button
              key={h}
              onClick={() => {
                updateProfile({ notificationFrequency: h });
                scheduleReminders(h, profile.wakeTime, profile.bedTime, profile.name);
                scheduleWeeklySummary(profile.name);
                toast.success(`Reminders set to every ${h < 1 ? `${h * 60} minutes` : `${h} hour${h > 1 ? 's' : ''}`} ⏰`);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all border ${
                profile.notificationFrequency === h
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {h < 1 ? `${h * 60}m` : `${h}h`}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Notifications work on native builds (iOS/Android)</p>
      </div>

      {/* Reset */}
      <div className="rounded-2xl bg-card border border-destructive/20 p-5">
        <h2 className="font-display font-bold text-sm mb-2 text-foreground">Reset Progress</h2>
        {!showReset ? (
          <Button variant="outline" size="sm" onClick={() => setShowReset(true)} className="text-destructive border-destructive/30">
            <RotateCcw size={14} className="mr-1" /> Reset All Data
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={() => { resetProgress(); setShowReset(false); toast.success("All progress has been reset 🔄"); }}>
              Confirm Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReset(false)}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
}
