import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { CheckCircle2, XCircle, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import type { DayRecord, WaterSettings, DrinkEvent } from "@/lib/water-store";

interface HistoryPageProps {
  history: DayRecord[];
  todayGlasses: number;
  todayDate: string;
  bestStreak: number;
  totalGlasses: number;
  settings: WaterSettings;
  drinkLog: DrinkEvent[];
}

export default function HistoryPage({ history, todayGlasses, todayDate, bestStreak, totalGlasses, settings, drinkLog }: HistoryPageProps) {
  const last7 = useMemo(() => {
    const days: { label: string; glasses: number; goal: boolean }[] = [];
    const allDays = [...history, { date: todayDate, glasses: todayGlasses, goalMet: todayGlasses >= settings.dailyGoal }];
    const recent = allDays.slice(-7);
    for (const d of recent) {
      days.push({
        label: new Date(d.date + "T00:00:00").toLocaleDateString("en", { weekday: "short" }),
        glasses: d.glasses,
        goal: d.goalMet,
      });
    }
    return days;
  }, [history, todayGlasses, todayDate, settings.dailyGoal]);

  const last30 = useMemo(() => {
    const all = [...history, { date: todayDate, glasses: todayGlasses, goalMet: todayGlasses >= settings.dailyGoal }];
    return all.slice(-30);
  }, [history, todayGlasses, todayDate, settings.dailyGoal]);

  // Group drink log by date, most recent first
  const recentDrinks = useMemo(() => {
    const sorted = [...drinkLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return sorted.slice(0, 20); // Show last 20 events
  }, [drinkLog]);

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-4">History 📊</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl bg-card border border-border p-4 text-center">
          <p className="font-display text-2xl font-bold text-primary">{bestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4 text-center">
          <p className="font-display text-2xl font-bold text-secondary">{totalGlasses}</p>
          <p className="text-xs text-muted-foreground">Total Glasses</p>
        </div>
      </div>

      {/* Chart */}
      <h2 className="font-display text-lg font-bold mb-3">This Week</h2>
      <div className="rounded-2xl bg-card border border-border p-4 mb-6">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={last7}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Bar dataKey="glasses" radius={[8, 8, 0, 0]}>
              {last7.map((entry, i) => (
                <Cell key={i} fill={entry.goal ? "hsl(142, 55%, 45%)" : "hsl(200, 80%, 55%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Goal met</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary inline-block" /> In progress</span>
        </div>
      </div>

      {/* Calendar-like grid for last 30 days */}
      <h2 className="font-display text-lg font-bold mb-3">Last 30 Days</h2>
      <div className="grid grid-cols-7 gap-1.5 mb-6">
        {last30.map((d, i) => (
          <div
            key={i}
            className={`flex items-center justify-center rounded-lg p-1.5 text-xs ${
              d.goalMet ? "bg-primary/20" : "bg-muted"
            }`}
            title={d.date}
          >
            {d.goalMet ? (
              <CheckCircle2 size={14} className="text-primary" />
            ) : (
              <XCircle size={14} className="text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>

      {/* Drink Activity Log */}
      <h2 className="font-display text-lg font-bold mb-3">Recent Activity 💧</h2>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        {recentDrinks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No drinks logged yet. Start hydrating!</p>
        ) : (
          <div className="divide-y divide-border">
            {recentDrinks.map((event, i) => {
              const date = new Date(event.timestamp);
              const isToday = event.date === todayDate;
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const isYesterday = event.date === yesterday.toISOString().split("T")[0];

              const dayLabel = isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString("en", { month: "short", day: "numeric" });
              const timeLabel = date.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit", hour12: true });

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0">
                    <Droplets size={16} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Drank 1 Glass</p>
                    <p className="text-[11px] text-muted-foreground">{dayLabel} • {timeLabel}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
