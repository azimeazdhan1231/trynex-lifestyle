import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy, Facebook, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  trackingId: string;
  customerName: string;
  totalAmount: string;
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
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: language === 'bn' ? "কপি হয়েছে!" : "Copied!",
      description: language === 'bn' ? "ট্র্যাকিং আইডি কপি করা হয়েছে" : "Tracking ID copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600">
            {language === 'bn' ? '🎉 অর্ডার সফল!' : '🎉 Order Success!'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {language === 'bn' 
                ? `ধন্যবাদ ${customerName}! আপনার অর্ডার সফলভাবে গৃহীত হয়েছে।`
                : `Thank you ${customerName}! Your order has been placed successfully.`
              }
            </p>
            
            <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">
                  {language === 'bn' ? 'ট্র্যাকিং আইডি:' : 'Tracking ID:'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(trackingId)}
                  className="p-1 h-auto"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                {trackingId}
              </Badge>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{language === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}</span>
                <span className="font-mono">{orderId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{language === 'bn' ? 'মোট পরিমাণ:' : 'Total Amount:'}</span>
                <span className="font-bold text-green-600">৳{totalAmount}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              {language === 'bn' ? 'পরবর্তী ধাপ:' : 'Next Steps:'}
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {language === 'bn' ? 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব' : 'We will contact you shortly'}</li>
              <li>• {language === 'bn' ? 'আপনার অর্ডার ট্র্যাক করতে ট্র্যাকিং আইডি ব্যবহার করুন' : 'Use tracking ID to track your order'}</li>
              <li>• {language === 'bn' ? 'ডেলিভারি ২-৫ কার্যদিবসের মধ্যে' : 'Delivery within 2-5 working days'}</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => window.location.href = '/order-tracking'}
              >
                {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="px-4"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
            
            {/* Contact & Social Media */}
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">{language === 'bn' ? 'সহায়তার জন্য যোগাযোগ করুন:' : 'Contact us for support:'}</p>
              <div className="flex justify-center gap-4">
                <a 
                  href="https://www.facebook.com/people/TryNex-Lifestyle/61576151563336/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
                <a 
                  href="tel:+8801940689487" 
                  className="flex items-center gap-1 text-green-600 hover:text-green-800"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
                <a 
                  href="mailto:info@trynex.com" 
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-800"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}