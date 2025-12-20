import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SoundProvider } from "@/contexts/SoundContext";
import { ResponsibleGamblingBanner } from "@/components/ResponsibleGamblingBanner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EmailConfirm from "./pages/EmailConfirm";
import GamePlay from "./pages/GamePlay";
import FairPlay from "./pages/FairPlay";
import KYCVerification from "./pages/KYCVerification";
import ResponsibleGambling from "./pages/ResponsibleGambling";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AMLPolicy from "./pages/AMLPolicy";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Rewards from "./pages/Rewards";
import Raffle from "./pages/Raffle";
import Community from "./pages/Community";
import VIPClub from "./pages/VIPClub";
import Disclosure from "./pages/Disclosure";
import AdminDemoIntegrity from "./pages/AdminDemoIntegrity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SoundProvider>
          <AuthProvider>
          <ResponsibleGamblingBanner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/confirm" element={<EmailConfirm />} />
            <Route path="/game/:gameId" element={<GamePlay />} />
            <Route path="/fair-play" element={<FairPlay />} />
            <Route path="/kyc" element={<KYCVerification />} />
            <Route path="/responsible-gambling" element={<ResponsibleGambling />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/aml-policy" element={<AMLPolicy />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/raffle" element={<Raffle />} />
            <Route path="/community" element={<Community />} />
            <Route path="/vip" element={<VIPClub />} />
            <Route path="/disclosure" element={<Disclosure />} />
            <Route path="/admin/demo-integrity" element={<AdminDemoIntegrity />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </SoundProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
