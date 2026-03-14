import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Calculator, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile, calculateDailyWater } from "@/lib/user-profile";

interface OnboardingPageProps {
  onComplete: (profile: UserProfile) => void;
}

const STEPS = ["name", "goal", "schedule", "frequency"] as const;

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(8);
  const [showCalculator, setShowCalculator] = useState(false);
  const [weight, setWeight] = useState(70);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("22:00");
  const [frequency, setFrequency] = useState(2);

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        name: name.trim(),
        dailyGoal,
        wakeTime,
        bedTime,
        notificationFrequency: frequency,
        onboardingComplete: true,
        bodyWeight: weight,
        isPremium: false,
      });
    }
  };

  const handleBack = () => {
    if (showCalculator) {
      setShowCalculator(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleCalculate = () => {
    const result = calculateDailyWater(weight);
    setDailyGoal(result.glasses);
    setShowCalculator(false);
  };

  const FREQUENCIES = [
    { value: 0.5, label: "30 min" },
    { value: 1, label: "1 hour" },
    { value: 1.5, label: "1.5 hours" },
    { value: 2, label: "2 hours" },
    { value: 3, label: "3 hours" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/50" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${step}-${showCalculator}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm"
        >
          {/* Step 0: Name */}
          {step === 0 && (
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Welcome, Chief!
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                Let's get you hydrated. What should we call you?
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={30}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-center font-display text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Step 1: Goal */}
          {step === 1 && !showCalculator && (
            <div className="text-center">
              <div className="text-5xl mb-4">💧</div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Daily Water Goal
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                How many glasses do you want to drink daily?
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
                  className="rounded-full bg-muted p-3 active:scale-90 transition-transform"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <span className="font-display text-5xl font-bold text-primary">{dailyGoal}</span>
                  <p className="text-xs text-muted-foreground mt-1">glasses (~{dailyGoal * 250}ml)</p>
                </div>
                <button
                  onClick={() => setDailyGoal(dailyGoal + 1)}
                  className="rounded-full bg-muted p-3 active:scale-90 transition-transform"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Recommended: 8 glasses (2L) per day
              </p>
              <button
                onClick={() => setShowCalculator(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary"
              >
                <Calculator size={16} />
                Calculate based on my weight
              </button>
            </div>
          )}

          {/* Weight Calculator */}
          {step === 1 && showCalculator && (
            <div className="text-center">
              <div className="text-5xl mb-4">⚖️</div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Water Calculator
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                We'll calculate your ideal intake (~35ml per kg body weight)
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => setWeight(Math.max(30, weight - 1))}
                  className="rounded-full bg-muted p-3 active:scale-90 transition-transform"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <span className="font-display text-5xl font-bold text-foreground">{weight}</span>
                  <p className="text-xs text-muted-foreground mt-1">kg</p>
                </div>
                <button
                  onClick={() => setWeight(Math.min(200, weight + 1))}
                  className="rounded-full bg-muted p-3 active:scale-90 transition-transform"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 mb-4">
                <p className="text-sm text-muted-foreground">Recommended for you:</p>
                <p className="font-display text-2xl font-bold text-primary">
                  {calculateDailyWater(weight).glasses} glasses
                </p>
                <p className="text-xs text-muted-foreground">
                  (~{calculateDailyWater(weight).ml}ml/day)
                </p>
              </div>
              <Button onClick={handleCalculate} className="rounded-xl">
                <Droplets size={16} className="mr-1" /> Use This Goal
              </Button>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Your Schedule
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                We'll only send reminders while you're awake
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl bg-card border border-border p-4">
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    🌅 Wake Up Time
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-2 text-center font-display text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="rounded-2xl bg-card border border-border p-4">
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    🌙 Bed Time
                  </label>
                  <input
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-2 text-center font-display text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Frequency */}
          {step === 3 && (
            <div className="text-center">
              <div className="text-5xl mb-4">🔔</div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Reminder Frequency
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                How often should we nudge you?
              </p>
              <div className="space-y-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFrequency(f.value)}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${
                      frequency === f.value
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card text-foreground border-border"
                    }`}
                  >
                    Every {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8 w-full max-w-sm">
        {(step > 0 || showCalculator) && (
          <Button variant="ghost" onClick={handleBack} className="rounded-xl">
            <ChevronLeft size={18} />
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 rounded-xl font-display text-base py-6"
        >
          {step === STEPS.length - 1 ? "Let's Go! 🌱" : "Next"}
          {step < STEPS.length - 1 && <ChevronRight size={18} />}
        </Button>
      </div>
    </div>
  );
}
