import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, ShoppingCart, Heart, Star, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/translations';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { PRODUCT_CATEGORIES } from '@shared/schema';
import type { Product } from '@shared/schema';

// This component now uses only database products - no mock data

export default function HomePage() {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

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
      title: "Added to Cart!",
      description: `${language === 'bn' ? product.nameBn : product.name} has been added to your cart`,
    });
  };

  const getBadgeStyle = (badge: string) => {
    const styles = {
      bestseller: 'bg-red-500 text-white',
      popular: 'bg-blue-500 text-white',
      romantic: 'bg-pink-500 text-white',
      eco: 'bg-green-500 text-white',
      luxury: 'bg-purple-500 text-white',
      safe: 'bg-orange-500 text-white'
    };
    return styles[badge as keyof typeof styles] || 'bg-gray-500 text-white';
  };

  const getBadgeText = (badge: string) => {
    const texts = {
      bestseller: language === 'bn' ? 'বেস্ট সেলার' : 'Best Seller',
      popular: language === 'bn' ? 'জনপ্রিয়' : 'Popular',
      romantic: language === 'bn' ? 'রোমান্টিক' : 'Romantic',
      eco: language === 'bn' ? 'ইকো-ফ্রেন্ডলি' : 'Eco-Friendly',
      luxury: language === 'bn' ? 'লাক্সারি' : 'Luxury',
      safe: language === 'bn' ? 'সেফ' : 'Safe'
    };
    return texts[badge as keyof typeof texts] || badge;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Section with Search */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            {t.companyName}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.companyTagline}
          </p>
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg rounded-full border-2 border-purple-200 focus:border-purple-500 dark:border-purple-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            {language === 'bn' ? 'আমাদের ক্যাটাগরি' : 'Our Categories'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.values(PRODUCT_CATEGORIES).map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
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

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            {language === 'bn' ? 'ফিচার্ড প্রোডাক্ট' : 'Featured Products'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeleton
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:scale-105 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl">
                <div className="relative">
                  <img
                    src={product.image || '/api/placeholder/300/300'}
                    alt={language === 'bn' ? product.nameBn : product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.isFeatured && (
                    <Badge className="absolute top-3 left-3 bg-purple-500 text-white">
                      {language === 'bn' ? 'ফিচার্ড' : 'Featured'}
                    </Badge>
                  )}
                  {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                      -{Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}%
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to wishlist functionality
                    }}
                  >
                    <Heart className="h-4 w-4" />
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
                      5.0 (প্রিমিয়াম)
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
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                    </Button>
                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
                        {language === 'bn' ? 'দেখুন' : 'View'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3">
                {language === 'bn' ? 'সব প্রোডাক্ট দেখুন' : 'View All Products'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Design CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'bn' ? '🎨 কাস্টম ডিজাইন' : '🎨 Custom Design'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            {language === 'bn' 
              ? 'আপনার নিজস্ব ডিজাইন আপলোড করুন এবং এইচটিএমএল৫ ক্যানভাসে লাইভ প্রিভিউ দেখুন। ড্র্যাগ, রিসাইজ এবং রোটেট করুন।'
              : 'Upload your own design and see live preview on HTML5 canvas. Drag, resize, and rotate with precision.'}
          </p>
          <Link href="/custom-design">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
              {language === 'bn' ? 'কাস্টম ডিজাইন শুরু করুন' : 'Start Custom Design'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            {language === 'bn' ? 'কেন আমাদের বেছে নিবেন?' : 'Why Choose Us?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">
                {language === 'bn' ? 'প্রিমিয়াম কোয়ালিটি' : 'Premium Quality'}
              </h3>
              <p className="text-gray-600">
                {language === 'bn' 
                  ? 'সর্বোচ্চ মানের উপকরণ এবং দীর্ঘস্থায়ী প্রিন্ট কোয়ালিটি।'
                  : 'Highest quality materials and long-lasting print quality.'}
              </p>
            </Card>
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">
                {language === 'bn' ? 'কাস্টমাইজেশন' : 'Customization'}
              </h3>
              <p className="text-gray-600">
                {language === 'bn' 
                  ? 'আপনার পছন্দ অনুযায়ী সম্পূর্ণ কাস্টমাইজেশন সুবিধা।'
                  : 'Complete customization according to your preferences.'}
              </p>
            </Card>
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">
                {language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Fast Delivery'}
              </h3>
              <p className="text-gray-600">
                {language === 'bn' 
                  ? 'সারা বাংলাদেশে দ্রুত এবং নিরাপদ ডেলিভারি সেবা।'
                  : 'Fast and secure delivery service across Bangladesh.'}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            {t.contactUs}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{language === 'bn' ? 'ফোন' : 'Phone'}</h3>
              <p className="text-gray-600">+880 1XXX-XXXXXX</p>
            </Card>
            <Card className="text-center p-6">
              <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{language === 'bn' ? 'ইমেইল' : 'Email'}</h3>
              <p className="text-gray-600">info@trynex.com</p>
            </Card>
            <Card className="text-center p-6">
              <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{language === 'bn' ? 'ঠিকানা' : 'Address'}</h3>
              <p className="text-gray-600">{language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}