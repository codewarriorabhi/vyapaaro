import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SavedItemsProvider } from "@/contexts/SavedItemsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import DesktopHeader from "@/components/DesktopHeader";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import ShopListing from "./pages/ShopListing";
import ShopProfile from "./pages/ShopProfile";
import ProductDetail from "./pages/ProductDetail";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MyShopsPage from "./pages/MyShopsPage";
import AddShopPage from "./pages/AddShopPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ShopProductsPage from "./pages/ShopProductsPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import ShopAnalyticsPage from "./pages/ShopAnalyticsPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const healthChecked = useRef(false);

  useEffect(() => {
    const splash = document.getElementById("splash-screen");
    if (splash) {
      splash.style.transition = "opacity 0.4s ease";
      splash.style.opacity = "0";
      setTimeout(() => splash.remove(), 400);
    }
  }, []);

  useEffect(() => {
    if (healthChecked.current) return;
    healthChecked.current = true;

    api.get("/health", undefined, undefined, { silent: true }).then((res) => {
      if (res.error || res.status === 0) {
        console.warn("[Health Check] API unreachable:", res.error);
      } else {
        console.log("[Health Check] API is reachable ✓");
      }
    });
  }, []);

  // Get logged-in user on app load
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log("User:", data.user);
    };

    getUser();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SavedItemsProvider>
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route 
            path="/my-shops" 
            element={
              <ProtectedRoute requiredRole="shop_owner">
                <MyShopsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-shop" 
            element={
              <ProtectedRoute requiredRole="shop_owner">
                <AddShopPage />
              </ProtectedRoute>
            } 
          />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/shop/:shopId/products" element={<ShopProductsPage />} />
          <Route path="/place-order" element={<PlaceOrderPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route 
            path="/shop/:shopId/analytics" 
            element={
              <ProtectedRoute requiredRole="shop_owner">
                <ShopAnalyticsPage />
              </ProtectedRoute>
            } 
          />
              <Route path="/help-support" element={<HelpSupportPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <BottomNav />
          </BrowserRouter>
        </TooltipProvider>
      </SavedItemsProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
