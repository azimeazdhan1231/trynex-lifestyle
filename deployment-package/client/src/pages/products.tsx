import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/translations';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import type { Product } from '@shared/schema';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Fetch products from API
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.nameBn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory && product.inStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      nameBn: product.nameBn,
      price: parseFloat(product.price),
      image: product.image,
    });
    
    toast({
      title: "Added to Cart!",
      description: `${language === 'bn' ? product.nameBn : product.name} has been added to your cart`,
    });
  };

  const categories = [
    { value: 'all', label: 'All Products', labelBn: 'সব পণ্য' },
    { value: 'mugs', label: 'Mugs', labelBn: 'মগ' },
    { value: 'tshirts', label: 'T-Shirts', labelBn: 'টি-শার্ট' },
    { value: 'keychains', label: 'Keychains', labelBn: 'চাবির চেইন' },
    { value: 'water-bottles', label: 'Water Bottles', labelBn: 'পানির বোতল' },
    { value: 'gift-for-him', label: 'Gift for Him', labelBn: 'তার জন্য উপহার' },
    { value: 'gift-for-her', label: 'Gift for Her', labelBn: 'তার জন্য উপহার' },
    { value: 'for-couple', label: 'For Couple', labelBn: 'কাপলের জন্য' },
  ];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="products-page">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {language === 'bn' ? 'আমাদের পণ্যসমূহ' : 'Our Products'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'bn' 
            ? 'আমাদের বিস্তৃত কালেকশন থেকে আপনার পছন্দের পণ্য খুঁজে নিন'
            : 'Discover your favorite products from our extensive collection'
          }
        </p>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'bn' ? 'খুঁজুন' : 'Search'}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={language === 'bn' ? 'পণ্য খুঁজুন...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {language === 'bn' ? cat.labelBn : cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'bn' ? 'সাজান' : 'Sort By'}
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">
                  {language === 'bn' ? 'নাম অনুসারে' : 'Name'}
                </SelectItem>
                <SelectItem value="price-low">
                  {language === 'bn' ? 'কম দাম আগে' : 'Price: Low to High'}
                </SelectItem>
                <SelectItem value="price-high">
                  {language === 'bn' ? 'বেশি দাম আগে' : 'Price: High to Low'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {language === 'bn' 
                ? `${filteredProducts.length} টি পণ্য পাওয়া গেছে`
                : `${filteredProducts.length} products found`
              }
            </div>
          </div>
        </div>
      </div>
      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-4">
            {language === 'bn' ? 'কোন পণ্য পাওয়া যায়নি' : 'No products found'}
          </h3>
          <p className="text-gray-600">
            {language === 'bn' 
              ? 'অন্য ক্যাটাগরি বা কীওয়ার্ড চেষ্টা করুন'
              : 'Try a different category or search term'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-bold">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300" data-testid={`card-product-${product.id}`}>
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image || '/api/placeholder/300/300'}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {language === 'bn' ? 'ছাড়' : 'Sale'}
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="absolute top-2 right-2 bg-purple-500">
                    {language === 'bn' ? 'ফিচার্ড' : 'Featured'}
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {language === 'bn' ? product.nameBn : product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {language === 'bn' ? product.descriptionBn : product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-purple-600">
                      ৳{product.price}
                    </span>
                    {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                      <span className="text-sm text-gray-500 line-through">
                        ৳{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {language === 'bn' 
                      ? (product.inStock ? 'স্টকে আছে' : 'স্টকে নেই')
                      : (product.inStock ? 'In Stock' : 'Out of Stock')
                    }
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="flex-1"
                    data-testid={`button-add-cart-${product.id}`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    data-testid={`button-wishlist-${product.id}`}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <ul className="text-xs text-gray-600 space-y-1">
                      {(language === 'bn' ? product.featuresBn : product.features)?.slice(0, 2).map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Load More */}
      {filteredProducts.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {language === 'bn' 
              ? `মোট ${products.length} টি পণ্য থেকে ${filteredProducts.length} টি দেখানো হচ্ছে`
              : `Showing ${filteredProducts.length} of ${products.length} products`
            }
          </p>
        </div>
      )}
    </div>
  );
}