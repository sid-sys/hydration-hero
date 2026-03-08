import { useState, useEffect, useCallback } from "react";

// Types
export interface DayRecord {
  date: string; // YYYY-MM-DD
  glasses: number;
  goalMet: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface PlantEntry {
  id: string;
  name: string;
  completedDate: string;
  plantType: number;
}

export interface WaterSettings {
  dailyGoal: number;
  cupSize: "small" | "medium" | "large";
  reminderInterval: number; // hours
}

export interface WaterState {
  todayGlasses: number;
  todayDate: string;
  streak: number;
  bestStreak: number;
  totalGlasses: number;
  xp: number;
  level: number;
  history: DayRecord[];
  badges: Badge[];
  garden: PlantEntry[];
  settings: WaterSettings;
}

const CUP_ML: Record<string, number> = { small: 150, medium: 250, large: 350 };

const DEFAULT_BADGES: Badge[] = [
  { id: "first_sip", name: "First Sip", description: "Log your first glass", icon: "💧", earned: false },
  { id: "streak_3", name: "3-Day Streak", description: "Stay hydrated 3 days in a row", icon: "🔥", earned: false },
  { id: "streak_7", name: "Week Warrior", description: "7-day streak", icon: "⚡", earned: false },
  { id: "streak_30", name: "30-Day Legend", description: "30-day streak", icon: "🏆", earned: false },
  { id: "first_bloom", name: "First Bloom", description: "Complete your first daily goal", icon: "🌸", earned: false },
  { id: "gardener", name: "Green Thumb", description: "Grow 5 plants", icon: "🌿", earned: false },
  { id: "hydration_master", name: "Hydration Master", description: "Drink 100 total glasses", icon: "🌊", earned: false },
  { id: "overachiever", name: "Overachiever", description: "Exceed daily goal by 50%", icon: "⭐", earned: false },
];

const STORAGE_KEY = "water_reminder_state";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getDefaultState(): WaterState {
  return {
    todayGlasses: 0,
    todayDate: getToday(),
    streak: 0,
    bestStreak: 0,
    totalGlasses: 0,
    xp: 0,
    level: 1,
    history: [],
    badges: [...DEFAULT_BADGES],
    garden: [],
    settings: { dailyGoal: 8, cupSize: "medium", reminderInterval: 2 },
  };
}

function loadState(): WaterState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const state = JSON.parse(raw) as WaterState;
    // Check if day changed
    const today = getToday();
    if (state.todayDate !== today) {
      // Finalize previous day
      const prevGoalMet = state.todayGlasses >= state.settings.dailyGoal;
      state.history.push({
        date: state.todayDate,
        glasses: state.todayGlasses,
        goalMet: prevGoalMet,
      });
      if (prevGoalMet) {
        state.streak += 1;
        state.bestStreak = Math.max(state.bestStreak, state.streak);
        // Add plant to garden
        state.garden.push({
          id: `plant_${state.todayDate}`,
          name: `Plant ${state.garden.length + 1}`,
          completedDate: state.todayDate,
          plantType: (state.garden.length % 4),
        });
      } else {
        state.streak = 0;
      }
      state.todayGlasses = 0;
      state.todayDate = today;
    }
    // Ensure badges exist
    if (!state.badges || state.badges.length < DEFAULT_BADGES.length) {
      state.badges = DEFAULT_BADGES.map(b => {
        const existing = state.badges?.find(e => e.id === b.id);
        return existing || b;
      });
    }
    return state;
  } catch {
    return getDefaultState();
  }
}

function saveState(state: WaterState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function xpForLevel(level: number): number {
  return level * 50;
}

export function getPlantStage(glasses: number, goal: number): number {
  const pct = Math.min(glasses / goal, 1);
  if (pct === 0) return 0;
  if (pct < 0.25) return 1;
  if (pct < 0.5) return 2;
  if (pct < 0.75) return 3;
  if (pct < 1) return 4;
  return 5;
}

export function useWaterStore() {
  const [state, setState] = useState<WaterState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const drinkWater = useCallback(() => {
    setState(prev => {
      const next = { ...prev };
      const alreadyMetGoal = next.todayGlasses >= next.settings.dailyGoal;
      next.todayGlasses += 1;
      next.totalGlasses += 1;

      // Only award XP if goal not yet met
      if (!alreadyMetGoal) {
        next.xp += 10;

        // Level up check
        while (next.xp >= xpForLevel(next.level)) {
          next.xp -= xpForLevel(next.level);
          next.level += 1;
        }
      }

      // Check badges
      const badges = [...next.badges];
      const earn = (id: string) => {
        const b = badges.find(b => b.id === id);
        if (b && !b.earned) { b.earned = true; b.earnedDate = getToday(); }
      };
      if (next.totalGlasses >= 1) earn("first_sip");
      if (next.todayGlasses >= next.settings.dailyGoal) earn("first_bloom");
      if (next.totalGlasses >= 100) earn("hydration_master");
      if (next.todayGlasses >= Math.ceil(next.settings.dailyGoal * 1.5)) earn("overachiever");
      next.badges = badges;

      return next;
    });
  }, []);

  const updateSettings = useCallback((settings: Partial<WaterSettings>) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = getDefaultState();
    setState(fresh);
  }, []);

  // Check streak badges
  useEffect(() => {
    setState(prev => {
      const badges = [...prev.badges];
      const earn = (id: string) => {
        const b = badges.find(b => b.id === id);
        if (b && !b.earned) { b.earned = true; b.earnedDate = getToday(); }
      };
      if (prev.streak >= 3) earn("streak_3");
      if (prev.streak >= 7) earn("streak_7");
      if (prev.streak >= 30) earn("streak_30");
      if (prev.garden.length >= 5) earn("gardener");
      return { ...prev, badges };
    });
  }, [state.streak, state.garden.length]);

  const progress = Math.min(state.todayGlasses / state.settings.dailyGoal, 1);
  const goalMet = state.todayGlasses >= state.settings.dailyGoal;

  return { ...state, progress, goalMet, drinkWater, updateSettings, resetProgress };
}
