import { motion } from "framer-motion";
import { Flame, Lock } from "lucide-react";
import type { Badge, PlantEntry } from "@/lib/water-store";

interface StreaksPageProps {
  streak: number;
  bestStreak: number;
  level: number;
  badges: Badge[];
  garden: PlantEntry[];
}

const MINI_PLANTS = ["🌱", "🌿", "🌸", "🌳"];

export default function StreaksPage({ streak, bestStreak, level, badges, garden }: StreaksPageProps) {
  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-4">Streaks & Rewards 🏆</h1>

      {/* Streak Card */}
      <div className="rounded-2xl bg-gradient-to-br from-coral/20 to-sunshine/20 p-5 mb-5 border border-border">
        <div className="flex items-center gap-3 mb-2">
          <Flame size={28} className="text-coral" />
          <div>
            <p className="font-display text-3xl font-bold text-foreground">{streak} days</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Best: {bestStreak} days • Level {level}</p>
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

      {/* Garden */}
      <h2 className="font-display text-lg font-bold mb-3">Your Garden 🌿</h2>
      {garden.length === 0 ? (
        <p className="text-sm text-muted-foreground">Complete daily goals to grow plants!</p>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {garden.map((plant, i) => (
            <motion.div
              key={plant.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.03, type: "spring" }}
              className="flex flex-col items-center rounded-xl bg-card border border-border p-2"
            >
              <span className="text-2xl">{MINI_PLANTS[plant.plantType]}</span>
              <span className="text-[8px] text-muted-foreground mt-0.5">{plant.completedDate.slice(5)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
