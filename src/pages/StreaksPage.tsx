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
  
  // Calculate completion percentage for the ring
  const completedDays = calendarDays.filter(d => d.inMonth && d.completed).length;
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const completionPercentage = (completedDays / totalDaysInMonth) * 100;

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
        className="flex flex-col items-center mb-10"
      >
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          {/* Main Ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-orange-500/10" />
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="61"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 61}
              strokeDashoffset={2 * Math.PI * 61 * (1 - completionPercentage / 100)}
              className="text-orange-500 transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Flame on top */}
          <div className="absolute -top-6 bg-background p-1 rounded-full border border-orange-900/20 shadow-lg">
            <Flame size={32} className="text-orange-500 fill-orange-500" />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-5xl font-display font-black text-foreground">{streak}</span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-[-4px]">Days</span>
          </div>
        </div>
        
        <h1 className="font-display text-2xl font-black text-foreground tracking-tight">
          {streak > 0 ? "Keep up your streak!" : "Start your streak!"}
        </h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Best: {bestStreak} days • Level {level}</p>
      </motion.div>

      {/* Calendar */}
      <div className="rounded-2xl bg-card border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft size={20} className="text-muted-foreground" />
          </button>
          <span className="font-display font-black text-sm text-foreground uppercase tracking-widest">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-semibold text-muted-foreground">{d}</div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, rowIndex) => (
            <div key={rowIndex} className="relative h-11 w-full rounded-full bg-orange-950/20 border border-orange-900/10 flex items-center p-1">
              <div className="grid grid-cols-7 w-full h-full">
                {calendarDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell, i) => (
                  <div key={i} className="flex items-center justify-center h-full">
                    {cell.inMonth ? (
                      <div className="relative flex items-center justify-center w-8 h-8">
                        {cell.completed ? (
                          <div className="flex items-center justify-center relative w-full h-full">
                            <Flame size={32} className="text-orange-500 stroke-[2px]" />
                            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black mt-1 text-foreground">
                              {cell.day}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-xs font-heavy ${cell.isToday ? "text-orange-500 font-bold underline underline-offset-4" : "text-muted-foreground font-bold"}`}>
                            {cell.day}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
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
