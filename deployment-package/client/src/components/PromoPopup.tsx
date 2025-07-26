import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Gift, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/translations';
import type { PromoOffer } from '@shared/schema';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { language } = useLanguage();

  // Fetch popup promo offers
  const { data: promoOffers = [] } = useQuery<PromoOffer[]>({
    queryKey: ['/api/promo-offers/popup'],
    enabled: !hasShown,
  });

  useEffect(() => {
    if (promoOffers.length > 0 && !hasShown) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [promoOffers, hasShown]);

  if (promoOffers.length === 0) return null;

  const offer = promoOffers[0]; // Show the first active popup offer

  const daysLeft = Math.ceil((new Date(offer.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {language === 'bn' ? '🎉 স্পেশাল অফার!' : '🎉 Special Offer!'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {offer.image && (
            <img 
              src={offer.image} 
              alt={language === 'bn' ? offer.titleBn : offer.title}
              className="w-full h-32 object-cover rounded-lg"
            />
          )}
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {language === 'bn' ? offer.titleBn : offer.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'bn' ? offer.descriptionBn : offer.description}
            </p>
            
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white mb-4">
              {offer.discountPercentage}% {language === 'bn' ? 'ছাড়!' : 'OFF!'}
            </Badge>
            
            <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
              <Clock className="w-4 h-4 mr-1" />
              {language === 'bn' 
                ? `${daysLeft} দিন বাকি` 
                : `${daysLeft} days left`
              }
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => {
                setIsOpen(false);
                // Navigate to products page
                window.location.href = '/products';
              }}
            >
              {language === 'bn' ? 'এখনই কিনুন' : 'Shop Now'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="px-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}