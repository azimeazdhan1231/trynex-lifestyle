import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Facebook, Clock, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function ContactPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      apiRequest('/api/contact', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({
        title: language === 'bn' ? "বার্তা পাঠানো হয়েছে!" : "Message Sent!",
        description: language === 'bn' ? "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।" : "We will contact you shortly.",
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    },
    onError: () => {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "বার্তা পাঠাতে সমস্যা হয়েছে।" : "Failed to send message.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আমাদের সাথে যোগাযোগ করুন। আমরা আপনার সেবায় সর্বদা প্রস্তুত।'
              : 'Get in touch with us. We are always ready to serve you.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'bn' ? 'ফোন' : 'Phone'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">+880 1940-689487</p>
                <p className="text-sm text-gray-500">
                  {language === 'bn' ? 'সকাল ৯টা - রাত ১০টা' : '9 AM - 10 PM'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {language === 'bn' ? 'ইমেইল' : 'Email'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">info@trynex.com</p>
                <p className="text-sm text-gray-500">
                  {language === 'bn' ? '২৪ ঘন্টার মধ্যে উত্তর' : 'Reply within 24 hours'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {language === 'bn' ? 'ঠিকানা' : 'Address'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">
                  {language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'bn' ? 'সারাদেশে ডেলিভারি' : 'Nationwide delivery'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Facebook className="w-5 h-5 mr-2" />
                  {language === 'bn' ? 'ফেইসবুক পেইজ' : 'Facebook Page'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {language === 'bn' 
                    ? 'আমাদের ফেইসবুক পেইজে লাইক দিন এবং সর্বশেষ আপডেট পান।'
                    : 'Like our Facebook page and get latest updates.'
                  }
                </p>
                <a 
                  href="https://www.facebook.com/people/TryNex-Lifestyle/61576151563336/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'পেইজ দেখুন' : 'Visit Page'}
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'bn' ? 'নাম *' : 'Name *'}
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'bn' ? 'ইমেইল *' : 'Email *'}
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={language === 'bn' ? 'আপনার ইমেইল লিখুন' : 'Enter your email'}
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'bn' ? 'ফোন' : 'Phone'}
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={language === 'bn' ? 'আপনার ফোন নম্বর' : 'Your phone number'}
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'bn' ? 'বিষয় *' : 'Subject *'}
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder={language === 'bn' ? 'বার্তার বিষয়' : 'Message subject'}
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'bn' ? 'বার্তা *' : 'Message *'}
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={language === 'bn' ? 'আপনার বার্তা লিখুন...' : 'Write your message...'}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                  >
                    {contactMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        {language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Hours */}
        <Card className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center">
                <Clock className="w-5 h-5 mr-2" />
                {language === 'bn' ? 'ব্যবসায়িক সময়' : 'Business Hours'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
                <div>
                  <strong>{language === 'bn' ? 'সোম - শুক্র:' : 'Mon - Fri:'}</strong>
                  <br />
                  {language === 'bn' ? 'সকাল ৯টা - রাত ১০টা' : '9:00 AM - 10:00 PM'}
                </div>
                <div>
                  <strong>{language === 'bn' ? 'শনি - রবি:' : 'Sat - Sun:'}</strong>
                  <br />
                  {language === 'bn' ? 'সকাল ১০টা - রাত ৮টা' : '10:00 AM - 8:00 PM'}
                </div>
                <div>
                  <strong>{language === 'bn' ? 'জরুরি সহায়তা:' : 'Emergency Support:'}</strong>
                  <br />
                  {language === 'bn' ? '২৪/৭ অনলাইন' : '24/7 Online'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CEO Contact */}
        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">
              {language === 'bn' ? 'সিইও এর সাথে সরাসরি যোগাযোগ' : 'Direct Contact with CEO'}
            </h3>
            <p className="text-blue-600 dark:text-blue-300 mb-4">
              {language === 'bn' 
                ? 'গুরুত্বপূর্ণ বিষয়ে সরাসরি আমাদের সিইও এর সাথে যোগাযোগ করুন।'
                : 'Contact our CEO directly for important matters.'
              }
            </p>
            <a 
              href="https://www.facebook.com/ahmed.amit.333" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'সিইও ফেইসবুক' : 'CEO Facebook'}
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}