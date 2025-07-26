import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/translations';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Product, Wishlist } from '@shared/schema';

export default function WishlistPage() {
  const { language } = useLanguage();
  const { addItem } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userId] = useState('guest-user'); // In real app, get from auth

  // Fetch wishlist items
  const { data: wishlistItems = [], isLoading } = useQuery<Wishlist[]>({
    queryKey: ['/api/wishlist', userId],
  });

  // Fetch all products to get details for wishlist items
  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Get wishlist products with full details
  const wishlistProducts = wishlistItems
    .map(item => allProducts.find(product => product.id === item.productId))
    .filter(Boolean) as Product[];

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => 
      apiRequest(`/api/wishlist/${userId}/${productId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist', userId] });
      toast({
        title: language === 'bn' ? "উইশলিস্ট থেকে সরানো হয়েছে" : "Removed from Wishlist",
        description: language === 'bn' ? "পণ্যটি আপনার উইশলিস্ট থেকে সরানো হয়েছে" : "Product removed from your wishlist",
      });
    },
  });

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

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlistMutation.mutate(productId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {language === 'bn' ? 'উইশলিস্ট লোড হচ্ছে...' : 'Loading wishlist...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500 mr-3 fill-current" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {language === 'bn' ? 'আমার উইশলিস্ট' : 'My Wishlist'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আপনার পছন্দের পণ্যগুলি এখানে সংরক্ষিত আছে। যেকোনো সময় কার্টে যোগ করুন।'
              : 'Your favorite products are saved here. Add them to cart anytime.'
            }
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'bn' ? 'আপনার উইশলিস্ট খালি' : 'Your wishlist is empty'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {language === 'bn' 
                ? 'পছন্দের পণ্যগুলি উইশলিস্টে যোগ করুন এবং পরে কিনুন।'
                : 'Add your favorite products to wishlist and purchase them later.'
              }
            </p>
            <Button 
              onClick={() => window.location.href = '/products'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
            >
              {language === 'bn' ? 'পণ্য দেখুন' : 'Browse Products'}
            </Button>
          </div>
        ) : (
          <>
            {/* Wishlist Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {language === 'bn' ? 'উইশলিস্ট সামারি' : 'Wishlist Summary'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'bn' 
                      ? `মোট ${wishlistProducts.length} টি পণ্য সংরক্ষিত`
                      : `${wishlistProducts.length} items saved`
                    }
                  </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    onClick={() => {
                      wishlistProducts.forEach(product => handleAddToCart(product));
                    }}
                    className="border-purple-500 text-purple-600 hover:bg-purple-50"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {language === 'bn' ? 'সব কার্টে যোগ করুন' : 'Add All to Cart'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Wishlist Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group hover:scale-105 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl animate-fade-in-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      src={product.image || '/api/placeholder/300/300'}
                      alt={language === 'bn' ? product.nameBn : product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
                      variant="destructive"
                      className="absolute top-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      disabled={removeFromWishlistMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white line-clamp-2">
                      {language === 'bn' ? product.nameBn : product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {language === 'bn' ? product.descriptionBn : product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-purple-600">৳{product.price}</span>
                        {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                          <span className="text-sm text-gray-500 line-through ml-2">৳{product.originalPrice}</span>
                        )}
                      </div>
                      {product.isCustomizable && (
                        <Badge variant="outline" className="border-purple-500 text-purple-600 text-xs">
                          {language === 'bn' ? 'কাস্টমাইজেবল' : 'Custom'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm py-2"
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        disabled={removeFromWishlistMutation.isPending}
                        className="px-3 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center mt-12">
              <Button 
                onClick={() => window.location.href = '/products'}
                variant="outline"
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8"
              >
                {language === 'bn' ? 'আরো পণ্য দেখুন' : 'Continue Shopping'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}