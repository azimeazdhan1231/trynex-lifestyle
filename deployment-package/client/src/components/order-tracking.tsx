import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from './language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface OrderTrackingResult {
  order: {
    id: string;
    trackingId: string;
    customerName: string;
    status: string;
    totalAmount: string;
    createdAt: string;
  };
  timeline: Array<{
    status: string;
    message: string;
    messageEn: string;
    createdAt: string;
  }>;
}

export function OrderTracking() {
  const [trackingId, setTrackingId] = useState('');
  const [searchId, setSearchId] = useState('');
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const { data: trackingResult, isLoading, error } = useQuery<OrderTrackingResult>({
    queryKey: ['/api/orders/track', searchId],
    enabled: !!searchId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast({
        title: "ত্রুটি",
        description: "অনুগ্রহ করে ট্র্যাকিং আইডি দিন",
        variant: "destructive",
      });
      return;
    }
    setSearchId(trackingId.trim());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="track" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">{t('trackOrder')}</h2>
            <p className="text-lg text-gray-600">আপনার ট্র্যাকিং আইডি দিয়ে অর্ডারের অবস্থা জানুন</p>
          </div>

          {/* Tracking Form */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-neutral mb-3">
                    {t('trackingId')}
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={t('trackingPlaceholder')}
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="pr-12"
                    />
                    <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      খোঁজা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      {t('track')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tracking Result */}
          {error && (
            <Card className="border-red-200">
              <CardContent className="p-8 text-center">
                <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                <h3 className="text-lg font-semibold text-red-800 mb-2">অর্ডার খুঁজে পাওয়া যায়নি</h3>
                <p className="text-red-600">অনুগ্রহ করে সঠিক ট্র্যাকিং আইডি দিন অথবা আমাদের সাথে যোগাযোগ করুন।</p>
              </CardContent>
            </Card>
          )}

          {trackingResult && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>অর্ডার {trackingResult.order.trackingId}</CardTitle>
                  <Badge className={getStatusColor(trackingResult.order.status)}>
                    {t(trackingResult.order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Order Details */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">কাস্টমার নাম</p>
                      <p className="font-semibold">{trackingResult.order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">মোট পরিমাণ</p>
                      <p className="font-semibold">৳{trackingResult.order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">অর্ডারের তারিখ</p>
                      <p className="font-semibold">{formatDate(trackingResult.order.createdAt)}</p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">অর্ডার টাইমলাইন</h4>
                    <div className="space-y-4">
                      {trackingResult.timeline.map((entry, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-4 h-4 bg-accent rounded-full mr-4 mt-1"></div>
                          <div>
                            <p className="font-semibold text-neutral">
                              {language === 'bn' ? entry.message : entry.messageEn}
                            </p>
                            <p className="text-sm text-gray-600">{formatDate(entry.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
