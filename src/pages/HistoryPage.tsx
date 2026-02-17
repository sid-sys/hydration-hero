import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";
import type { DayRecord, WaterSettings } from "@/lib/water-store";

interface HistoryPageProps {
  history: DayRecord[];
  todayGlasses: number;
  todayDate: string;
  bestStreak: number;
  totalGlasses: number;
  settings: WaterSettings;
}

export default function HistoryPage({ history, todayGlasses, todayDate, bestStreak, totalGlasses, settings }: HistoryPageProps) {
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
      <div className="grid grid-cols-7 gap-1.5">
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
    </div>
  );
}
