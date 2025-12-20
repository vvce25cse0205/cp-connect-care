import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "./pages/HomePage";
import ChildProfilePage from "./pages/ChildProfilePage";
import ActivitiesPage from "./pages/ActivitiesPage";
import TherapySessionsPage from "./pages/TherapySessionsPage";
import MilestonesPage from "./pages/MilestonesPage";
import ProgressPage from "./pages/ProgressPage";
import HospitalsPage from "./pages/HospitalsPage";
import VideosPage from "./pages/VideosPage";
import GamesPage from "./pages/GamesPage";
import ResourcesPage from "./pages/ResourcesPage";
import ScorecardPage from "./pages/ScorecardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/child-profile" element={<ChildProfilePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/therapy" element={<TherapySessionsPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/scorecard" element={<ScorecardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
