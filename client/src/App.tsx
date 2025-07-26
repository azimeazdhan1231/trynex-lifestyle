import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/translations";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/layout/CartSidebar";
import Home from "@/pages/enhanced-home";
import Products from "@/pages/products";
import Admin from "@/pages/admin";
import ComprehensiveAdmin from "@/pages/comprehensive-admin";
import Checkout from "@/pages/checkout";
import CustomDesign from "@/pages/custom-design";
import OrderTracking from "@/pages/order-tracking";
import Contact from "@/pages/contact";
import Wishlist from "@/pages/wishlist";
import TermsConditions from "@/pages/terms-conditions";
import ReturnPolicy from "@/pages/return-policy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/custom-design" component={CustomDesign} />
          <Route path="/contact" component={Contact} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/terms-conditions" component={TermsConditions} />
          <Route path="/return-policy" component={ReturnPolicy} />
          <Route path="/admin" component={ComprehensiveAdmin} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/track" component={OrderTracking} />
          <Route path="/order-tracking" component={OrderTracking} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <CartProvider>
            <Router />
            <Toaster />
          </CartProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
