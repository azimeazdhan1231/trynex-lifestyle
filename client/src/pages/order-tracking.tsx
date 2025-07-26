import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Package, Truck, CheckCircle, Clock, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderTimeline {
  id: string;
  status: string;
  message: string;
  messageEn: string;
  createdAt: string;
}

interface Order {
  id: string;
  trackingId: string;
  customerName: string;
  customerPhone: string;
  district: string;
  thana: string;
  address: string;
  total: string;
  status: string;
  createdAt: string;
  items: any[];
}

interface TrackingResult {
  order: Order;
  timeline: OrderTimeline[];
}

export default function OrderTracking() {
  const [trackingId, setTrackingId] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();

  const { data: trackingResult, isLoading, error } = useQuery<TrackingResult>({
    queryKey: ['/api/orders/track', trackingId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/track/${trackingId}`);
      if (!response.ok) {
        throw new Error('Order not found');
      }
      return response.json();
    },
    enabled: searchTriggered && trackingId.length > 0,
    retry: false,
  });

  const handleSearch = () => {
    if (!trackingId.trim()) {
      toast({
        title: "Error",
        description: language === 'bn' ? 'ট্র্যাকিং আইডি লিখুন' : 'Please enter tracking ID',
        variant: "destructive",
      });
      return;
    }
    setSearchTriggered(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: { en: 'Pending', bn: 'অপেক্ষমান' },
      confirmed: { en: 'Confirmed', bn: 'নিশ্চিত' },
      processing: { en: 'Processing', bn: 'প্রক্রিয়াধীন' },
      ready: { en: 'Ready', bn: 'প্রস্তুত' },
      shipped: { en: 'Shipped', bn: 'পাঠানো হয়েছে' },
      delivered: { en: 'Delivered', bn: 'ডেলিভার হয়েছে' }
    };
    return statusTexts[status as keyof typeof statusTexts] 
      ? statusTexts[status as keyof typeof statusTexts][language as 'en' | 'bn']
      : status;
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="order-tracking-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking'}
          </h1>
          <p className="text-gray-600">
            {language === 'bn' 
              ? 'আপনার অর্ডারের অবস্থা দেখতে ট্র্যাকিং আইডি লিখুন'
              : 'Enter your tracking ID to see your order status'
            }
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder={language === 'bn' ? 'ট্র্যাকিং আইডি (যেমন: TRX123456)' : 'Tracking ID (e.g., TRX123456)'}
                  value={trackingId}
                  onChange={(e) => {
                    setTrackingId(e.target.value.toUpperCase());
                    setSearchTriggered(false);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-center font-mono"
                  data-testid="input-tracking-id"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                data-testid="button-track-order"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading 
                  ? (language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...')
                  : (language === 'bn' ? 'ট্র্যাক করুন' : 'Track Order')
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="text-red-600 mb-4">
                <Package className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">
                  {language === 'bn' ? 'অর্ডার পাওয়া যায়নি' : 'Order Not Found'}
                </h3>
                <p>
                  {language === 'bn' 
                    ? 'এই ট্র্যাকিং আইডি দিয়ে কোন অর্ডার পাওয়া যায়নি। আবার চেষ্টা করুন।'
                    : 'No order found with this tracking ID. Please check and try again.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {trackingResult && (
          <div className="space-y-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{language === 'bn' ? 'অর্ডার বিস্তারিত' : 'Order Details'}</span>
                  <Badge className={getStatusColor(trackingResult.order.status)}>
                    {getStatusIcon(trackingResult.order.status)}
                    <span className="ml-2">{getStatusText(trackingResult.order.status)}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">
                      {language === 'bn' ? 'অর্ডার তথ্য' : 'Order Information'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'bn' ? 'ট্র্যাকিং আইডি:' : 'Tracking ID:'}
                        </span>
                        <span className="font-mono">{trackingResult.order.trackingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'bn' ? 'অর্ডার তারিখ:' : 'Order Date:'}
                        </span>
                        <span>{new Date(trackingResult.order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'bn' ? 'মোট পরিমাণ:' : 'Total Amount:'}
                        </span>
                        <span className="font-semibold text-purple-600">৳{trackingResult.order.total}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">
                      {language === 'bn' ? 'ডেলিভারি তথ্য' : 'Delivery Information'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{trackingResult.order.customerName}</p>
                          <p className="text-gray-600">{trackingResult.order.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p>{trackingResult.order.address}</p>
                          <p className="text-gray-600">
                            {trackingResult.order.thana}, {trackingResult.order.district}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Timeline'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingResult.timeline.map((entry, index) => (
                    <div key={entry.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(entry.status)}
                        {index < trackingResult.timeline.length - 1 && (
                          <div className="h-8 w-px bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{getStatusText(entry.status)}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {language === 'bn' ? entry.message : entry.messageEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            {trackingResult.order.items && trackingResult.order.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'অর্ডার পণ্যসমূহ' : 'Order Items'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingResult.order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-white rounded overflow-hidden">
                          <img
                            src={item.image || '/api/placeholder/300/300'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {language === 'bn' ? item.nameBn : item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'} {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">
              {language === 'bn' ? '📞 সাহায্য প্রয়োজন?' : '📞 Need Help?'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">
                  {language === 'bn' ? 'কাস্টমার সার্ভিস:' : 'Customer Service:'}
                </p>
                <p>📱 +880 1234 567890</p>
                <p>📧 support@trynex.com</p>
              </div>
              <div>
                <p className="font-medium">
                  {language === 'bn' ? 'অফিস সময়:' : 'Office Hours:'}
                </p>
                <p>
                  {language === 'bn' 
                    ? '🕘 সকাল ৯টা - রাত ৯টা (প্রতিদিন)'
                    : '🕘 9:00 AM - 9:00 PM (Daily)'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}