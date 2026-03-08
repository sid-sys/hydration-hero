import { motion } from "framer-motion";

interface CircularProgressProps {
  progress: number; // 0-1
  glasses: number;
  goal: number;
}

export function CircularProgress({ progress, glasses, goal }: CircularProgressProps) {
  const size = 180;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const goalMet = glasses >= goal;
  const clampedProgress = Math.min(progress, 1);
  const offset = circumference * (1 - clampedProgress);

  // Extra glasses beyond goal
  const extraGlasses = goalMet ? glasses - goal : 0;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--water-light))"
          strokeWidth={stroke}
        />
        {/* Main progress (water color) */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={goalMet ? "hsl(var(--sunshine))" : "hsl(var(--water))"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {goalMet ? (
          <>
            <span className="text-3xl font-display font-bold text-sunshine">{glasses}</span>
            <span className="text-sm font-body text-muted-foreground">+{extraGlasses} bonus 🥤</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">No XP • No streak</span>
          </>
        ) : (
          <>
            <span className="text-3xl font-display font-bold text-foreground">{glasses}</span>
            <span className="text-sm font-body text-muted-foreground">/ {goal} glasses</span>
          </>
        )}
      </div>
    </div>
  );
}
