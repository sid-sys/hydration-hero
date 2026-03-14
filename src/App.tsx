import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { BottomNav } from "@/components/BottomNav";
import { useWaterStore } from "@/lib/water-store";
import { loadProfile, saveProfile, UserProfile } from "@/lib/user-profile";
import { scheduleReminders, scheduleWeeklySummary, setupNotificationActions } from "@/lib/notifications";
import { initializeAdMob, showBanner, hideBanner } from "@/lib/admob";
import { initBilling, purchaseRemoveAds, restorePurchases } from "@/lib/billing";
import SplashScreen from "./pages/SplashScreen";

import { useState, useCallback, useEffect } from "react";
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
  const [showSplash, setShowSplash] = useState(true);

  // Called by billing.ts when a purchase/restore is confirmed
  const grantPremium = useCallback(() => {
    store.setPremium(true);
    setProfile(prev => {
      const next = { ...prev, isPremium: true };
      saveProfile(next);
      return next;
    });
    hideBanner();
  }, [store]);

  useEffect(() => {
    setupNotificationActions();
    initializeAdMob();
    // Initialize real Google Play / AppStore billing
    initBilling(grantPremium);
  }, [grantPremium]);

  useEffect(() => {
    if (profile.onboardingComplete && !profile.isPremium) {
      showBanner();
    } else {
      hideBanner();
    }
  }, [profile.onboardingComplete, profile.isPremium]);

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
    scheduleReminders(newProfile.notificationFrequency, newProfile.wakeTime, newProfile.bedTime, newProfile.name);
    scheduleWeeklySummary(newProfile.name);
  }, [store]);

  // Full reset — preserves isPremium in water-store already; also preserve in profile state
  const handleResetAll = useCallback(() => {
    const wasPremium = profile.isPremium;
    store.resetAll(); // internally preserves isPremium in state
    const freshProfile = loadProfile(); // will be default (empty) since storage cleared
    freshProfile.isPremium = wasPremium; // keep premium status in profile too
    saveProfile(freshProfile);
    setProfile(freshProfile);
    setShowSplash(true); // → splash → onboarding
  }, [store, profile.isPremium]);

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onDone={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && !profile.onboardingComplete && (
        <OnboardingPage onComplete={handleOnboardingComplete} />
      )}

      {!showSplash && profile.onboardingComplete && (
        <div className={`min-h-screen bg-background transition-all duration-300 ${!profile.isPremium ? 'pt-[60px]' : ''}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeOut" }}>
                  <HomePage {...store} userName={profile.name} lastDrinkTime={store.lastDrinkTime} isPremium={profile.isPremium} />
                </motion.div>
              } />
              <Route path="/streaks" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeOut" }}>
                  <StreaksPage streak={store.streak} bestStreak={store.bestStreak} level={store.level} badges={store.badges} history={store.history} />
                </motion.div>
              } />
              <Route path="/history" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeOut" }}>
                  <HistoryPage history={store.history} todayGlasses={store.todayGlasses} todayDate={store.todayDate} bestStreak={store.bestStreak} totalGlasses={store.totalGlasses} settings={store.settings} drinkLog={store.drinkLog} />
                </motion.div>
              } />
              <Route path="/settings" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeOut" }}>
                  <SettingsPage
                    settings={store.settings}
                    updateSettings={store.updateSettings}
                    resetProgress={handleResetAll}
                    profile={profile}
                    updateProfile={updateProfile}
                    setPremium={store.setPremium}
                    purchaseRemoveAds={purchaseRemoveAds}
                    restorePurchases={restorePurchases}
                  />
                </motion.div>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <BottomNav />
        </div>
      )}
    </>
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
