import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/lib/cart';
import { useLanguage } from './language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@shared/schema';

export function ProductCategories() {
  const { addItem } = useCart();
  const { t, language } = useLanguage();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: language === 'bn' ? product.name : product.nameEn,
      price: parseFloat(product.price),
      quantity: 1,
      customization: '',
    });
  };

  if (isLoading) {
    return (
      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-[600px]">
                <Skeleton className="h-64 w-full rounded-t-lg" />
                <CardContent className="p-8">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const categoryImages = {
    general: "https://images.unsplash.com/photo-1615799998603-7c6270a45196?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300",
    love: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300",
    magic: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300"
  };

  const categoryBadges = {
    general: { text: t('bestSeller'), className: "bg-primary/10 text-primary" },
    love: { text: `❤️ ${t('romantic')}`, className: "bg-gradient-to-r from-pink-500 to-red-500 text-white" },
    magic: { text: `✨ ${t('premium')}`, className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white" }
  };

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral mb-4">আমাদের স্পেশাল মগ কালেকশন</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            জন্মদিন, এনিভার্সারি, সারপ্রাইজ গিফট— যেকোন উপলক্ষে পারফেক্ট উপহার
          </p>
        </div>

        {/* Product Categories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products?.map((product) => {
            const badge = categoryBadges[product.category as keyof typeof categoryBadges];
            const features = product.features as string[];
            
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-shadow group">
                <div className="relative">
                  {badge && (
                    <Badge className={`absolute top-4 right-4 z-10 ${badge.className}`}>
                      {badge.text}
                    </Badge>
                  )}
                  <img
                    src={categoryImages[product.category as keyof typeof categoryImages] || product.image}
                    alt={language === 'bn' ? product.name : product.nameEn}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-8">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-bold text-neutral">
                      {language === 'bn' ? product.name : product.nameEn}
                    </CardTitle>
                  </CardHeader>

                  <p className="text-gray-600 mb-6">
                    {language === 'bn' ? product.description : product.descriptionEn}
                  </p>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl font-bold text-primary">৳{product.price}</span>
                      <span className="text-gray-500">{t('perPiece')}</span>
                    </div>
                    {product.category === 'general' && (
                      <div className="bg-accent/10 text-accent px-4 py-2 rounded-lg inline-block">
                        <span className="font-semibold">৪টি একসাথে অর্ডারে মোট ১৬০০৳</span>
                      </div>
                    )}
                    {product.category === 'love' && (
                      <div className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg inline-block">
                        <span className="font-semibold">৪টি একসাথে অর্ডারে মোট ২০০০৳</span>
                      </div>
                    )}
                    {product.category === 'magic' && (
                      <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg inline-block">
                        <span className="font-semibold">৪টি একসাথে অর্ডারে মোট ২৪০০৳</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {features?.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <i className={`fas fa-check ${product.category === 'love' ? 'text-pink-500' : product.category === 'magic' ? 'text-purple-500' : 'text-accent'} mr-2`}></i>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-3 rounded-full font-semibold transition-colors ${
                      product.category === 'love'
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                        : product.category === 'magic'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                        : 'bg-primary hover:bg-primary/90'
                    } text-white`}
                  >
                    <i className={`fas ${product.category === 'love' ? 'fa-heart' : product.category === 'magic' ? 'fa-magic' : 'fa-cart-plus'} mr-2`}></i>
                    অর্ডার করুন
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
