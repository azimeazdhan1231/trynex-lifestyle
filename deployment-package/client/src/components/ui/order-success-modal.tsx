import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/translations';
import { useLocation } from 'wouter';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  trackingId: string;
  customerName: string;
  totalAmount: number;
}

export default function OrderSuccessModal({
  isOpen,
  onOpenChange,
  orderId,
  trackingId,
  customerName,
  totalAmount
}: OrderSuccessModalProps) {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const copyTrackingId = async () => {
    try {
      await navigator.clipboard.writeText(trackingId);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy tracking ID:', err);
    }
  };

  const goToTracking = () => {
    onOpenChange(false);
    setLocation(`/track`);
  };

  const continueShopping = () => {
    onOpenChange(false);
    setLocation('/');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Order Success</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-8 relative">
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="confetti"></div>
            </div>
          )}
          
          {/* Success Icon */}
          <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-3xl text-green-600"></i>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            {language === 'bn' ? 'অভিনন্দন!' : 'Congratulations!'}
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            {language === 'bn' 
              ? `${customerName}, আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!` 
              : `${customerName}, your order has been placed successfully!`
            }
          </p>

          {/* Order Details Card */}
          <Card className="max-w-md mx-auto mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}
                  </span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {orderId}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === 'bn' ? 'ট্র্যাকিং আইডি:' : 'Tracking ID:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded font-bold">
                      {trackingId}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyTrackingId}
                      className="h-8 w-8 p-0"
                    >
                      <i className="fas fa-copy text-xs"></i>
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>{language === 'bn' ? 'মোট পরিমাণ:' : 'Total Amount:'}</span>
                  <span className="text-green-600">৳{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-yellow-800 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              {language === 'bn' ? 'গুরুত্বপূর্ণ তথ্য:' : 'Important Information:'}
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                {language === 'bn' 
                  ? '• পেমেন্ট কনফার্মেশনের জন্য আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে'
                  : '• Our team will contact you shortly for payment confirmation'
                }
              </li>
              <li>
                {language === 'bn' 
                  ? '• ট্র্যাকিং আইডি সংরক্ষণ করুন - এটি দিয়ে অর্ডার ট্র্যাক করতে পারবেন'
                  : '• Save your tracking ID - you can track your order with it'
                }
              </li>
              <li>
                {language === 'bn' 
                  ? '• ২৪-৪৮ ঘন্টার মধ্যে প্রোডাক্ট প্রস্তুত হবে'
                  : '• Your product will be ready within 24-48 hours'
                }
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Button onClick={goToTracking} className="flex-1 md:flex-none">
              <i className="fas fa-search mr-2"></i>
              {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}
            </Button>
            <Button variant="outline" onClick={continueShopping} className="flex-1 md:flex-none">
              <i className="fas fa-shopping-bag mr-2"></i>
              {language === 'bn' ? 'আরো কিনুন' : 'Continue Shopping'}
            </Button>
          </div>

          {/* Contact Information */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-2">
              {language === 'bn' ? 'কোনো সমস্যা হলে যোগাযোগ করুন:' : 'Need help? Contact us:'}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center">
                <i className="fas fa-phone mr-1 text-green-600"></i>
                +880 1940-689487
              </span>
              <span className="flex items-center">
                <i className="fas fa-envelope mr-1 text-blue-600"></i>
                info@trynex.com
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
      
      <style>{`
        .confetti {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle, #ff6b6b 2px, transparent 2px),
            radial-gradient(circle, #4ecdc4 2px, transparent 2px),
            radial-gradient(circle, #45b7d1 2px, transparent 2px),
            radial-gradient(circle, #f9ca24 2px, transparent 2px),
            radial-gradient(circle, #f0932b 2px, transparent 2px);
          background-size: 50px 50px, 60px 60px, 70px 70px, 80px 80px, 90px 90px;
          background-position: 0 0, 10px 10px, 20px 20px, 30px 30px, 40px 40px;
          animation: confetti-fall 3s linear infinite;
          opacity: 0.8;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </Dialog>
  );
}