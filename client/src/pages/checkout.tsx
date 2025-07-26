import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCart } from '@/lib/cart';
import { useLanguage } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { getDistricts, getThanas } from '@/lib/districts';
import { apiRequest } from '@/lib/queryClient';

interface CheckoutForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  district: string;
  thana: string;
  address: string;
  paymentMethod: string;
  paymentNumber: string;
  notes: string;
}

export default function Checkout() {
  const { state: cartState, clearCart } = useCart();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [form, setForm] = useState<CheckoutForm>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    district: '',
    thana: '',
    address: '',
    paymentMethod: '',
    paymentNumber: '',
    notes: '',
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [designFiles, setDesignFiles] = useState<File[]>([]);

  const districts = getDistricts();
  const thanas = form.district ? getThanas(form.district) : [];

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: FormData) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: orderData,
      });
      
      if (!response.ok) {
        throw new Error('Order creation failed');
      }
      
      return response.json();
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "সফল!",
        description: `আপনার অর্ডার সফলভাবে প্লেস হয়েছে। ট্র্যাকিং আইডি: ${order.trackingId}`,
      });
      
      // Show order confirmation with tracking ID
      setTimeout(() => {
        window.location.href = `/#track`;
      }, 2000);
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "অর্ডার প্লেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear thana when district changes
    if (field === 'district') {
      setForm(prev => ({ ...prev, thana: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'payment' | 'design') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'payment') {
      setPaymentScreenshot(files[0]);
    } else {
      setDesignFiles(Array.from(files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartState.items.length === 0) {
      toast({
        title: "ত্রুটি!",
        description: "আপনার কার্ট খালি। প্রথমে কিছু প্রোডাক্ট যোগ করুন।",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    
    // Prepare order data
    const orderData = {
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail || null,
      district: form.district,
      thana: form.thana,
      address: form.address,
      items: cartState.items,
      totalAmount: getTotalPrice().toString(),
      paymentMethod: form.paymentMethod,
      paymentNumber: form.paymentNumber,
      notes: form.notes || null,
      status: 'pending',
    };

    formData.append('orderData', JSON.stringify(orderData));

    // Add payment screenshot if provided
    if (paymentScreenshot) {
      formData.append('paymentScreenshot', paymentScreenshot);
    }

    // Add custom design files if provided
    if (designFiles.length > 0) {
      const customDesigns = designFiles.map((file, index) => ({
        designType: 'photo',
        designData: { fileName: file.name, fileIndex: index },
        instructions: form.notes,
      }));
      
      formData.append('customDesigns', JSON.stringify(customDesigns));
      
      designFiles.forEach((file, index) => {
        formData.append(`designs`, file);
      });
    }

    createOrderMutation.mutate(formData);
  };

  const getTotalPrice = () => {
    return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-neutral mb-4">কার্ট খালি</h2>
            <p className="text-gray-600 mb-6">চেকআউট করার জন্য প্রথমে কিছু প্রোডাক্ট যোগ করুন।</p>
            <Link href="/">
              <Button>
                <i className="fas fa-arrow-left mr-2"></i>
                শপিং চালিয়ে যান
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral mb-2">{language === 'bn' ? 'চেকআউট' : 'Checkout'}</h1>
            <p className="text-gray-600">আপনার অর্ডার সম্পন্ন করুন</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'কাস্টমার তথ্য' : 'Customer Information'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">{language === 'bn' ? 'নাম' : 'Name'} *</Label>
                        <Input
                          id="customerName"
                          value={form.customerName}
                          onChange={(e) => handleInputChange('customerName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerPhone">{language === 'bn' ? 'ফোন নাম্বার' : 'Phone'} *</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          value={form.customerPhone}
                          onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                          placeholder="01XXXXXXXXX"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">{language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={form.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>ডেলিভারি ঠিকানা</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="district">{language === 'bn' ? 'জেলা' : 'District'} *</Label>
                        <Select
                          value={form.district}
                          onValueChange={(value) => handleInputChange('district', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'bn' ? 'জেলা নির্বাচন করুন' : 'Select District'} />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district.name} value={district.name}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="thana">{language === 'bn' ? 'থানা' : 'Thana'} *</Label>
                        <Select
                          value={form.thana}
                          onValueChange={(value) => handleInputChange('thana', value)}
                          disabled={!form.district}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'bn' ? 'থানা নির্বাচন করুন' : 'Select Thana'} />
                          </SelectTrigger>
                          <SelectContent>
                            {thanas.map((thana) => (
                              <SelectItem key={thana} value={thana}>
                                {thana}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">{language === 'bn' ? 'ঠিকানা' : 'Address'} *</Label>
                      <Textarea
                        id="address"
                        value={form.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="বিস্তারিত ঠিকানা লিখুন"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>পেমেন্ট তথ্য</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="paymentMethod">পেমেন্ট পদ্ধতি *</Label>
                      <Select
                        value={form.paymentMethod}
                        onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bkash">bKash</SelectItem>
                          <SelectItem value="nagad">Nagad</SelectItem>
                          <SelectItem value="upay">Upay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {form.paymentMethod && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-2">পেমেন্ট নির্দেশনা:</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>01747292277</strong> নাম্বারে Send Money করুন
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          পেমেন্ট সম্পন্ন হওয়ার পর স্ক্রিনশট আপলোড করুন
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="paymentNumber">আপনার পেমেন্ট নাম্বার</Label>
                      <Input
                        id="paymentNumber"
                        value={form.paymentNumber}
                        onChange={(e) => handleInputChange('paymentNumber', e.target.value)}
                        placeholder="যে নাম্বার থেকে পেমেন্ট করেছেন"
                      />
                    </div>

                    <div>
                      <Label htmlFor="paymentScreenshot">পেমেন্ট স্ক্রিনশট</Label>
                      <Input
                        id="paymentScreenshot"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'payment')}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Design Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>কাস্টম ডিজাইন</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="designFiles">ডিজাইন ফাইল আপলোড করুন</Label>
                      <Input
                        id="designFiles"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'design')}
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        একাধিক ফাইল নির্বাচন করতে পারেন। JPG, PNG, GIF সাপোর্টেড।
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="notes">বিশেষ নির্দেশনা</Label>
                      <Textarea
                        id="notes"
                        value={form.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="ডিজাইন সম্পর্কে কোন বিশেষ নির্দেশনা থাকলে লিখুন"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full py-3 text-lg"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      অর্ডার প্রক্রিয়াধীন...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      {language === 'bn' ? 'অর্ডার করুন' : 'Place Order'}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.customization && typeof item.customization === 'string' && (
                            <p className="text-sm text-gray-600">{item.customization}</p>
                          )}
                          {item.customization && typeof item.customization === 'object' && (
                            <p className="text-sm text-gray-600">
                              {Object.entries(item.customization).map(([key, value]) => 
                                `${key}: ${value}`
                              ).join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold">৳{item.price * item.quantity}</span>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>{language === 'bn' ? 'মোট' : 'Total'}:</span>
                      <span className="text-primary">৳{getTotalPrice()}</span>
                    </div>

                    <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold mb-1">দয়া করে নোট করুন:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• পেমেন্ট সম্পন্ন হওয়ার পর অর্ডার কনফার্ম হবে</li>
                        <li>• ২৪-৪৮ ঘন্টার মধ্যে প্রোডাক্ট প্রস্তুত হবে</li>
                        <li>• ট্র্যাকিং আইডি দিয়ে অর্ডার ট্র্যাক করতে পারবেন</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
