import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { BottomNav } from "@/components/BottomNav";
import { useWaterStore } from "@/lib/water-store";
import { loadProfile, saveProfile, UserProfile } from "@/lib/user-profile";
import { scheduleReminders, scheduleWeeklySummary } from "@/lib/notifications";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import StreaksPage from "./pages/StreaksPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
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

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeOut" }}><HomePage {...store} userName={profile.name} /></motion.div>} />
          <Route path="/streaks" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeOut" }}><StreaksPage streak={store.streak} bestStreak={store.bestStreak} level={store.level} badges={store.badges} garden={store.garden} /></motion.div>} />
          <Route path="/history" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeOut" }}><HistoryPage history={store.history} todayGlasses={store.todayGlasses} todayDate={store.todayDate} bestStreak={store.bestStreak} totalGlasses={store.totalGlasses} settings={store.settings} /></motion.div>} />
          <Route path="/settings" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeOut" }}><SettingsPage settings={store.settings} updateSettings={store.updateSettings} resetProgress={store.resetProgress} profile={profile} updateProfile={updateProfile} /></motion.div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
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
