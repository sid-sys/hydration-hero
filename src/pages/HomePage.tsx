import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { PlantMascot } from "@/components/PlantMascot";
import { CircularProgress } from "@/components/CircularProgress";
import { SplashButton } from "@/components/SplashButton";
import { getPlantStage, xpForLevel } from "@/lib/water-store";
import { playDrinkSound, playGoalSound } from "@/lib/sounds";
import { triggerHaptic } from "@/lib/haptics";
import confetti from "canvas-confetti";
import { scheduleSampleNotification } from "@/lib/notifications";
import { showInterstitial } from "@/lib/admob";
import { useEffect, useRef, useCallback } from "react";


import { toast } from "sonner";

interface HomePageProps {
  todayGlasses: number;
  settings: { dailyGoal: number };
  progress: number;
  goalMet: boolean;
  streak: number;
  level: number;
  xp: number;
  drinkWater: () => { streakMilestone: number | null };
  userName?: string;
  lastDrinkTime: string | null;
  isPremium: boolean;
}

export default function HomePage({ todayGlasses, settings, progress, goalMet, streak, level, xp, drinkWater, userName, lastDrinkTime, isPremium }: HomePageProps) {
  const prevGoalMet = useRef(goalMet);

  useEffect(() => {
    if (goalMet && !prevGoalMet.current) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#3b82f6", "#38bdf8", "#fbbf24", "#f472b6"] });
      playGoalSound();
      triggerHaptic();
    }
    prevGoalMet.current = goalMet;
  }, [goalMet]);

  const handleDrink = useCallback(() => {
    playDrinkSound();
    triggerHaptic();
    const result = drinkWater();
    
    // Trigger interstitial ad for non-premium users
    if (!isPremium) {
      showInterstitial();
    }
    
    // Trigger test notification 2 seconds after drinking - Removed as per user request
    // scheduleSampleNotification();


    if (result.streakMilestone) {

      setTimeout(() => {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ["#f97316", "#eab308", "#ef4444", "#fbbf24"] });
        triggerHaptic();
        toast(`🔥 ${result.streakMilestone}-Day Streak Milestone!`, {
          description: "You're on fire! Keep it going!",
        });
      }, 300);
    }
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

      <SplashButton onClick={handleDrink} lastDrinkTime={lastDrinkTime} />
      
      <p className="mt-2 text-xs font-medium text-muted-foreground">
        Daily Goal: <span className="text-foreground">{settings.dailyGoal}</span> glasses 
        <span className="ml-1 text-foreground">
          {(settings.dailyGoal * 0.24).toFixed(1)} to {(settings.dailyGoal * 0.25).toFixed(1)} litres
        </span>
      </p>

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
