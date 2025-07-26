import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Search, 
  Globe, 
  User,
  Heart,
  Package,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/lib/translations';
import { useCart } from '@/lib/cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location] = useLocation();
  
  const { language, setLanguage, t } = useLanguage();
  const { state, toggleCart, getTotalItems } = useCart();

  const navigation = [
    { name: t.home, href: '/', key: 'home' },
    { name: t.products, href: '/products', key: 'products' },
    { name: t.customDesign, href: '/custom-design', key: 'custom' },
    { name: t.contact, href: '/contact', key: 'contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar with Contact Info and Language Toggle */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>+880 1XXX-XXXXXX</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>{language === 'bn' ? 'সারা বাংলাদেশে ফ্রি ডেলিভারি' : 'Free Delivery Nationwide'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </Button>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                T
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t.companyName}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.companyTagline}</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.key} href={item.href}>
                <span className={`font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400 ${
                  isActive(item.href) 
                    ? 'text-purple-600 dark:text-purple-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-purple-500 dark:border-gray-600"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Order Tracking */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Package className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/track-order">{t.trackOrder}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>

            {/* Language Toggle Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="md:hidden"
            >
              <Globe className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-purple-500 dark:border-gray-600"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.key} href={item.href}>
                <div 
                  className={`block py-2 px-4 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </div>
              </Link>
            ))}
            
            {/* Mobile-only menu items */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/track-order">
                <div 
                  className="block py-2 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  {t.trackOrder}
                </div>
              </Link>
              
              <div className="py-2 px-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{language === 'bn' ? 'ভাষা' : 'Language'}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                  >
                    {language === 'bn' ? 'English' : 'বাংলা'}
                  </Button>
                </div>
              </div>
              
              <div className="py-2 px-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1 mb-1">
                  <Phone className="h-3 w-3" />
                  <span>+880 1XXX-XXXXXX</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="h-3 w-3" />
                  <span>{language === 'bn' ? 'সারা বাংলাদেশে ফ্রি ডেলিভারি' : 'Free Delivery Nationwide'}</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}