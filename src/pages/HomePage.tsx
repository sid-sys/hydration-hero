import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { PlantMascot } from "@/components/PlantMascot";
import { CircularProgress } from "@/components/CircularProgress";
import { SplashButton } from "@/components/SplashButton";
import { getPlantStage, xpForLevel } from "@/lib/water-store";
import { playDrinkSound, playGoalSound } from "@/lib/sounds";
import confetti from "canvas-confetti";
import { useEffect, useRef, useCallback } from "react";

interface HomePageProps {
  todayGlasses: number;
  settings: { dailyGoal: number };
  progress: number;
  goalMet: boolean;
  streak: number;
  level: number;
  xp: number;
  drinkWater: () => void;
  userName?: string;
}

export default function HomePage({ todayGlasses, settings, progress, goalMet, streak, level, xp, drinkWater, userName }: HomePageProps) {
  const prevGoalMet = useRef(goalMet);

  useEffect(() => {
    if (goalMet && !prevGoalMet.current) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#4ade80", "#38bdf8", "#fbbf24", "#f472b6"] });
      playGoalSound();
    }
    prevGoalMet.current = goalMet;
  }, [goalMet]);

  const handleDrink = useCallback(() => {
    playDrinkSound();
    drinkWater();
  }, [drinkWater]);

  const stage = getPlantStage(todayGlasses, settings.dailyGoal);
  const xpNeeded = xpForLevel(level);

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-24">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">
        {userName ? `Hey ${userName}! 💧` : "Stay Hydrated! 💧"}
      </h1>
      <p className="text-sm text-muted-foreground mb-4">Your plant is {goalMet ? "thriving!" : "thirsty..."}</p>

      <PlantMascot stage={stage} goalMet={goalMet} />

      <div className="mt-4">
        <CircularProgress progress={progress} glasses={todayGlasses} goal={settings.dailyGoal} />
      </div>

      <SplashButton onClick={handleDrink} />

      <AnimatePresence>
        {goalMet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 rounded-2xl bg-primary/10 px-6 py-3 text-center"
          >
            <span className="font-display font-bold text-primary">🎉 Daily Goal Met!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 grid w-full max-w-xs grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-2xl bg-card p-3 shadow-sm border border-border">
          <Flame size={20} className="text-coral mb-1" />
          <span className="font-display text-lg font-bold">{streak}</span>
          <span className="text-[10px] text-muted-foreground">Streak</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-card p-3 shadow-sm border border-border">
          <Star size={20} className="text-sunshine mb-1" />
          <span className="font-display text-lg font-bold">Lv.{level}</span>
          <span className="text-[10px] text-muted-foreground">Level</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-card p-3 shadow-sm border border-border">
          <div className="w-full mb-1">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(xp / xpNeeded) * 100}%` }}
              />
            </div>
          </div>
          <span className="font-display text-sm font-bold">{xp}/{xpNeeded}</span>
          <span className="text-[10px] text-muted-foreground">XP</span>
        </div>
      </div>
    </div>
  );
}
