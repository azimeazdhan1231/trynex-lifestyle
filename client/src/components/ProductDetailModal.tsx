import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Star, Check, Truck, Shield, Award } from 'lucide-react';
import { useLanguage } from '@/lib/translations';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDetailModal({ product, isOpen, onOpenChange }: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { language } = useLanguage();
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
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

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted 
        ? (language === 'bn' ? "উইশলিস্ট থেকে সরানো হয়েছে" : "Removed from Wishlist")
        : (language === 'bn' ? "উইশলিস্টে যোগ হয়েছে" : "Added to Wishlist"),
      description: `${language === 'bn' ? product.nameBn : product.name}`,
    });
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image || '/api/placeholder/300/300'];
  const discountPercentage = product.originalPrice 
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {language === 'bn' ? product.nameBn : product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={images[selectedImageIndex]} 
                alt={language === 'bn' ? product.nameBn : product.name}
                className="w-full h-full object-cover"
              />
              {product.isFeatured && (
                <Badge className="absolute top-3 left-3 bg-purple-500 text-white">
                  {language === 'bn' ? 'ফিচার্ড' : 'Featured'}
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-purple-500' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            {/* Price and Rating */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  5.0 ({language === 'bn' ? 'প্রিমিয়াম মানের' : 'Premium Quality'})
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-purple-600">৳{product.price}</span>
                {product.originalPrice && discountPercentage > 0 && (
                  <span className="text-lg text-gray-500 line-through">৳{product.originalPrice}</span>
                )}
              </div>
              
              <Badge variant={product.inStock ? "default" : "destructive"} className="mb-4">
                {language === 'bn' 
                  ? (product.inStock ? 'স্টকে আছে' : 'স্টকে নেই')
                  : (product.inStock ? 'In Stock' : 'Out of Stock')
                }
              </Badge>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {language === 'bn' ? 'বিবরণ' : 'Description'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'bn' ? product.descriptionBn : product.description}
              </p>
            </div>
            
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {language === 'bn' ? 'বৈশিষ্ট্যসমূহ' : 'Features'}
                </h3>
                <ul className="space-y-2">
                  {(language === 'bn' ? product.featuresBn : product.features)?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                <span className="text-xs font-medium">
                  {language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
                </span>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-green-500 mb-1" />
                <span className="text-xs font-medium">
                  {language === 'bn' ? 'গুণগত মান' : 'Quality Assured'}
                </span>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 mx-auto text-purple-500 mb-1" />
                <span className="text-xs font-medium">
                  {language === 'bn' ? 'প্রিমিয়াম' : 'Premium'}
                </span>
              </div>
            </div>
            
            <Separator />
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleWishlistToggle}
                  className={`px-4 ${isWishlisted ? 'bg-red-50 border-red-300 text-red-600' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              {product.isCustomizable && (
                <Button 
                  variant="outline" 
                  className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                  onClick={() => window.location.href = '/custom-design'}
                >
                  {language === 'bn' ? 'কাস্টম ডিজাইন অর্ডার করুন' : 'Order Custom Design'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}