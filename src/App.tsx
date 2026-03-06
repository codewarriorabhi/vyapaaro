import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import DesktopHeader from "@/components/DesktopHeader";
import Index from "./pages/Index";
import ShopListing from "./pages/ShopListing";
import ShopProfile from "./pages/ShopProfile";
import ProductDetail from "./pages/ProductDetail";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/SignupPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const splash = document.getElementById("splash-screen");
    if (splash) {
      splash.style.transition = "opacity 0.4s ease";
      splash.style.opacity = "0";
      setTimeout(() => splash.remove(), 400);
    }
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DesktopHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shops" element={<ShopListing />} />
          <Route path="/shop/:id" element={<ShopProfile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
