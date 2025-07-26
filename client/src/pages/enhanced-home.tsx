import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, ShoppingCart, Heart, Star, ArrowRight, Phone, Mail, MapPin, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/translations';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { PRODUCT_CATEGORIES } from '@shared/schema';
import type { Product } from '@shared/schema';
import PromoPopup from '@/components/PromoPopup';
import ProductDetailModal from '@/components/ProductDetailModal';
import SmartSearch from '@/components/SmartSearch';

export default function EnhancedHomePage() {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(new Set());

  // Fetch real products from API
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });

  // Get featured products from real API data
  const featuredProducts = products.filter(p => p.isFeatured && p.inStock).slice(0, 6);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      nameBn: product.nameBn,
      price: parseFloat(product.price),
      image: product.image || '/api/placeholder/300/300',
    });
    
    toast({
      title: language === 'bn' ? "কার্টে যোগ হয়েছে!" : "Added to Cart!",
      description: `${language === 'bn' ? product.nameBn : product.name} ${language === 'bn' ? 'কার্টে যোগ করা হয়েছে' : 'has been added to your cart'}`,
    });
  };

  const handleWishlistToggle = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const userId = 'guest-user'; // In real app, get from auth
    const isCurrentlyWishlisted = wishlistedProducts.has(productId);
    
    try {
      if (isCurrentlyWishlisted) {
        const response = await fetch(`/api/wishlist/${userId}/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const newWishlisted = new Set(wishlistedProducts);
          newWishlisted.delete(productId);
          setWishlistedProducts(newWishlisted);
          toast({
            title: language === 'bn' ? "উইশলিস্ট থেকে সরানো হয়েছে" : "Removed from Wishlist",
          });
        }
      } else {
        const response = await fetch(`/api/wishlist/${userId}/${productId}`, {
          method: 'POST',
        });
        if (response.ok) {
          const newWishlisted = new Set(wishlistedProducts);
          newWishlisted.add(productId);
          setWishlistedProducts(newWishlisted);
          toast({
            title: language === 'bn' ? "উইশলিস্টে যোগ হয়েছে" : "Added to Wishlist",
          });
        }
      }
    } catch (error) {
      toast({
        title: language === 'bn' ? "ত্রুটি" : "Error",
        description: language === 'bn' ? "অনুরোধ প্রক্রিয়া করতে সমস্যা হয়েছে" : "Failed to process request",
        variant: "destructive",
      });
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleViewDetails = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleProductSelect(product);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Section with Enhanced Search */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="mb-6 animate-fade-in">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-bounce" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-fade-in-up">
              {t.companyName}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {t.companyTagline}
            </p>
            
            {/* Enhanced Smart Search */}
            <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <SmartSearch 
                onProductSelect={handleProductSelect}
                className="w-full"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                {language === 'bn' ? 'এখনই কিনুন' : 'Shop Now'}
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg">
                <Heart className="w-5 h-5 mr-2" />
                {language === 'bn' ? 'কাস্টম ডিজাইন' : 'Custom Design'}
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Product Categories Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              {language === 'bn' ? 'আমাদের ক্যাটাগরি' : 'Our Categories'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.values(PRODUCT_CATEGORIES).map((category, index) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold group-hover:animate-pulse">
                        {category.name.charAt(0)}
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                        {language === 'bn' ? category.nameBn : category.name}
                      </h3>
                      <p className="text-purple-600 font-semibold">
                        ৳{category.priceFrom}+ {t.perPiece}
                      </p>
                      <ArrowRight className="h-5 w-5 mx-auto mt-3 text-purple-500 group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Featured Products */}
        <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              {language === 'bn' ? 'ফিচার্ড প্রোডাক্ট' : 'Featured Products'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // Enhanced Loading skeleton
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                featuredProducts.map((product, index) => (
                  <Card 
                    key={product.id} 
                    className="group hover:scale-105 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl cursor-pointer animate-fade-in-up" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="relative">
                      <img
                        src={product.image || '/api/placeholder/300/300'}
                        alt={language === 'bn' ? product.nameBn : product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.isFeatured && (
                        <Badge className="absolute top-3 left-3 bg-purple-500 text-white animate-pulse">
                          {language === 'bn' ? 'ফিচার্ড' : 'Featured'}
                        </Badge>
                      )}
                      {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white animate-bounce">
                          -{Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}%
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        className={`absolute top-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                          wishlistedProducts.has(product.id) 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-white text-gray-800 hover:bg-gray-100'
                        }`}
                        onClick={(e) => handleWishlistToggle(product.id, e)}
                      >
                        <Heart className={`h-4 w-4 ${wishlistedProducts.has(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                        {language === 'bn' ? product.nameBn : product.name}
                      </h3>
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          5.0 ({language === 'bn' ? 'প্রিমিয়াম' : 'Premium'})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-purple-600">৳{product.price}</span>
                          {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                            <span className="text-sm text-gray-500 line-through ml-2">৳{product.originalPrice}</span>
                          )}
                        </div>
                        {product.isCustomizable && (
                          <Badge variant="outline" className="border-purple-500 text-purple-600">
                            {language === 'bn' ? 'কাস্টমাইজেবল' : 'Customizable'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => handleViewDetails(product, e)}
                          className="border-purple-500 text-purple-600 hover:bg-purple-50"
                        >
                          {language === 'bn' ? 'বিস্তারিত' : 'Details'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* View All Products Button */}
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8">
                  {language === 'bn' ? 'সকল পণ্য দেখুন' : 'View All Products'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              {language === 'bn' ? 'কেন আমাদের বেছে নিবেন?' : 'Why Choose Us?'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🚚',
                  title: language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery',
                  description: language === 'bn' ? 'সারাদেশে ফ্রি ডেলিভারি সেবা' : 'Free delivery service nationwide'
                },
                {
                  icon: '🎨',
                  title: language === 'bn' ? 'কাস্টম ডিজাইন' : 'Custom Design',
                  description: language === 'bn' ? 'আপনার পছন্দমতো ডিজাইন করুন' : 'Design according to your preference'
                },
                {
                  icon: '✅',
                  title: language === 'bn' ? 'প্রিমিয়াম মানের' : 'Premium Quality',
                  description: language === 'bn' ? '১০০% গুণগত মানের নিশ্চয়তা' : '100% quality assurance'
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Contact Section */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
              {language === 'bn' ? 'যোগাযোগ করুন' : 'Get in Touch'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[
                { icon: Phone, text: '+880 1940-689487', href: 'tel:+8801940689487' },
                { icon: Mail, text: 'info@trynex.com', href: 'mailto:info@trynex.com' },
                { icon: MapPin, text: language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh', href: '#' }
              ].map((contact, index) => (
                <a key={index} href={contact.href} className="flex items-center justify-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <contact.icon className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-800 dark:text-white">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Promotional Popup */}
      <PromoPopup />

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
      />
    </>
  );
}