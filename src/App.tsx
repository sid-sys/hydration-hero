import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { BottomNav } from "@/components/BottomNav";
import { useWaterStore } from "@/lib/water-store";
import { loadProfile, saveProfile, UserProfile } from "@/lib/user-profile";
import { scheduleReminders, scheduleWeeklySummary } from "@/lib/notifications";
import { useState, useCallback } from "react";
import HomePage from "./pages/HomePage";
import StreaksPage from "./pages/StreaksPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const store = useWaterStore();
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      saveProfile(next);
      return next;
    });
  }, []);

  const handleOnboardingComplete = useCallback((newProfile: UserProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    store.updateSettings({ dailyGoal: newProfile.dailyGoal });
    // Schedule notifications with user preferences
    scheduleReminders(newProfile.notificationFrequency, newProfile.wakeTime, newProfile.bedTime, newProfile.name);
    scheduleWeeklySummary(newProfile.name);
  }, [store]);

  if (!profile.onboardingComplete) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage {...store} userName={profile.name} />} />
        <Route path="/streaks" element={<StreaksPage streak={store.streak} bestStreak={store.bestStreak} level={store.level} badges={store.badges} garden={store.garden} />} />
        <Route path="/history" element={<HistoryPage history={store.history} todayGlasses={store.todayGlasses} todayDate={store.todayDate} bestStreak={store.bestStreak} totalGlasses={store.totalGlasses} settings={store.settings} />} />
        <Route path="/settings" element={<SettingsPage settings={store.settings} updateSettings={store.updateSettings} resetProgress={store.resetProgress} profile={profile} updateProfile={updateProfile} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
