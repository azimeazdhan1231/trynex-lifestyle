import { useState } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/lib/cart';
import { useLanguage } from './language-provider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const { state: cartState, toggleCart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/#products', label: t('products') },
    { href: '/#about', label: t('about') },
    { href: '/#track', label: t('track') },
    { href: '/#contact', label: t('contact') },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="border-b border-gray-200 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-neutral">
                <i className="fas fa-phone text-primary"></i> +880 1940689487
              </span>
              <span className="text-neutral hidden sm:inline">
                <i className="fas fa-envelope text-primary"></i> trynex-lifestyle@gmail.com
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-neutral hover:text-primary transition-colors"
              >
                <i className="fas fa-globe mr-1"></i>
                <span>{language === 'bn' ? 'বাং/ENG' : 'ENG/বাং'}</span>
              </Button>
              <Link href="/admin" className="text-neutral hover:text-primary transition-colors">
                <i className="fas fa-user-shield"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <i className="fas fa-mug-hot text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral">{t('companyName')}</h1>
                <p className="text-sm text-gray-600">{t('companyTagline')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    if (item.href.includes('#')) {
                      const sectionId = item.href.split('#')[1];
                      scrollToSection(sectionId);
                    } else {
                      window.location.href = item.href;
                    }
                  }}
                  className="text-neutral hover:text-primary font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Cart & Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCart}
                className="relative p-2 text-neutral hover:text-primary transition-colors"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                {cartState.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <i className="fas fa-bars text-xl"></i>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          if (item.href.includes('#')) {
                            const sectionId = item.href.split('#')[1];
                            scrollToSection(sectionId);
                          } else {
                            window.location.href = item.href;
                          }
                        }}
                        className="text-left text-neutral hover:text-primary font-medium transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
