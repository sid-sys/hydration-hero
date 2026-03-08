import { motion, AnimatePresence } from "framer-motion";
import { Droplets } from "lucide-react";
import { useState, useCallback } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface SplashButtonProps {
  onClick: () => void;
}

let rippleId = 0;

export function SplashButton({ onClick }: SplashButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [splashes, setSplashes] = useState<number[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++rippleId;

      setRipples((prev) => [...prev, { id, x, y }]);
      setSplashes((prev) => [...prev, id]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
      setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s !== id));
      }, 800);

      onClick();
    },
    [onClick]
  );

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      className="relative mt-6 flex items-center gap-2 overflow-hidden rounded-full bg-secondary px-8 py-4 font-display text-lg font-bold text-secondary-foreground shadow-lg active:shadow-md transition-shadow"
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
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
            }}
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
                  animate={{
                    x: Math.cos(angle) * 40,
                    y: Math.sin(angle) * 40 - 10,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-water"
                  style={{ marginLeft: -4, marginTop: -4 }}
                />
              );
            })}
          </motion.span>
        ))}
      </AnimatePresence>

      <Droplets size={24} />
      Drink Water
    </motion.button>
  );
}
