export interface UserProfile {
  name: string;
  dailyGoal: number; // glasses
  wakeTime: string; // HH:MM
  bedTime: string; // HH:MM
  notificationFrequency: number; // hours
  onboardingComplete: boolean;
  bodyWeight?: number;
  isPremium: boolean;
}

const PROFILE_KEY = "water_user_profile";

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  dailyGoal: 8,
  wakeTime: "07:00",
  bedTime: "22:00",
  notificationFrequency: 2,
  onboardingComplete: false,
  isPremium: false,
};

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function calculateDailyWater(weightKg: number): { ml: number; glasses: number } {
  // ~35ml per kg body weight
  const ml = Math.round(weightKg * 35);
  const glasses = Math.round(ml / 250); // 250ml per glass
  return { ml, glasses };
}
