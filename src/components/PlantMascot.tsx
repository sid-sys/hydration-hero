import { motion } from "framer-motion";

interface PlantMascotProps {
  stage: number; // 0-5
  goalMet: boolean;
}

const STAGES = [
  // 0: Empty pot
  (
    <g key="s0">
      <ellipse cx="100" cy="180" rx="40" ry="12" fill="hsl(25, 50%, 55%)" />
      <path d="M65 140 Q60 180 68 180 L132 180 Q140 180 135 140 Z" fill="hsl(25, 50%, 60%)" stroke="hsl(25, 40%, 45%)" strokeWidth="2" />
      <path d="M70 140 L130 140" stroke="hsl(25, 40%, 45%)" strokeWidth="3" strokeLinecap="round" />
      <text x="100" y="168" textAnchor="middle" fontSize="16" fill="hsl(25, 40%, 45%)">😴</text>
    </g>
  ),
  // 1: Seedling
  (
    <g key="s1">
      <ellipse cx="100" cy="180" rx="40" ry="12" fill="hsl(25, 50%, 55%)" />
      <path d="M65 140 Q60 180 68 180 L132 180 Q140 180 135 140 Z" fill="hsl(25, 50%, 60%)" stroke="hsl(25, 40%, 45%)" strokeWidth="2" />
      <path d="M70 140 L130 140" stroke="hsl(25, 40%, 45%)" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="140" x2="100" y2="120" stroke="hsl(142, 40%, 35%)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="92" cy="118" rx="10" ry="6" fill="hsl(142, 55%, 50%)" transform="rotate(-20, 92, 118)" />
      <ellipse cx="108" cy="118" rx="10" ry="6" fill="hsl(142, 55%, 50%)" transform="rotate(20, 108, 118)" />
    </g>
  ),
  // 2: Sprout
  (
    <g key="s2">
      <ellipse cx="100" cy="180" rx="40" ry="12" fill="hsl(25, 50%, 55%)" />
      <path d="M65 140 Q60 180 68 180 L132 180 Q140 180 135 140 Z" fill="hsl(25, 50%, 60%)" stroke="hsl(25, 40%, 45%)" strokeWidth="2" />
      <line x1="100" y1="140" x2="100" y2="100" stroke="hsl(142, 40%, 35%)" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="85" cy="110" rx="14" ry="8" fill="hsl(142, 55%, 48%)" transform="rotate(-30, 85, 110)" />
      <ellipse cx="115" cy="105" rx="14" ry="8" fill="hsl(142, 55%, 52%)" transform="rotate(25, 115, 105)" />
      <ellipse cx="90" cy="100" rx="12" ry="7" fill="hsl(142, 60%, 55%)" transform="rotate(-15, 90, 100)" />
      <circle cx="100" cy="96" r="4" fill="hsl(142, 55%, 45%)" />
    </g>
  ),
  // 3: Small plant
  (
    <g key="s3">
      <ellipse cx="100" cy="180" rx="40" ry="12" fill="hsl(25, 50%, 55%)" />
      <path d="M65 140 Q60 180 68 180 L132 180 Q140 180 135 140 Z" fill="hsl(25, 50%, 60%)" stroke="hsl(25, 40%, 45%)" strokeWidth="2" />
      <line x1="100" y1="140" x2="100" y2="75" stroke="hsl(142, 40%, 32%)" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="78" cy="110" rx="18" ry="10" fill="hsl(142, 55%, 48%)" transform="rotate(-35, 78, 110)" />
      <ellipse cx="122" cy="100" rx="18" ry="10" fill="hsl(142, 55%, 52%)" transform="rotate(30, 122, 100)" />
      <ellipse cx="82" cy="85" rx="16" ry="9" fill="hsl(142, 60%, 55%)" transform="rotate(-20, 82, 85)" />
      <ellipse cx="118" cy="80" rx="16" ry="9" fill="hsl(142, 60%, 50%)" transform="rotate(20, 118, 80)" />
      <circle cx="100" cy="70" r="6" fill="hsl(340, 70%, 65%)" />
      <circle cx="100" cy="70" r="3" fill="hsl(45, 100%, 60%)" />
    </g>
  ),
  // 4: Flowering
  (
    <g key="s4">
      <ellipse cx="100" cy="180" rx="40" ry="12" fill="hsl(25, 50%, 55%)" />
      <path d="M65 140 Q60 180 68 180 L132 180 Q140 180 135 140 Z" fill="hsl(25, 50%, 60%)" stroke="hsl(25, 40%, 45%)" strokeWidth="2" />
      <line x1="100" y1="140" x2="100" y2="60" stroke="hsl(142, 40%, 30%)" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="72" cy="115" rx="20" ry="11" fill="hsl(142, 55%, 48%)" transform="rotate(-35, 72, 115)" />
      <ellipse cx="128" cy="105" rx="20" ry="11" fill="hsl(142, 55%, 52%)" transform="rotate(30, 128, 105)" />
      <ellipse cx="75" cy="85" rx="18" ry="10" fill="hsl(142, 60%, 55%)" transform="rotate(-25, 75, 85)" />
      <ellipse cx="125" cy="78" rx="18" ry="10" fill="hsl(142, 60%, 50%)" transform="rotate(25, 125, 78)" />
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="100" cy="48" rx="8" ry="12" fill="hsl(340, 70%, 65%)" transform={`rotate(${a}, 100, 58)`} />
      ))}
      <circle cx="100" cy="58" r="7" fill="hsl(45, 100%, 60%)" />
      {[0, 120, 240].map(a => (
        <ellipse key={`b${a}`} cx="80" cy="68" rx="5" ry="8" fill="hsl(300, 60%, 70%)" transform={`rotate(${a}, 80, 75)`} />
      ))}
      <circle cx="80" cy="75" r="4" fill="hsl(45, 90%, 55%)" />
    </g>
  ),
  // 5: Blooming (goal met!)
  (
    <g key="s5">
      <ellipse cx="100" cy="180" rx="42" ry="13" fill="hsl(25, 50%, 55%)" />
      <path d="M63 140 Q58 180 66 180 L134 180 Q142 180 137 140 Z" fill="hsl(25, 50%, 60%)" stroke="hsl(25, 40%, 45%)" strokeWidth="2" />
      <line x1="100" y1="140" x2="100" y2="45" stroke="hsl(142, 40%, 28%)" strokeWidth="6" strokeLinecap="round" />
      <line x1="100" y1="110" x2="70" y2="90" stroke="hsl(142, 40%, 32%)" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="95" x2="135" y2="78" stroke="hsl(142, 40%, 32%)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="62" cy="115" rx="22" ry="12" fill="hsl(142, 55%, 48%)" transform="rotate(-40, 62, 115)" />
      <ellipse cx="138" cy="105" rx="22" ry="12" fill="hsl(142, 55%, 52%)" transform="rotate(35, 138, 105)" />
      <ellipse cx="60" cy="85" rx="20" ry="11" fill="hsl(142, 60%, 55%)" transform="rotate(-25, 60, 85)" />
      <ellipse cx="140" cy="75" rx="20" ry="11" fill="hsl(142, 60%, 50%)" transform="rotate(20, 140, 75)" />
      <ellipse cx="80" cy="70" rx="16" ry="9" fill="hsl(142, 55%, 52%)" transform="rotate(-15, 80, 70)" />
      <ellipse cx="120" cy="65" rx="16" ry="9" fill="hsl(142, 55%, 48%)" transform="rotate(15, 120, 65)" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <ellipse key={a} cx="100" cy="28" rx="10" ry="14" fill="hsl(340, 75%, 65%)" transform={`rotate(${a}, 100, 42)`} />
      ))}
      <circle cx="100" cy="42" r="9" fill="hsl(45, 100%, 60%)" />
      {[0, 90, 180, 270].map(a => (
        <ellipse key={`c${a}`} cx="65" cy="78" rx="6" ry="9" fill="hsl(280, 60%, 70%)" transform={`rotate(${a}, 65, 85)`} />
      ))}
      <circle cx="65" cy="85" r="5" fill="hsl(45, 90%, 55%)" />
      {[0, 90, 180, 270].map(a => (
        <ellipse key={`d${a}`} cx="138" cy="68" rx="6" ry="9" fill="hsl(20, 80%, 70%)" transform={`rotate(${a}, 138, 75)`} />
      ))}
      <circle cx="138" cy="75" r="5" fill="hsl(45, 90%, 55%)" />
      <text x="100" y="155" textAnchor="middle" fontSize="14">✨</text>
    </g>
  ),
];

export function PlantMascot({ stage, goalMet }: PlantMascotProps) {
  return (
    <motion.div
      className="flex justify-center"
      animate={goalMet ? { scale: [1, 1.05, 1] } : stage === 0 ? {} : { y: [0, -4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="20 10 160 190" width="200" height="200">
        {STAGES[Math.min(stage, 5)]}
      </svg>
    </motion.div>
  );
}
