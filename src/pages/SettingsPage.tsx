import { Minus, Plus, RotateCcw } from "lucide-react";
import type { WaterSettings } from "@/lib/water-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { scheduleReminders } from "@/lib/notifications";

interface SettingsPageProps {
  settings: WaterSettings;
  updateSettings: (s: Partial<WaterSettings>) => void;
  resetProgress: () => void;
}

const CUP_SIZES: { value: WaterSettings["cupSize"]; label: string; ml: number }[] = [
  { value: "small", label: "Small", ml: 150 },
  { value: "medium", label: "Medium", ml: 250 },
  { value: "large", label: "Large", ml: 350 },
];

const INTERVALS = [1, 1.5, 2, 3, 4];

export default function SettingsPage({ settings, updateSettings, resetProgress }: SettingsPageProps) {
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Settings ⚙️</h1>

      {/* Daily Goal */}
      <div className="rounded-2xl bg-card border border-border p-5 mb-4">
        <h2 className="font-display font-bold text-sm mb-3 text-foreground">Daily Goal</h2>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => updateSettings({ dailyGoal: Math.max(1, settings.dailyGoal - 1) })}
            className="rounded-full bg-muted p-2 active:scale-90 transition-transform"
          >
            <Minus size={18} />
          </button>
          <span className="font-display text-3xl font-bold text-primary w-16 text-center">{settings.dailyGoal}</span>
          <button
            onClick={() => updateSettings({ dailyGoal: settings.dailyGoal + 1 })}
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
              onClick={() => updateSettings({ cupSize: cup.value })}
              className={`flex-1 rounded-xl py-3 text-center font-semibold text-sm transition-all border ${
                settings.cupSize === cup.value
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {cup.label}
              <br />
              <span className="text-[10px] opacity-75">{cup.ml}ml</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reminder Interval */}
      <div className="rounded-2xl bg-card border border-border p-5 mb-4">
        <h2 className="font-display font-bold text-sm mb-3 text-foreground">Reminder Interval</h2>
        <div className="flex gap-2 flex-wrap">
          {INTERVALS.map(h => (
            <button
              key={h}
              onClick={() => updateSettings({ reminderInterval: h })}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all border ${
                settings.reminderInterval === h
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Notifications require Capacitor native build</p>
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
            <Button variant="destructive" size="sm" onClick={() => { resetProgress(); setShowReset(false); }}>
              Confirm Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReset(false)}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
}
