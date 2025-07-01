import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import { CartProvider } from "@/hooks/use-cart";

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import Admin from "@/pages/admin";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/products" component={Products} />
                  <Route path="/about" component={About} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/blog" component={Blog} />
                  <Route path="/admin" component={Admin} />
                  <Route path="/checkout" component={Checkout} />
                  <Route component={NotFound} />
                </Switch>
              </main>
              <Footer />
              <FloatingWhatsApp />
              <Toaster />
            </div>
          </CartProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;