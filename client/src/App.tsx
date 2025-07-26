import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/translations";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/layout/Header";
import CartSidebar from "@/components/layout/CartSidebar";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Checkout from "@/pages/checkout";
import CustomDesign from "@/pages/custom-design";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={() => <div className="p-8 text-center">Products Page Coming Soon</div>} />
          <Route path="/custom-design" component={CustomDesign} />
          <Route path="/contact" component={() => <div className="p-8 text-center">Contact Page Coming Soon</div>} />
          <Route path="/admin" component={Admin} />
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
      </main>
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
