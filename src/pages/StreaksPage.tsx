import { motion } from "framer-motion";
import { Flame, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Badge, DayRecord } from "@/lib/water-store";

interface StreaksPageProps {
  streak: number;
  bestStreak: number;
  level: number;
  badges: Badge[];
  history: DayRecord[];
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getCalendarDays(year: number, month: number, history: DayRecord[]) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const completedDates = new Set(
    history.filter(d => d.goalMet).map(d => d.date)
  );

  const days: { day: number; completed: boolean; isToday: boolean; inMonth: boolean }[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push({ day: 0, completed: false, isToday: false, inMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({
      day: d,
      completed: completedDates.has(dateStr),
      isToday: dateStr === todayStr,
      inMonth: true,
    });
  }

  return days;
}

export default function StreaksPage({ streak, bestStreak, level, badges, history }: StreaksPageProps) {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const calendarDays = getCalendarDays(viewYear, viewMonth, history);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto">
      {/* Streak Hero */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="flex flex-col items-center mb-4"
      >
        <div className="relative w-24 h-24 flex items-center justify-center mb-3">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-coral to-sunshine opacity-20" />
          <Flame size={48} className="text-coral z-10" />
          <span className="absolute text-2xl font-display font-black text-foreground z-10 mt-2">{streak}</span>
        </div>
        <h1 className="font-display text-xl font-bold text-foreground">
          {streak > 0 ? "Keep up your streak!" : "Start your streak!"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Best: {bestStreak} days • Level {level}</p>
      </motion.div>

      {/* Calendar */}
      <div className="rounded-2xl bg-card border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </button>
          <span className="font-display font-bold text-sm text-foreground">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-semibold text-muted-foreground">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((cell, i) => (
            <div key={i} className="flex items-center justify-center aspect-square">
              {cell.inMonth ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.008 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    cell.completed
                      ? "bg-gradient-to-br from-coral to-sunshine text-white shadow-sm"
                      : cell.isToday
                      ? "ring-2 ring-primary text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {cell.completed ? "🔥" : cell.day}
                </motion.div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <h2 className="font-display text-lg font-bold mb-3">Badges</h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex flex-col items-center rounded-2xl p-3 border transition-colors ${
              badge.earned
                ? "bg-card border-primary/30 shadow-sm"
                : "bg-muted/50 border-border opacity-50"
            }`}
          >
            <span className="text-2xl mb-1">{badge.earned ? badge.icon : <Lock size={18} className="text-muted-foreground" />}</span>
            <span className="text-[9px] text-center font-semibold leading-tight text-foreground">{badge.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
