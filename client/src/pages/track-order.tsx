import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { Order, OrderTimeline } from '@shared/schema';

export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState('');
  const [searchedId, setSearchedId] = useState('');
  const { language } = useLanguage();

  const { data: trackingData, isLoading, error } = useQuery<{
    order: Order;
    timeline: OrderTimeline[];
  }>({
    queryKey: ['/api/orders/track', searchedId],
    enabled: !!searchedId,
    retry: false,
  });

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearchedId(trackingId.trim());
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'processing': return 'default';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'pending': language === 'bn' ? 'অপেক্ষমান' : 'Pending',
      'confirmed': language === 'bn' ? 'নিশ্চিত' : 'Confirmed',
      'processing': language === 'bn' ? 'প্রস্তুত হচ্ছে' : 'Processing',
      'shipped': language === 'bn' ? 'পাঠানো হয়েছে' : 'Shipped',
      'delivered': language === 'bn' ? 'ডেলিভার করা হয়েছে' : 'Delivered',
      'cancelled': language === 'bn' ? 'বাতিল' : 'Cancelled',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral mb-2">
              {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Your Order'}
            </h1>
            <p className="text-gray-600">
              {language === 'bn' 
                ? 'আপনার অর্ডারের ট্র্যাকিং আইডি দিয়ে অর্ডারের অবস্থা জানুন' 
                : 'Enter your tracking ID to check order status'
              }
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleTrack} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder={language === 'bn' ? 'ট্র্যাকিং আইডি (TRX.....)' : 'Tracking ID (TRX.....)'} 
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      {language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...'}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      {language === 'bn' ? 'ট্র্যাক করুন' : 'Track Order'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {error && (
            <Card className="mb-8">
              <CardContent className="p-6 text-center">
                <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {language === 'bn' ? 'অর্ডার পাওয়া যায়নি' : 'Order Not Found'}
                </h3>
                <p className="text-gray-600">
                  {language === 'bn' 
                    ? 'এই ট্র্যাকিং আইডি দিয়ে কোনো অর্ডার খুঁজে পাওয়া যায়নি। অনুগ্রহ করে ট্র্যাকিং আইডি পুনরায় চেক করুন।'
                    : 'No order found with this tracking ID. Please check your tracking ID and try again.'
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {trackingData && (
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{language === 'bn' ? 'অর্ডার তথ্য' : 'Order Information'}</span>
                    <Badge variant={getStatusBadgeVariant(trackingData.order.status)}>
                      {getStatusText(trackingData.order.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">{language === 'bn' ? 'অর্ডার বিবরণ' : 'Order Details'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'bn' ? 'ট্র্যাকিং আইডি:' : 'Tracking ID:'}</span>
                          <span className="font-mono">{trackingData.order.trackingId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'bn' ? 'অর্ডার তারিখ:' : 'Order Date:'}</span>
                          <span>{new Date(trackingData.order.createdAt || '').toLocaleDateString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'bn' ? 'মোট টাকা:' : 'Total Amount:'}</span>
                          <span className="font-semibold">৳{trackingData.order.total || '0'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{language === 'bn' ? 'কাস্টমার তথ্য' : 'Customer Information'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'bn' ? 'নাম:' : 'Name:'}</span>
                          <span>{trackingData.order.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'bn' ? 'ফোন:' : 'Phone:'}</span>
                          <span>{trackingData.order.customerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'bn' ? 'ঠিকানা:' : 'Address:'}</span>
                          <span>{trackingData.order.district}, {trackingData.order.thana}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Timeline'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.timeline.map((entry, index) => (
                      <div key={entry.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          {index !== trackingData.timeline.length - 1 && (
                            <div className="w-px h-8 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant={getStatusBadgeVariant(entry.status)}>
                              {getStatusText(entry.status)}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(entry.createdAt || '').toLocaleString('bn-BD')}
                            </span>
                          </div>
                          {entry.message && (
                            <p className="text-sm text-gray-700">
                              {language === 'bn' ? entry.message : entry.messageEn}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'সাহায্য প্রয়োজন?' : 'Need Help?'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline" className="flex-1">
                  <i className="fas fa-phone mr-2"></i>
                  {language === 'bn' ? 'কল করুন: +880 1940-689487' : 'Call: +880 1940-689487'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <i className="fas fa-envelope mr-2"></i>
                  {language === 'bn' ? 'ইমেইল: info@trynex.com' : 'Email: info@trynex.com'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}