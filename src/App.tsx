import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useWaterStore } from "@/lib/water-store";
import HomePage from "./pages/HomePage";
import StreaksPage from "./pages/StreaksPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const store = useWaterStore();

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage {...store} />} />
        <Route path="/streaks" element={<StreaksPage streak={store.streak} bestStreak={store.bestStreak} level={store.level} badges={store.badges} garden={store.garden} />} />
        <Route path="/history" element={<HistoryPage history={store.history} todayGlasses={store.todayGlasses} todayDate={store.todayDate} bestStreak={store.bestStreak} totalGlasses={store.totalGlasses} settings={store.settings} />} />
        <Route path="/settings" element={<SettingsPage settings={store.settings} updateSettings={store.updateSettings} resetProgress={store.resetProgress} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
