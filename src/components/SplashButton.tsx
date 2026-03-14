import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Clock } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { isOnCooldown, getCooldownRemaining } from "@/lib/water-store";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface SplashButtonProps {
  onClick: () => void;
  lastDrinkTime: string | null;
}

let rippleId = 0;

export function SplashButton({ onClick, lastDrinkTime }: SplashButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [splashes, setSplashes] = useState<number[]>([]);
  const [cooldownMs, setCooldownMs] = useState(() => getCooldownRemaining(lastDrinkTime));

  // Tick cooldown every second
  useEffect(() => {
    const tick = () => setCooldownMs(getCooldownRemaining(lastDrinkTime));
    tick();
    if (!isOnCooldown(lastDrinkTime)) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lastDrinkTime]);

  const onCooldown = cooldownMs > 0;

  const formatCooldown = () => {
    const m = Math.floor(cooldownMs / 60000);
    const s = Math.ceil((cooldownMs % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onCooldown) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++rippleId;

      setRipples((prev) => [...prev, { id, x, y }]);
      setSplashes((prev) => [...prev, id]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
      setTimeout(() => setSplashes((prev) => prev.filter((s) => s !== id)), 800);

      onClick();
    },
    [onClick, onCooldown]
  );

  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileTap={onCooldown ? {} : { scale: 0.9 }}
        whileHover={onCooldown ? {} : { scale: 1.05 }}
        onClick={handleClick}
        disabled={onCooldown}
        className={`relative mt-6 flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 font-display text-lg font-bold shadow-lg transition-all ${
          onCooldown
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary text-primary-foreground active:shadow-md"
        }`}
      >
        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute rounded-full bg-primary-foreground/30 pointer-events-none"
              style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }}
            />
          ))}
        </AnimatePresence>

        {/* Splash droplets */}
        <AnimatePresence>
          {splashes.map((id) => (
            <motion.span key={`splash-${id}`} className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: Math.cos(angle) * 40, y: Math.sin(angle) * 40 - 10, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-primary-foreground/60"
                    style={{ marginLeft: -4, marginTop: -4 }}
                  />
                );
              })}
            </motion.span>
          ))}
        </AnimatePresence>

        {onCooldown ? (
          <>
            <Clock size={20} />
            <span className="text-base">Next glass in {formatCooldown()}</span>
          </>
        ) : (
          <>
            <Droplets size={24} />
            Drink 1 Glass <span className="text-sm font-normal ml-0.5 opacity-80">~ 250 ml</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
